import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'

// Créer un nouveau questionnaire partagé
export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = createAdminClient()

    let resend: Resend | null = null
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your_resend_api_key_here') {
      resend = new Resend(process.env.RESEND_API_KEY)
    }

    const { creator_email } = await request.json()

    // Générer un code de partage unique via Supabase
    const { data: codeResult } = await supabaseAdmin
      .rpc('generate_share_code')
    
    if (!codeResult) {
      return NextResponse.json(
        { error: 'Impossible de générer un code de partage' },
        { status: 500 }
      )
    }

    const shareCode = codeResult
    

    // Créer l'entrée questionnaire partagé
    const { data: shared, error } = await supabaseAdmin
      .from('shared_questionnaires')
      .insert([
        {
          share_code: shareCode,
          creator_email: creator_email,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('❌ Error creating shared questionnaire:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la création du questionnaire partagé', details: error.message },
        { status: 500 }
      )
    }


    // Utiliser l'URL de la requête pour générer l'URL de partage
    const url = new URL(request.url)
    const baseUrl = `${url.protocol}//${url.host}`
    const shareUrl = `${baseUrl}/questionnaire/shared/${shareCode}`

    // Envoyer automatiquement l'email avec le lien
    let emailSent = false
    if (resend && creator_email) {
      try {
        
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #6366f1; margin: 0;">💕 NikahScore</h1>
              <p style="color: #6b7280; margin: 5px 0;">Votre questionnaire de compatibilité</p>
            </div>
            
            <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin: 20px 0;">
              <h2 style="color: #1f2937; margin-top: 0;">🔗 Votre lien de partage est prêt !</h2>
              
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
                <li>Recevez votre analyse de compatibilité une fois terminé</li>
              </ol>
            </div>
          </div>
        `

        await resend.emails.send({
          from: 'NikahScore <noreply@nikahscore.com>',
          to: [creator_email],
          subject: '🔗 Votre questionnaire de compatibilité est prêt !',
          html: emailHtml,
        })

        emailSent = true
      } catch (emailError) {
      }
    } else {
    }

    return NextResponse.json({
      success: true,
      share_code: shareCode,
      share_url: shareUrl,
      shared,
      email_sent: emailSent
    })

  } catch (error) {
    console.error('❌ Error creating shared questionnaire:', error)
    return NextResponse.json(
      { 
        error: 'Erreur serveur', 
        details: error instanceof Error ? error.message : 'Erreur inconnue' 
      },
      { status: 500 }
    )
  }
}