import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { couple_code, user_id, responses } = await request.json()

    if (!couple_code || !user_id || !responses) {
      return NextResponse.json(
        { error: 'Couple code, user ID, and responses are required' },
        { status: 400 }
      )
    }

    // Vérifier que l'utilisateur fait partie du couple
    const { data: couple, error: coupleError } = await supabaseAdmin
      .from('couple_questionnaires')
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
      .from('couple_responses')
      .select('id')
      .eq('couple_code', couple_code)
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
      .from('couple_responses')
      .insert([
        {
          couple_code,
          user_id,
          responses: JSON.stringify(responses),
          role,
          submitted_at: new Date().toISOString()
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
      .from('couple_responses')
      .select('role')
      .eq('couple_code', couple_code)

    const bothCompleted = allResponses && allResponses.length === 2

    if (bothCompleted) {
      // Marquer le questionnaire couple comme terminé
      await supabaseAdmin
        .from('couple_questionnaires')
        .update({
          completed_at: new Date().toISOString(),
          status: 'completed'
        })
        .eq('couple_code', couple_code)
    }

    console.log('✅ Réponses couple sauvegardées:', couple_code, role)

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
    const { searchParams } = new URL(request.url)
    const couple_code = searchParams.get('code')

    if (!couple_code) {
      return NextResponse.json(
        { error: 'Couple code is required' },
        { status: 400 }
      )
    }

    // Récupérer toutes les réponses du couple
    const { data: responses, error } = await supabaseAdmin
      .from('couple_responses')
      .select(`
        *,
        user:user_id (name, email)
      `)
      .eq('couple_code', couple_code)
      .order('submitted_at', { ascending: true })

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
