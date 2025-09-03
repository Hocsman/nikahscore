import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { responses, user_id } = await request.json()

    if (!responses || !user_id) {
      return NextResponse.json(
        { error: 'Réponses et ID utilisateur requis' },
        { status: 400 }
      )
    }

    // Générer un code de partage unique
    const shareCode = generateShareCode()

    // Sauvegarder les réponses avec le code de partage
    const { data, error } = await supabaseAdmin
      .from('questionnaire_shares')
      .insert([
        {
          share_code: shareCode,
          user1_id: user_id,
          user1_responses: responses,
          created_at: new Date().toISOString(),
          status: 'waiting_partner'
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating questionnaire share:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la création du partage' },
        { status: 500 }
      )
    }

    console.log('✅ Questionnaire partagé créé:', shareCode)

    return NextResponse.json({
      success: true,
      share_code: shareCode,
      share_url: `${process.env.NEXT_PUBLIC_BASE_URL}/questionnaire/shared/${shareCode}`
    })

  } catch (error) {
    console.error('Error in questionnaire sharing:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

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

    // Récupérer les informations du partage
    const { data: share, error } = await supabaseAdmin
      .from('questionnaire_shares')
      .select(`
        *,
        user1:user1_id (email),
        user2:user2_id (email)
      `)
      .eq('share_code', share_code)
      .single()

    if (error || !share) {
      return NextResponse.json(
        { error: 'Questionnaire partagé introuvable' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      share: share
    })

  } catch (error) {
    console.error('Error fetching questionnaire share:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

function generateShareCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
