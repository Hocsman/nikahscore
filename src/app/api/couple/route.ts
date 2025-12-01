import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { user_id } = await request.json()

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Générer un code couple unique
    const { data: codeResult } = await supabaseAdmin
      .rpc('generate_couple_code')

    if (!codeResult) {
      return NextResponse.json(
        { error: 'Failed to generate couple code' },
        { status: 500 }
      )
    }

    // Créer l'entrée couple
    const { data: couple, error } = await supabaseAdmin
      .from('couples')
      .insert([
        {
          couple_code: codeResult,
          creator_id: user_id,
          status: 'waiting_partner',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating couple:', error)
      return NextResponse.json(
        { error: 'Failed to create couple questionnaire' },
        { status: 500 }
      )
    }


    return NextResponse.json({
      success: true,
      couple_code: codeResult,
      couple_id: couple.id,
      share_url: `${process.env.NEXT_PUBLIC_BASE_URL}/questionnaire/couple/${codeResult}`
    })

  } catch (error) {
    console.error('Error in couple creation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const couple_code = searchParams.get('code')
    const user_id = searchParams.get('user_id')

    if (!couple_code) {
      return NextResponse.json(
        { error: 'Couple code is required' },
        { status: 400 }
      )
    }

    // Récupérer les informations du couple
    const { data: couple, error } = await supabaseAdmin
      .from('couples')
      .select('*')
      .eq('couple_code', couple_code)
      .single()

    if (error || !couple) {
      return NextResponse.json(
        { error: 'Couple questionnaire not found' },
        { status: 404 }
      )
    }

    // Déterminer le rôle de l'utilisateur actuel
    let user_role = 'guest'
    if (user_id) {
      if (couple.creator_id === user_id) {
        user_role = 'creator'
      } else if (couple.partner_id === user_id) {
        user_role = 'partner'
      }
    }

    return NextResponse.json({
      success: true,
      couple: {
        ...couple,
        user_role
      }
    })

  } catch (error) {
    console.error('Error fetching couple:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
