import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/couple/check
 * Vérifie si l'utilisateur connecté a créé ou rejoint un couple
 */
export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const user_id = user.id

    // Vérifier si l'utilisateur est créateur ou partenaire d'un couple - Deux requêtes séparées
    const [creatorResult, partnerResult] = await Promise.all([
      supabase
        .from('couples')
        .select('id, couple_code, status, creator_id, partner_id')
        .eq('creator_id', user_id)
        .limit(1)
        .maybeSingle(),
      supabase
        .from('couples')
        .select('id, couple_code, status, creator_id, partner_id')
        .eq('partner_id', user_id)
        .limit(1)
        .maybeSingle()
    ])

    if (creatorResult.error && creatorResult.error.code !== 'PGRST116') {
      console.error('❌ Erreur Supabase check couple (creator):', creatorResult.error)
      return NextResponse.json(
        { success: false, error: 'Erreur lors de la vérification du couple' },
        { status: 500 }
      )
    }

    if (partnerResult.error && partnerResult.error.code !== 'PGRST116') {
      console.error('❌ Erreur Supabase check couple (partner):', partnerResult.error)
      return NextResponse.json(
        { success: false, error: 'Erreur lors de la vérification du couple' },
        { status: 500 }
      )
    }

    // Prendre le premier couple trouvé (priorité au créateur)
    const couples = creatorResult.data || partnerResult.data

    if (!couples) {
      // Aucun couple trouvé
      return NextResponse.json({
        success: true,
        hasCouple: false,
        message: 'Aucun couple trouvé pour cet utilisateur'
      })
    }

    // Couple trouvé
    return NextResponse.json({
      success: true,
      hasCouple: true,
      couple_code: couples.couple_code,
      couple_id: couples.id,
      status: couples.status,
      is_creator: couples.creator_id === user_id
    })

  } catch (error) {
    console.error('❌ Erreur check couple:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Erreur serveur' 
      },
      { status: 500 }
    )
  }
}
