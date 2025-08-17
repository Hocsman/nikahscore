import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabase } from '@/lib/supabaseClient'
import { hashEmail, generateInviteToken } from '@/lib/crypto'

const createPairSchema = z.object({
  a_email: z.string().email(),
  b_email: z.string().email().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { a_email, b_email } = createPairSchema.parse(body)

    // Hasher les emails pour l'anonymisation
    const a_hash = hashEmail(a_email)
    const b_hash = b_email ? hashEmail(b_email) : null

    // Générer un token d'invitation unique
    const inviteToken = generateInviteToken()

    // Créer la paire dans Supabase
    const { data: pair, error } = await supabase
      .from('pairs')
      .insert({
        user_a_email: a_email,
        user_b_email: b_email || null,
        user_a_hash: a_hash,
        user_b_hash: b_hash,
        invite_token: inviteToken,
        status: 'pending',
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 jours
      })
      .select()
      .single()

    if (error) {
      console.error('Erreur création paire:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la création de la paire' },
        { status: 500 }
      )
    }

    // Construire l'URL d'invitation
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const inviteUrl = `${baseUrl}/invite/${pair.id}`

    // Si un email B est fourni, envoyer l'invitation immédiatement
    if (b_email) {
      try {
        await fetch(`${baseUrl}/api/email/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'invite',
            email: b_email,
            inviteUrl,
            pairId: pair.id,
          }),
        })
      } catch (emailError) {
        console.error('Erreur envoi email:', emailError)
        // Ne pas faire échouer la création de la paire si l'email échoue
      }
    }

    return NextResponse.json({
      success: true,
      pairId: pair.id,
      inviteUrl,
      inviteToken,
    })

  } catch (error) {
    console.error('Erreur API create pair:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
