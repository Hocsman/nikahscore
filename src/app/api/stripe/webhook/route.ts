import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-07-30.basil'
    })
  : null

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  try {
    // Vérifier que Stripe est configuré
    if (!stripe || !webhookSecret) {
      return NextResponse.json(
        { error: 'Stripe non configuré' },
        { status: 500 }
      )
    }

    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Signature Stripe manquante' },
        { status: 400 }
      )
    }

    // Vérifier la signature du webhook
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Erreur signature webhook:', err)
      return NextResponse.json(
        { error: 'Signature invalide' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Traiter les différents types d'événements
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session, supabase)
        break

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription, supabase)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription, supabase)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(event.data.object as Stripe.Subscription, supabase)
        break

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice, supabase)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice, supabase)
        break

      default:
        console.log(`Événement non géré: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Erreur webhook Stripe:', error)
    return NextResponse.json(
      { error: 'Erreur traitement webhook' },
      { status: 500 }
    )
  }
}

// Traiter la completion du checkout
async function handleCheckoutCompleted(session: Stripe.Checkout.Session, supabase: any) {
  try {
    if (!stripe) {
      console.error('Stripe non configuré pour handleCheckoutCompleted')
      return
    }

    const userId = session.metadata?.userId
    const plan = session.metadata?.plan

    if (!userId || !plan) {
      console.error('Métadonnées manquantes dans la session:', session.id)
      return
    }

    // Récupérer les détails de la subscription
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

    // Mettre à jour la subscription utilisateur
    const { error } = await supabase
      .from('user_subscriptions')
      .upsert([{
        user_id: userId,
        stripe_customer_id: session.customer,
        stripe_subscription_id: subscription.id,
        plan: plan,
        status: 'active',
        current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
        current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])

    if (error) {
      console.error('Erreur mise à jour subscription:', error)
      return
    }

    // Logger l'événement analytics
    await supabase
      .from('analytics_events')
      .insert([{
        event_type: 'plan_upgrade_completed',
        user_id: userId,
        session_id: `webhook_${Date.now()}`,
        timestamp: new Date().toISOString(),
        properties: {
          plan: plan,
          stripe_session_id: session.id,
          stripe_subscription_id: subscription.id,
          amount_paid: session.amount_total
        }
      }])


  } catch (error) {
    console.error('Erreur handleCheckoutCompleted:', error)
  }
}

// Traiter la création de subscription
async function handleSubscriptionCreated(subscription: Stripe.Subscription, supabase: any) {
  try {
    const userId = subscription.metadata?.userId
    const plan = subscription.metadata?.plan

    if (!userId || !plan) {
      console.log('Métadonnées manquantes dans la subscription:', subscription.id)
      return
    }

    // Vérifier si la subscription existe déjà
    const { data: existing } = await supabase
      .from('user_subscriptions')
      .select('id')
      .eq('stripe_subscription_id', subscription.id)
      .single()

    if (!existing) {
      await supabase
        .from('user_subscriptions')
        .insert([{
          user_id: userId,
          stripe_customer_id: subscription.customer,
          stripe_subscription_id: subscription.id,
          plan: plan,
          status: subscription.status,
          current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
          current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString()
        }])
    }


  } catch (error) {
    console.error('Erreur handleSubscriptionCreated:', error)
  }
}

// Traiter la mise à jour de subscription
async function handleSubscriptionUpdated(subscription: Stripe.Subscription, supabase: any) {
  try {
    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        status: subscription.status,
        current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
        current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscription.id)

    if (error) {
      console.error('Erreur mise à jour subscription:', error)
    } else {
    }

  } catch (error) {
    console.error('Erreur handleSubscriptionUpdated:', error)
  }
}

// Traiter l'annulation de subscription
async function handleSubscriptionCanceled(subscription: Stripe.Subscription, supabase: any) {
  try {
    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        status: 'cancelled',
        canceled_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscription.id)

    // Logger pour analytics
    const { data: userSub } = await supabase
      .from('user_subscriptions')
      .select('user_id')
      .eq('stripe_subscription_id', subscription.id)
      .single()

    if (userSub?.user_id) {
      await supabase
        .from('analytics_events')
        .insert([{
          event_type: 'subscription_cancelled',
          user_id: userSub.user_id,
          session_id: `webhook_${Date.now()}`,
          timestamp: new Date().toISOString(),
          properties: {
            stripe_subscription_id: subscription.id,
            reason: 'user_cancelled'
          }
        }])
    }


  } catch (error) {
    console.error('Erreur handleSubscriptionCanceled:', error)
  }
}

// Traiter un paiement réussi
async function handlePaymentSucceeded(invoice: Stripe.Invoice, supabase: any) {
  try {
    if (!(invoice as any).subscription) return

    // Logger le paiement pour analytics
    const { data: userSub } = await supabase
      .from('user_subscriptions')
      .select('user_id, plan')
      .eq('stripe_subscription_id', (invoice as any).subscription)
      .single()

    if (userSub?.user_id) {
      await supabase
        .from('analytics_events')
        .insert([{
          event_type: 'payment_succeeded',
          user_id: userSub.user_id,
          session_id: `webhook_${Date.now()}`,
          timestamp: new Date().toISOString(),
          properties: {
            stripe_invoice_id: invoice.id,
            amount_paid: (invoice as any).amount_paid,
            plan: userSub.plan
          }
        }])
    }


  } catch (error) {
    console.error('Erreur handlePaymentSucceeded:', error)
  }
}

// Traiter un paiement échoué
async function handlePaymentFailed(invoice: Stripe.Invoice, supabase: any) {
  try {
    if (!(invoice as any).subscription) return

    // Logger l'échec pour analytics
    const { data: userSub } = await supabase
      .from('user_subscriptions')
      .select('user_id, plan')
      .eq('stripe_subscription_id', (invoice as any).subscription)
      .single()

    if (userSub?.user_id) {
      await supabase
        .from('analytics_events')
        .insert([{
          event_type: 'payment_failed',
          user_id: userSub.user_id,
          session_id: `webhook_${Date.now()}`,
          timestamp: new Date().toISOString(),
          properties: {
            stripe_invoice_id: invoice.id,
            amount: (invoice as any).amount_due,
            plan: userSub.plan,
            failure_reason: (invoice as any).last_finalization_error?.message || 'Unknown'
          }
        }])
    }


  } catch (error) {
    console.error('Erreur handlePaymentFailed:', error)
  }
}
