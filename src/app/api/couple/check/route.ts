import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/couple/check
 * Vérifie si un utilisateur a créé ou rejoint un couple
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const user_id = searchParams.get('user_id')

    if (!user_id) {
      return NextResponse.json(
        { success: false, error: 'user_id requis' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Vérifier si l'utilisateur est créateur ou partenaire d'un couple
    const { data: couples, error } = await supabase
      .from('couples')
      .select('id, couple_code, status, creator_id, partner_id')
      .or(`creator_id.eq.${user_id},partner_id.eq.${user_id}`)
      .limit(1)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // Aucun couple trouvé
        return NextResponse.json({
          success: true,
          hasCouple: false,
          message: 'Aucun couple trouvé pour cet utilisateur'
        })
      }
      
      console.error('❌ Erreur Supabase check couple:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
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
        error: error instanceof Error ? error.message : 'Erreur serveur' 
      },
      { status: 500 }
    )
  }
}
