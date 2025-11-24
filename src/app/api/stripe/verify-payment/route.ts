import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

console.log('🔍 API verify-payment chargée !')

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-07-30.basil'
    })
  : null

export async function POST(request: NextRequest) {
  console.log('🔍 Vérification de paiement demandée')
  
  try {
    const { sessionId } = await request.json()

    console.log('📝 Session ID:', sessionId)

    if (!sessionId) {
      return NextResponse.json({
        success: false,
        error: 'Session ID manquant'
      }, { status: 400 })
    }

    // MODE DÉVELOPPEMENT : Détection et simulation
    if (sessionId.startsWith('cs_dev_') || sessionId.startsWith('cs_test_dev_') || sessionId.includes('mode=dev')) {
      console.log('🎭 Mode développement détecté pour session:', sessionId)
      
      return NextResponse.json({
        success: true,
        verified: true,
        devMode: true,
        payment: {
          id: sessionId,
          status: 'paid',
          amount: 999,
          currency: 'eur',
          plan: 'premium'
        },
        message: 'Paiement simulé validé'
      })
    }

    // MODE PRODUCTION : Vérification avec Stripe
    if (!stripe) {
      return NextResponse.json({
        success: false,
        error: 'Stripe non configuré'
      }, { status: 500 })
    }

    // Récupérer la session Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.json({
        success: false,
        error: 'Paiement non confirmé'
      }, { status: 400 })
    }

    // Extraire les métadonnées
    const { userId, plan } = session.metadata || {}

    if (!userId || !plan) {
      return NextResponse.json({
        success: false,
        error: 'Métadonnées manquantes'
      }, { status: 400 })
    }

    const supabase = await createClient()

    // Mettre à jour le plan de l'utilisateur
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        subscription_plan: plan,
        subscription_status: 'active',
        subscription_start: new Date().toISOString(),
        stripe_customer_id: session.customer,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (updateError) {
      console.error('Erreur mise à jour utilisateur:', updateError)
      return NextResponse.json({
        success: false,
        error: 'Erreur mise à jour du plan'
      }, { status: 500 })
    }

    // Enregistrer la transaction
    await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        stripe_session_id: sessionId,
        stripe_customer_id: session.customer,
        plan: plan,
        amount: session.amount_total,
        currency: session.currency,
        status: 'completed',
        created_at: new Date().toISOString()
      })

    // Log pour analytics
    await supabase
      .from('analytics_events')
      .insert({
        event_type: 'subscription_activated',
        user_id: userId,
        event_data: {
          plan,
          amount: session.amount_total,
          currency: session.currency,
          stripe_session_id: sessionId
        },
        created_at: new Date().toISOString()
      })

    return NextResponse.json({
      success: true,
      plan,
      amount: session.amount_total,
      customer: session.customer
    })

  } catch (error) {
    console.error('Erreur vérification paiement:', error)
    return NextResponse.json({
      success: false,
      error: 'Erreur serveur'
    }, { status: 500 })
  }
}
