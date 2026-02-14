import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
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
    const { couple_code, responses } = await request.json()

    if (!couple_code || !responses) {
      return NextResponse.json(
        { error: 'Couple code and responses are required' },
        { status: 400 }
      )
    }

    // Vérifier que l'utilisateur fait partie du couple
    const { data: couple, error: coupleError } = await supabaseAdmin
      .from('couples')
      .select('*')
      .eq('couple_code', couple_code)
      .single()

    if (coupleError || !couple) {
      return NextResponse.json(
        { error: 'Couple questionnaire not found' },
        { status: 404 }
      )
    }

    if (couple.creator_id !== user_id && couple.partner_id !== user_id) {
      return NextResponse.json(
        { error: 'You are not part of this couple questionnaire' },
        { status: 403 }
      )
    }

    // Déterminer le rôle
    const role = couple.creator_id === user_id ? 'creator' : 'partner'

    // Vérifier si l'utilisateur a déjà répondu
    const { data: existing } = await supabaseAdmin
      .from('responses')
      .select('id')
      .eq('couple_id', couple.id)
      .eq('user_id', user_id)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'You have already submitted responses for this couple questionnaire' },
        { status: 409 }
      )
    }

    // Sauvegarder les réponses
    const { error: insertError } = await supabaseAdmin
      .from('responses')
      .insert([
        {
          couple_id: couple.id,
          user_id,
          answers: responses,
          is_completed: true,
          completed_at: new Date().toISOString()
        }
      ])

    if (insertError) {
      console.error('Error saving couple responses:', insertError)
      return NextResponse.json(
        { error: 'Failed to save responses' },
        { status: 500 }
      )
    }

    // Vérifier si les deux partenaires ont répondu
    const { data: allResponses } = await supabaseAdmin
      .from('responses')
      .select('user_id')
      .eq('couple_id', couple.id)
      .eq('is_completed', true)

    const bothCompleted = allResponses && allResponses.length === 2

    if (bothCompleted) {
      // Marquer le questionnaire couple comme terminé
      await supabaseAdmin
        .from('couples')
        .update({
          completed_at: new Date().toISOString(),
          status: 'completed',
          creator_completed: true,
          partner_completed: true
        })
        .eq('couple_code', couple_code)
    }


    return NextResponse.json({
      success: true,
      message: 'Responses saved successfully',
      both_completed: bothCompleted
    })

  } catch (error) {
    console.error('Error saving couple responses:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const supabaseAdmin = createAdminClient()
    const { searchParams } = new URL(request.url)
    const couple_code = searchParams.get('code')

    if (!couple_code) {
      return NextResponse.json(
        { error: 'Couple code is required' },
        { status: 400 }
      )
    }

    // Récupérer le couple
    const { data: couple, error: coupleError } = await supabaseAdmin
      .from('couples')
      .select('id')
      .eq('couple_code', couple_code)
      .single()

    if (coupleError || !couple) {
      return NextResponse.json(
        { error: 'Couple not found' },
        { status: 404 }
      )
    }

    // Récupérer toutes les réponses du couple
    const { data: responses, error } = await supabaseAdmin
      .from('responses')
      .select('*')
      .eq('couple_id', couple.id)
      .order('completed_at', { ascending: true })

    if (error) {
      console.error('Error fetching couple responses:', error)
      return NextResponse.json(
        { error: 'Failed to fetch responses' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      responses: responses || []
    })

  } catch (error) {
    console.error('Error in couple responses:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
