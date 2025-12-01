import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

// Initialisation de Resend
let resend: Resend | null = null
if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your_resend_api_key_here') {
  resend = new Resend(process.env.RESEND_API_KEY)
}

export async function POST(request: NextRequest) {
  try {
    const { email, shareCode, shareUrl } = await request.json()

    if (!email || !shareCode || !shareUrl) {
      return NextResponse.json(
        { error: 'Email, code de partage et URL requis' },
        { status: 400 }
      )
    }

    if (!resend) {
      return NextResponse.json(
        { error: 'Service email non configuré' },
        { status: 503 }
      )
    }

    // Template d'email pour le lien de partage
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #6366f1; margin: 0;">💕 NikahScore</h1>
          <p style="color: #6b7280; margin: 5px 0;">Votre questionnaire de compatibilité</p>
        </div>
        
        <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin: 20px 0;">
          <h2 style="color: #1f2937; margin-top: 0;">🔗 Votre lien de partage est prêt !</h2>
          <p style="color: #4b5563; line-height: 1.6;">
            Bonjour ! Votre questionnaire de compatibilité matrimoniale a été créé avec succès.
          </p>
          
          <div style="background: white; border: 2px dashed #6366f1; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">Code de partage</p>
            <h3 style="margin: 8px 0; color: #1f2937; font-family: monospace; font-size: 24px;">${shareCode}</h3>
          </div>

          <div style="text-align: center; margin: 24px 0;">
            <a href="${shareUrl}" 
               style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
              🚀 Commencer le questionnaire
            </a>
          </div>
        </div>

        <div style="background: #ecfdf5; border-radius: 12px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #059669; margin-top: 0;">✨ Comment ça fonctionne ?</h3>
          <ol style="color: #065f46; line-height: 1.6;">
            <li>Cliquez sur le lien ci-dessus pour répondre aux questions</li>
            <li>Partagez le code <strong>${shareCode}</strong> avec votre partenaire</li>
            <li>Une fois que vous aurez tous les deux terminé, recevez votre analyse de compatibilité</li>
          </ol>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            © 2025 NikahScore - Plateforme de compatibilité matrimoniale islamique
          </p>
          <p style="color: #9ca3af; font-size: 12px; margin: 5px 0;">
            Lien de questionnaire : <a href="${shareUrl}" style="color: #6366f1;">${shareUrl}</a>
          </p>
        </div>
      </div>
    `

    const emailText = `
NikahScore - Votre questionnaire de compatibilité

Bonjour !

Votre questionnaire de compatibilité matrimoniale a été créé avec succès.

Code de partage : ${shareCode}
Lien direct : ${shareUrl}

Comment ça fonctionne ?
1. Cliquez sur le lien pour répondre aux questions
2. Partagez le code ${shareCode} avec votre partenaire  
3. Recevez votre analyse de compatibilité une fois terminé

© 2025 NikahScore
    `


    const result = await resend.emails.send({
      from: 'NikahScore <noreply@nikahscore.com>',
      to: [email],
      subject: '🔗 Votre questionnaire de compatibilité est prêt !',
      html: emailHtml,
      text: emailText,
    })


    return NextResponse.json({
      success: true,
      message: 'Email envoyé avec succès',
      emailId: result.data?.id
    })

  } catch (error) {
    console.error('❌ Erreur envoi email:', error)
    return NextResponse.json(
      { 
        error: 'Erreur lors de l\'envoi de l\'email',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}