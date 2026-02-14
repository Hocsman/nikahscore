import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const VALID_PLANS = ['premium', 'conseil'] as const
const VALID_BILLINGS = ['monthly', 'annual'] as const

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const supabase = await createClient()
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

    if (authError || !authUser) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe non configuré' },
        { status: 500 }
      )
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-07-30.basil' as Stripe.LatestApiVersion
    })

    const PRICE_IDS: Record<string, string | undefined> = {
      'premium-monthly': process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID,
      'premium-annual': process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID,
      'conseil-monthly': process.env.STRIPE_CONSEIL_MONTHLY_PRICE_ID,
      'conseil-annual': process.env.STRIPE_CONSEIL_ANNUAL_PRICE_ID,
    }

    const { plan, billing = 'monthly' } = await request.json()
    const userId = authUser.id
    const email = authUser.email

    // Validation des données
    if (!plan || !VALID_PLANS.includes(plan) || !VALID_BILLINGS.includes(billing)) {
      return NextResponse.json(
        { error: 'Plan ou billing invalide' },
        { status: 400 }
      )
    }

    // Construire la clé du Price ID
    const priceKey = `${plan}-${billing}` as keyof typeof PRICE_IDS
    const priceId = PRICE_IDS[priceKey]

    if (!priceId) {
      console.error('❌ Price ID introuvable pour:', priceKey)
      return NextResponse.json(
        { error: `Plan invalide: ${plan} (${billing})` },
        { status: 400 }
      )
    }

    // Construire l'URL de base
    const host = request.headers.get('host') || 'www.nikahscore.com'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const baseUrl = `${protocol}://${host}`

    // Créer une vraie session Stripe
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: email,
      client_reference_id: userId,
      metadata: {
        userId,
        plan,
        billing,
      },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing?canceled=true`,
      subscription_data: {
        metadata: {
          userId,
          plan,
          billing,
        },
      },
    })

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
    })

  } catch (error) {
    console.error('❌ Erreur création session Stripe:', error)
    return NextResponse.json(
      { error: 'Erreur création session de paiement' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Retourner les informations des plans sans révéler les Price IDs
    const plans = [
      {
        id: 'premium',
        name: 'Premium',
        monthlyPrice: 9.99,
        annualPrice: 79,
        features: ['Analyse détaillée', 'Rapport PDF', 'Graphiques avancés']
      },
      {
        id: 'conseil',
        name: 'Conseil',
        monthlyPrice: 49.99,
        annualPrice: 499,
        features: ['Consultation expert', 'Support personnalisé', 'Questions sur mesure']
      }
    ]

    return NextResponse.json({
      success: true,
      plans,
    })

  } catch (error) {
    console.error('Erreur récupération plans:', error)
    return NextResponse.json(
      { error: 'Erreur récupération des plans' },
      { status: 500 }
    )
  }
}