import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Créer un nouveau questionnaire partagé
export async function POST(request: NextRequest) {
  try {
    const { creator_email } = await request.json()

    // Générer un code de partage unique
    const { data: codeResult } = await supabaseAdmin
      .rpc('generate_share_code')

    if (!codeResult) {
      return NextResponse.json(
        { error: 'Impossible de générer un code de partage' },
        { status: 500 }
      )
    }

    // Créer l'entrée questionnaire partagé
    const { data: shared, error } = await supabaseAdmin
      .from('shared_questionnaires')
      .insert([
        {
          share_code: codeResult,
          creator_email: creator_email || null,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating shared questionnaire:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la création du questionnaire partagé' },
        { status: 500 }
      )
    }

    console.log('✅ Questionnaire partagé créé:', codeResult)

    // Utiliser l'URL de la requête pour générer l'URL de partage
    const url = new URL(request.url)
    const baseUrl = `${url.protocol}//${url.host}`

    return NextResponse.json({
      success: true,
      share_code: codeResult,
      share_url: `${baseUrl}/questionnaire/shared/${codeResult}`
    })

  } catch (error) {
    console.error('Error in shared questionnaire creation:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// Récupérer un questionnaire partagé
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const share_code = searchParams.get('code')

    if (!share_code) {
      return NextResponse.json(
        { error: 'Code de partage requis' },
        { status: 400 }
      )
    }

    // Récupérer le questionnaire partagé
    const { data: shared, error } = await supabaseAdmin
      .from('shared_questionnaires')
      .select('*')
      .eq('share_code', share_code)
      .single()

    if (error || !shared) {
      return NextResponse.json(
        { error: 'Questionnaire partagé introuvable' },
        { status: 404 }
      )
    }

    // Calculer le statut
    let status = 'waiting'
    if (shared.creator_completed_at && shared.partner_completed_at) {
      status = 'completed'
    } else if (shared.creator_completed_at || shared.partner_completed_at) {
      status = 'partial'
    }

    return NextResponse.json({
      success: true,
      shared: {
        ...shared,
        status
      }
    })

  } catch (error) {
    console.error('Error fetching shared questionnaire:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
