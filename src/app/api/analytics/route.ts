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
    
    const supabase = createClient()

    try {
      // Essayer d'abord avec la fonction sécurisée
      const { data: publicStats, error: statsError } = await supabase
        .rpc('get_public_analytics_stats')

      if (!statsError && publicStats) {
        const stats = publicStats[0] || {
          total_events: 0,
          unique_sessions: 0,
          unique_users: 0,
          events_by_type: {}
        }

        return NextResponse.json({
          success: true,
          data: {
            overview: {
              totalEvents: stats.total_events || 0,
              uniqueSessions: stats.unique_sessions || 0,
              uniqueUsers: stats.unique_users || 0,
              eventsByType: stats.events_by_type || {}
            }
          }
        })
      }
    } catch (funcError) {
      console.log('Function not available, using direct query')
    }

    // Fallback : requête directe (si permissions le permettent)
    const { data: events, error: directError } = await supabase
      .from('analytics_events')
      .select('event_type, session_id, user_id')
      .gte('timestamp', startDate)

    if (directError) {
      console.error('Erreur requête directe:', directError)
      
      // Fallback ultime : retourner des données fictives pour le développement
      return NextResponse.json({
        success: true,
        data: {
          overview: {
            totalEvents: 0,
            uniqueSessions: 0,
            uniqueUsers: 0,
            eventsByType: {
              'questionnaire_page_view': 0,
              'questionnaire_started': 0
            }
          },
          funnel: {
            questionnaire_started: 0,
            questionnaire_completed: 0,
            premium_features_clicked: 0,
            upgrade_buttons_clicked: 0,
            registrations: 0
          },
          conversion: {
            completion_rate: '0',
            premium_interest_rate: '0',
            upgrade_click_rate: '0'
          }
        }
      })
    }

    // Calculer les métriques à partir des données directes
    const eventsByType = events.reduce((acc: Record<string, number>, event) => {
      acc[event.event_type] = (acc[event.event_type] || 0) + 1
      return acc
    }, {})

    const uniqueSessions = new Set(events.map(e => e.session_id)).size
    const uniqueUsers = new Set(events.filter(e => e.user_id).map(e => e.user_id)).size

    const funnelMetrics = {
      questionnaire_started: eventsByType['questionnaire_started'] || 0,
      questionnaire_completed: eventsByType['questionnaire_completed'] || 0,
      premium_features_clicked: eventsByType['premium_feature_clicked'] || 0,
      upgrade_buttons_clicked: eventsByType['upgrade_button_clicked'] || 0,
      registrations: eventsByType['user_registered'] || 0
    }

    const conversionRates = {
      completion_rate: funnelMetrics.questionnaire_started > 0 
        ? (funnelMetrics.questionnaire_completed / funnelMetrics.questionnaire_started * 100).toFixed(2)
        : '0',
      premium_interest_rate: funnelMetrics.questionnaire_completed > 0
        ? (funnelMetrics.premium_features_clicked / funnelMetrics.questionnaire_completed * 100).toFixed(2)
        : '0',
      upgrade_click_rate: funnelMetrics.premium_features_clicked > 0
        ? (funnelMetrics.upgrade_buttons_clicked / funnelMetrics.premium_features_clicked * 100).toFixed(2)
        : '0'
    }

    return NextResponse.json({
      success: true,
      data: {
        period: { startDate },
        overview: {
          totalEvents: events.length,
          uniqueSessions,
          uniqueUsers,
          eventsByType
        },
        funnel: funnelMetrics,
        conversion: conversionRates,
        premiumFeatures: {},
        dailyStats: []
      }
    })

  } catch (error) {
    console.error('Erreur GET analytics:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
