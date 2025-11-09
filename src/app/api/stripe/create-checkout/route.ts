import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// Initialiser Stripe avec la clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil'
})

// Configuration des Price IDs depuis les variables d'environnement
const PRICE_IDS = {
  'premium-monthly': process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID!,
  'premium-annual': process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID!,
  'conseil-monthly': process.env.STRIPE_CONSEIL_MONTHLY_PRICE_ID!,
  'conseil-annual': process.env.STRIPE_CONSEIL_ANNUAL_PRICE_ID!,
}

export async function POST(request: NextRequest) {
  try {
    const { plan, billing = 'monthly', userId, email } = await request.json()

    // Validation des données
    if (!plan || !userId || !email) {
      return NextResponse.json(
        { error: 'Données manquantes: plan, userId et email requis' },
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
      { 
        error: 'Erreur création session de paiement',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
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