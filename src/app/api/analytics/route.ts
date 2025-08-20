import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { AnalyticsEventData } from '@/lib/analytics'

export async function POST(request: NextRequest) {
  try {
    const eventData: AnalyticsEventData = await request.json()
    
    // Validation des données
    if (!eventData.event || !eventData.sessionId || !eventData.timestamp) {
      return NextResponse.json(
        { error: 'Données d\'événement invalides' },
        { status: 400 }
      )
    }

    // Connexion Supabase
    const supabase = createClient()

    // Insérer l'événement dans la base de données
    const { error } = await supabase
      .from('analytics_events')
      .insert([{
        event_type: eventData.event,
        user_id: eventData.userId,
        session_id: eventData.sessionId,
        timestamp: new Date(eventData.timestamp).toISOString(),
        properties: eventData.properties || {},
        user_plan: eventData.userPlan,
        created_at: new Date().toISOString()
      }])

    if (error) {
      console.error('Erreur insertion analytics:', error)
      return NextResponse.json(
        { error: 'Erreur sauvegarde événement' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Erreur API analytics:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// Endpoint pour récupérer les métriques (dashboard admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('start_date') || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const endDate = searchParams.get('end_date') || new Date().toISOString()
    
    const supabase = createClient()

    // Métriques générales
    const { data: totalEvents, error: eventsError } = await supabase
      .from('analytics_events')
      .select('*')
      .gte('timestamp', startDate)
      .lte('timestamp', endDate)

    if (eventsError) {
      return NextResponse.json({ error: eventsError.message }, { status: 500 })
    }

    // Calculer les métriques clés
    const eventsByType = totalEvents?.reduce((acc, event) => {
      acc[event.event_type] = (acc[event.event_type] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    const uniqueSessions = new Set(totalEvents?.map(e => e.session_id)).size
    const uniqueUsers = new Set(totalEvents?.filter(e => e.user_id).map(e => e.user_id)).size

    // Entonnoir de conversion
    const funnelMetrics = {
      questionnaire_started: eventsByType['questionnaire_started'] || 0,
      questionnaire_completed: eventsByType['questionnaire_completed'] || 0,
      premium_features_clicked: eventsByType['premium_feature_clicked'] || 0,
      upgrade_buttons_clicked: eventsByType['upgrade_button_clicked'] || 0,
      registrations: eventsByType['user_registered'] || 0
    }

    // Taux de conversion
    const conversionRates = {
      completion_rate: funnelMetrics.questionnaire_started > 0 
        ? (funnelMetrics.questionnaire_completed / funnelMetrics.questionnaire_started * 100).toFixed(2)
        : 0,
      premium_interest_rate: funnelMetrics.questionnaire_completed > 0
        ? (funnelMetrics.premium_features_clicked / funnelMetrics.questionnaire_completed * 100).toFixed(2)
        : 0,
      upgrade_click_rate: funnelMetrics.premium_features_clicked > 0
        ? (funnelMetrics.upgrade_buttons_clicked / funnelMetrics.premium_features_clicked * 100).toFixed(2)
        : 0
    }

    // Événements premium par fonctionnalité
    const premiumFeatureClicks = totalEvents
      ?.filter(e => e.event_type === 'premium_feature_clicked')
      .reduce((acc, event) => {
        const feature = event.properties?.feature || 'unknown'
        acc[feature] = (acc[feature] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {}

    return NextResponse.json({
      success: true,
      data: {
        period: { startDate, endDate },
        overview: {
          totalEvents: totalEvents?.length || 0,
          uniqueSessions,
          uniqueUsers,
          eventsByType
        },
        funnel: funnelMetrics,
        conversion: conversionRates,
        premiumFeatures: premiumFeatureClicks,
        dailyStats: await getDailyStats(supabase, startDate, endDate)
      }
    })

  } catch (error) {
    console.error('Erreur GET analytics:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// Fonction helper pour les stats quotidiennes
async function getDailyStats(supabase: any, startDate: string, endDate: string) {
  const { data } = await supabase
    .rpc('get_daily_analytics', {
      start_date: startDate,
      end_date: endDate
    })

  return data || []
}
