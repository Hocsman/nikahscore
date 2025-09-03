import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { couple_code, partner_id } = await request.json()

    if (!couple_code || !partner_id) {
      return NextResponse.json(
        { error: 'Couple code and partner ID are required' },
        { status: 400 }
      )
    }

    // Vérifier que le couple existe et n'a pas encore de partenaire
    const { data: couple, error: fetchError } = await supabaseAdmin
      .from('couple_questionnaires')
      .select('*')
      .eq('couple_code', couple_code)
      .single()

    if (fetchError || !couple) {
      return NextResponse.json(
        { error: 'Couple questionnaire not found' },
        { status: 404 }
      )
    }

    if (couple.partner_id) {
      return NextResponse.json(
        { error: 'This couple questionnaire already has a partner' },
        { status: 409 }
      )
    }

    if (couple.creator_id === partner_id) {
      return NextResponse.json(
        { error: 'You cannot be your own partner' },
        { status: 400 }
      )
    }

    // Associer le partenaire au couple
    const { error: updateError } = await supabaseAdmin
      .from('couple_questionnaires')
      .update({
        partner_id: partner_id,
        partner_joined_at: new Date().toISOString()
      })
      .eq('couple_code', couple_code)

    if (updateError) {
      console.error('Error joining couple:', updateError)
      return NextResponse.json(
        { error: 'Failed to join couple questionnaire' },
        { status: 500 }
      )
    }

    console.log('✅ Partenaire rejoint le couple:', couple_code)

    return NextResponse.json({
      success: true,
      message: 'Successfully joined couple questionnaire'
    })

  } catch (error) {
    console.error('Error in couple join:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
