import { NextRequest, NextResponse } from 'next/server'

console.log('🔥 API Stripe create-checkout chargée (MODE DÉVELOPPEMENT)')

// Configuration des prix pour chaque plan
const PLAN_PRICES = {
  premium: {
    amount: 999, // 9,99€ en centimes
    name: 'Premium',
    features: ['Analyse détaillée', 'Rapport PDF', 'Graphiques avancés']
  },
  conseil: {
    amount: 4999, // 49,99€ en centimes  
    name: 'Conseil',
    features: ['Consultation expert', 'Support personnalisé', 'Questions sur mesure']
  }
}

export async function POST(request: NextRequest) {
  console.log('🚀 API POST appelée pour create-checkout (MODE DEV)')
  
  try {
    const { plan, userId, email, successUrl, cancelUrl } = await request.json()

    console.log('📝 Données reçues:', { plan, userId, email })

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

    console.log('✅ Validation réussie pour plan:', planConfig.name)

    // EN MODE DÉVELOPPEMENT : Simulation d'une session Stripe
    const fakeSession = {
      id: `cs_test_dev_${Date.now()}`,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id=cs_test_dev_${Date.now()}&mode=dev`,
      customer: `cus_dev_${userId.substring(0, 8)}`,
      mode: 'subscription',
      status: 'open'
    }

    console.log('🎭 Session Stripe simulée:', fakeSession.id)

    return NextResponse.json({
      success: true,
      checkoutUrl: fakeSession.url,
      sessionId: fakeSession.id,
      devMode: true,
      message: 'Mode développement - Paiement simulé'
    })

  } catch (error) {
    console.error('Erreur création session Stripe (DEV):', error)
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
    const plans = Object.entries(PLAN_PRICES).map(([key, config]) => ({
      id: key,
      name: config.name,
      price: config.amount / 100,
      priceDisplay: `${(config.amount / 100).toFixed(2)}€`,
      features: config.features,
      recommended: key === 'premium',
      popular: key === 'conseil'
    }))

    return NextResponse.json({
      success: true,
      plans: plans,
      devMode: true
    })

  } catch (error) {
    console.error('Erreur récupération plans:', error)
    return NextResponse.json(
      { error: 'Erreur récupération des plans' },
      { status: 500 }
    )
  }
}