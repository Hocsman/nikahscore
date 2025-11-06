import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import React from 'react'
import { renderToStream } from '@react-pdf/renderer'
import CompatibilityReport from '@/components/pdf/CompatibilityReport'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs' // Forcer runtime Node.js pour supporter @react-pdf/renderer

/**
 * POST /api/pdf/generate
 * Génère un PDF professionnel du rapport de compatibilité
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, couple_code } = body

    if (!user_id) {
      return NextResponse.json(
        { success: false, error: 'user_id requis' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Vérifier que l'utilisateur est Premium
    // TODO: Implémenter la vérification Premium depuis la BDD
    // Pour l'instant, on autorise tout le monde (à des fins de test)
    
    let coupleData: any = null
    let dimensions: any[] = []
    let strengths: string[] = []
    let improvements: string[] = []
    let recommendations: string[] = []

    // Si couple_code fourni, récupérer les données du couple
    if (couple_code) {
      const { data: couple, error: coupleError } = await supabase
        .from('couples')
        .select(`
          *,
          creator:creator_id(email, raw_user_meta_data),
          partner:partner_id(email, raw_user_meta_data)
        `)
        .eq('couple_code', couple_code)
        .single()

      if (coupleError) {
        console.error('❌ Erreur récupération couple:', coupleError)
        return NextResponse.json(
          { success: false, error: 'Couple introuvable' },
          { status: 404 }
        )
      }

      coupleData = couple

      // Récupérer les résultats de compatibilité
      const { data: results, error: resultsError } = await supabase
        .from('compatibility_results')
        .select('*')
        .eq('couple_id', couple.id)
        .order('completed_at', { ascending: false })
        .limit(1)
        .single()

      if (results) {
        // Construire les dimensions avec scores
        dimensions = [
          { name: 'Spiritualité', score: results.spirituality_score || 0, color: '#EC4899' },
          { name: 'Famille', score: results.family_score || 0, color: '#9333EA' },
          { name: 'Communication', score: results.communication_score || 0, color: '#3B82F6' },
          { name: 'Valeurs', score: results.values_score || 0, color: '#10B981' },
          { name: 'Finances', score: results.finance_score || 0, color: '#F59E0B' },
          { name: 'Intimité', score: results.intimacy_score || 0, color: '#EF4444' },
        ]

        // Identifier les forces (scores > 80%)
        dimensions.forEach(dim => {
          if (dim.score >= 80) {
            strengths.push(
              `Excellente compatibilité en ${dim.name.toLowerCase()} (${dim.score}%)`
            )
          }
        })

        // Identifier les points d'amélioration (scores < 70%)
        dimensions.forEach(dim => {
          if (dim.score < 70) {
            improvements.push(
              `Travailler la dimension ${dim.name.toLowerCase()} pour améliorer votre compatibilité`
            )
          }
        })

        // Recommandations personnalisées
        recommendations = [
          "Maintenez une communication ouverte et honnête sur vos attentes et besoins respectifs.",
          "Planifiez des moments de qualité ensemble pour renforcer votre lien émotionnel.",
          "Discutez régulièrement de vos objectifs de vie communs et ajustez-les au fil du temps.",
          "Respectez les différences de l'autre et voyez-les comme des opportunités de croissance.",
          "Consultez un conseiller conjugal si vous rencontrez des difficultés persistantes.",
        ]
      }
    } else {
      // Données par défaut si pas de couple_code
      dimensions = [
        { name: 'Spiritualité', score: 85, color: '#EC4899' },
        { name: 'Famille', score: 78, color: '#9333EA' },
        { name: 'Communication', score: 72, color: '#3B82F6' },
        { name: 'Valeurs', score: 90, color: '#10B981' },
        { name: 'Finances', score: 68, color: '#F59E0B' },
        { name: 'Intimité', score: 82, color: '#EF4444' },
      ]

      strengths = [
        "Excellente compatibilité spirituelle (85%)",
        "Valeurs familiales très alignées (90%)",
        "Bonne communication émotionnelle (82%)",
      ]

      improvements = [
        "Améliorer la communication quotidienne",
        "Discuter davantage des finances",
      ]

      recommendations = [
        "Maintenez une communication ouverte et honnête sur vos attentes et besoins respectifs.",
        "Planifiez des moments de qualité ensemble pour renforcer votre lien émotionnel.",
        "Discutez régulièrement de vos objectifs de vie communs et ajustez-les au fil du temps.",
        "Respectez les différences de l'autre et voyez-les comme des opportunités de croissance.",
        "Consultez un conseiller conjugal si vous rencontrez des difficultés persistantes.",
      ]
    }

    // Calculer le score global (moyenne des dimensions)
    const overallScore = Math.round(
      dimensions.reduce((sum, dim) => sum + dim.score, 0) / dimensions.length
    )

    // Récupérer les noms des utilisateurs
    const user1Name = coupleData?.creator?.raw_user_meta_data?.name || 
                     coupleData?.creator?.email?.split('@')[0] || 
                     'Utilisateur 1'
    const user2Name = coupleData?.partner?.raw_user_meta_data?.name || 
                     coupleData?.partner?.email?.split('@')[0] || 
                     'Utilisateur 2'

    // Générer le PDF
    const pdfDocument = (
      <CompatibilityReport
        coupleCode={couple_code || 'N/A'}
        user1Name={user1Name}
        user2Name={user2Name}
        overallScore={overallScore}
        dimensions={dimensions}
        strengths={strengths}
        improvements={improvements}
        recommendations={recommendations}
        generatedDate={new Date().toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      />
    )

    const pdfStream = await renderToStream(pdfDocument)

    // Convertir le stream en Buffer
    const chunks: Buffer[] = []
    for await (const chunk of pdfStream) {
      chunks.push(Buffer.from(chunk))
    }
    const pdfBuffer = Buffer.concat(chunks)

    // Retourner le PDF
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="NikahScore-Rapport-${couple_code || 'Compatibilite'}-${Date.now()}.pdf"`,
      },
    })

  } catch (error) {
    console.error('❌ Erreur génération PDF:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur serveur' 
      },
      { status: 500 }
    )
  }
}
