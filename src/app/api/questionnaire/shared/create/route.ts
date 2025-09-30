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

    // Générer un code de partage unique via Supabase
    const { data: codeResult } = await supabaseAdmin
      .rpc('generate_share_code')
    
    if (!codeResult) {
      return NextResponse.json(
        { error: 'Impossible de générer un code de partage' },
        { status: 500 }
      )
    }

    const shareCode = codeResult
    
    console.log('🔍 Tentative de création avec code:', shareCode)

    // Créer l'entrée questionnaire partagé
    const { data: shared, error } = await supabaseAdmin
      .from('shared_questionnaires')
      .insert([
        {
          share_code: shareCode,
          creator_email: creator_email,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('❌ Error creating shared questionnaire:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la création du questionnaire partagé', details: error.message },
        { status: 500 }
      )
    }

    console.log('✅ Questionnaire partagé créé:', shareCode)

    // Utiliser l'URL de la requête pour générer l'URL de partage
    const url = new URL(request.url)
    const baseUrl = `${url.protocol}//${url.host}`
    const shareUrl = `${baseUrl}/questionnaire/shared/${shareCode}`

    return NextResponse.json({
      success: true,
      share_code: shareCode,
      share_url: shareUrl,
      shared
    })

  } catch (error) {
    console.error('❌ Error creating shared questionnaire:', error)
    return NextResponse.json(
      { 
        error: 'Erreur serveur', 
        details: error instanceof Error ? error.message : 'Erreur inconnue' 
      },
      { status: 500 }
    )
  }
}