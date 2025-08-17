import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'
import { getEmailTemplate } from '@/lib/emails'

const resend = new Resend(process.env.RESEND_API_KEY)

const sendEmailSchema = z.object({
  type: z.enum(['invite', 'results_ready', 'reminder']),
  email: z.string().email(),
  pairId: z.string().uuid(),
  inviteUrl: z.string().url().optional(),
  resultsUrl: z.string().url().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, email, pairId, inviteUrl, resultsUrl } = sendEmailSchema.parse(body)

    // Générer le contenu de l'email selon le type
    const emailContent = getEmailTemplate(type, {
      email,
      pairId,
      inviteUrl,
      resultsUrl,
    })

    if (!emailContent) {
      return NextResponse.json(
        { error: 'Type d\'email non supporté' },
        { status: 400 }
      )
    }

    // Envoyer l'email via Resend
    const { data, error } = await resend.emails.send({
      from: 'NikahScore <noreply@nikahscore.com>',
      to: [email],
      subject: emailContent.subject,
      html: emailContent.html,
    })

    if (error) {
      console.error('Erreur envoi email Resend:', error)
      
      // Fallback vers Brevo si Resend échoue
      try {
        const brevoResponse = await sendWithBrevo(email, emailContent)
        if (brevoResponse.ok) {
          return NextResponse.json({
            success: true,
            provider: 'brevo',
            messageId: 'brevo-fallback',
          })
        }
      } catch (brevoError) {
        console.error('Erreur envoi email Brevo:', brevoError)
      }

      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      provider: 'resend',
      messageId: data?.id,
    })

  } catch (error) {
    console.error('Erreur API send email:', error)
    
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

// Fonction fallback pour Brevo
async function sendWithBrevo(email: string, content: { subject: string; html: string }) {
  if (!process.env.BREVO_API_KEY) {
    throw new Error('Clé API Brevo non configurée')
  }

  return fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: {
        name: 'NikahScore',
        email: 'noreply@nikahscore.com'
      },
      to: [{ email }],
      subject: content.subject,
      htmlContent: content.html,
    }),
  })
}
