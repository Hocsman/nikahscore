import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

// Initialiser Stripe seulement si la clé API existe
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-07-30.basil'
    })
  : null

// Configuration des prix pour chaque plan
const PLAN_PRICES = {
  premium: {
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID!,
    amount: 999, // 9,99€ en centimes
    name: 'Premium',
    features: ['Analyse détaillée', 'Rapport PDF', 'Graphiques avancés']
  },
  conseil: {
    priceId: process.env.STRIPE_CONSEIL_PRICE_ID!,
    amount: 4999, // 49,99€ en centimes
    name: 'Conseil',
    features: ['Consultation expert', 'Support personnalisé', 'Questions sur mesure']
  }
}

export async function POST(request: NextRequest) {
  try {
    // Vérifier que Stripe est configuré
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe non configuré - clé API manquante' },
        { status: 500 }
      )
    }

    const { plan, userId, email, successUrl, cancelUrl } = await request.json()

    // Validation des données
    if (!plan || !userId || !email) {
      return NextResponse.json(
        { error: 'Données manquantes: plan, userId et email requis' },
        { status: 400 }
      )
    }

    if (!PLAN_PRICES[plan as keyof typeof PLAN_PRICES]) {
      return NextResponse.json(
        { error: 'Plan invalide' },
        { status: 400 }
      )
    }

    const planConfig = PLAN_PRICES[plan as keyof typeof PLAN_PRICES]
    const supabase = createClient()

    // Vérifier que l'utilisateur existe
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Créer ou récupérer le customer Stripe
    let customerId: string

    const { data: existingCustomer } = await supabase
      .from('stripe_customers')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single()

    if (existingCustomer?.stripe_customer_id) {
      customerId = existingCustomer.stripe_customer_id
    } else {
      // Créer un nouveau customer Stripe
      const customer = await stripe.customers.create({
        email: email,
        metadata: {
          userId: userId,
          nikahscore_user: 'true'
        }
      })

      customerId = customer.id

      // Sauvegarder dans Supabase
      await supabase
        .from('stripe_customers')
        .insert([{
          user_id: userId,
          stripe_customer_id: customerId,
          email: email
        }])
    }

    // Créer la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: planConfig.priceId,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: successUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
      metadata: {
        userId: userId,
        plan: plan,
        nikahscore_upgrade: 'true'
      },
      subscription_data: {
        metadata: {
          userId: userId,
          plan: plan
        }
      },
      customer_update: {
        address: 'auto'
      },
      tax_id_collection: {
        enabled: true
      },
      automatic_tax: {
        enabled: true
      }
    })

    // Log de l'événement pour analytics
    await supabase
      .from('analytics_events')
      .insert([{
        event_type: 'checkout_session_created',
        user_id: userId,
        session_id: `stripe_${Date.now()}`,
        timestamp: new Date().toISOString(),
        properties: {
          plan: plan,
          amount: planConfig.amount,
          stripe_session_id: session.id
        }
      }])

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id
    })

  } catch (error) {
    console.error('Erreur création session Stripe:', error)
    return NextResponse.json(
      { 
        error: 'Erreur création session de paiement',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}

// Endpoint pour récupérer les plans disponibles
export async function GET() {
  try {
    const plans = Object.entries(PLAN_PRICES).map(([key, config]) => ({
      id: key,
      name: config.name,
      price: config.amount / 100, // Convertir en euros
      priceDisplay: `${(config.amount / 100).toFixed(2)}€`,
      features: config.features,
      recommended: key === 'premium', // Plan recommandé
      popular: key === 'family' // Plan populaire
    }))

    return NextResponse.json({
      success: true,
      plans: plans
    })

  } catch (error) {
    console.error('Erreur récupération plans:', error)
    return NextResponse.json(
      { error: 'Erreur récupération des plans' },
      { status: 500 }
    )
  }
}
