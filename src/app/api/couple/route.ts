import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export async function POST(_request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const user_id = user.id
    const supabaseAdmin = createAdminClient()

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
      share_url: `${process.env.NEXT_PUBLIC_BASE_URL}/questionnaire/shared/${codeResult}`
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
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const user_id = user?.id || null

    const supabaseAdmin = createAdminClient()
    const { searchParams } = new URL(request.url)
    const couple_code = searchParams.get('code')

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
