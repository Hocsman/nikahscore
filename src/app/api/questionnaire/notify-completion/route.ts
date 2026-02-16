import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'
import PartnerCompletedNotification from '@/emails/PartnerCompletedNotification'

export async function POST(request: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const supabaseAdmin = createAdminClient()
    const { shareCode } = await request.json()

    if (!shareCode) {
      return NextResponse.json(
        { error: 'Code de partage requis' },
        { status: 400 }
      )
    }

    // 1. Récupérer les données du questionnaire partagé
    const { data: sharedData, error: sharedError } = await supabaseAdmin
      .from('shared_questionnaires')
      .select('*')
      .eq('share_code', shareCode)
      .single()

    if (sharedError || !sharedData) {
      return NextResponse.json(
        { error: 'Questionnaire partagé introuvable' },
        { status: 404 }
      )
    }

    // 2. Vérifier que le partenaire a bien complété
    if (!sharedData.partner_completed_at) {
      return NextResponse.json(
        { error: 'Le partenaire n\'a pas encore complété le questionnaire' },
        { status: 400 }
      )
    }

    // 3. Vérifier si l'email a déjà été envoyé
    if (sharedData.notification_sent) {
      return NextResponse.json(
        { message: 'Email déjà envoyé', alreadySent: true },
        { status: 200 }
      )
    }

    // 4. Utiliser creator_email directement depuis shared_questionnaires
    const creatorEmail = sharedData.creator_email
    if (!creatorEmail) {
      return NextResponse.json(
        { error: 'Email du créateur introuvable' },
        { status: 404 }
      )
    }

    // 5. Préparer les données pour l'email
    const creatorName = creatorEmail.split('@')[0]
    const partnerName = sharedData.partner_email?.split('@')[0] || 'Votre partenaire'
    const completionDate = new Date().toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })

    // 6. Envoyer l'email
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'NikahScore <noreply@nikahscore.com>',
      to: creatorEmail,
      subject: `${partnerName} a complété le questionnaire NikahScore ! 💕`,
      react: PartnerCompletedNotification({
        creatorName,
        partnerName,
        shareCode,
        completionDate,
      }),
    })

    if (emailError) {
      console.error('Erreur envoi email:', emailError)
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email', details: emailError },
        { status: 500 }
      )
    }

    // 7. Marquer la notification comme envoyée
    const { error: updateError } = await supabaseAdmin
      .from('shared_questionnaires')
      .update({
        notification_sent: true,
        notification_sent_at: new Date().toISOString(),
      })
      .eq('share_code', shareCode)

    if (updateError) {
      console.error('Erreur mise à jour notification:', updateError)
    }

    // 8. Logger l'événement
    await supabaseAdmin.from('analytics_events').insert({
      event_type: 'partner_completed_notification_sent',
      user_id: sharedData.creator_id,
      metadata: {
        share_code: shareCode,
        partner_name: partnerName,
        email_id: emailData?.id,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Email de notification envoyé avec succès',
      emailId: emailData?.id,
    })

  } catch (error) {
    console.error('Erreur API notification:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'envoi de la notification' },
      { status: 500 }
    )
  }
}
