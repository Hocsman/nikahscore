import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import logger from '@/lib/logger'

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function POST(request: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { name, email, subject, message } = await request.json()
    
    // Validation des champs
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }
    
    // Validation email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      )
    }

    // Échapper les entrées utilisateur pour éviter le XSS dans le HTML
    const safeName = escapeHtml(name)
    const safeEmail = escapeHtml(email)
    const safeSubject = escapeHtml(subject)
    const safeMessage = escapeHtml(message)

    // 1. Envoi de l'email à l'équipe NikahScore
    const { data: adminEmailData, error: adminEmailError } = await resend.emails.send({
      from: 'NikahScore Contact <contact@nikahscore.com>', // ✅ Domaine vérifié
      to: 'support@nikahscore.com', // ✅ Email professionnel OVH
      reply_to: email, // Permet de répondre directement à l'utilisateur
      subject: `[Contact NikahScore] ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%);
              color: white;
              padding: 30px;
              border-radius: 12px 12px 0 0;
              text-align: center;
            }
            .content {
              background: #ffffff;
              padding: 30px;
              border: 1px solid #E5E7EB;
              border-top: none;
            }
            .info-box {
              background: #F9FAFB;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #EC4899;
            }
            .info-row {
              display: flex;
              margin-bottom: 12px;
            }
            .info-label {
              font-weight: 600;
              min-width: 100px;
              color: #6B7280;
            }
            .info-value {
              color: #111827;
            }
            .message-box {
              background: #ffffff;
              padding: 20px;
              border: 2px solid #EC4899;
              border-radius: 8px;
              margin: 20px 0;
            }
            .message-title {
              font-size: 18px;
              font-weight: 600;
              color: #EC4899;
              margin-bottom: 15px;
            }
            .message-content {
              color: #374151;
              white-space: pre-wrap;
              line-height: 1.8;
            }
            .footer {
              background: #F3F4F6;
              padding: 20px;
              border-radius: 0 0 12px 12px;
              text-align: center;
              color: #6B7280;
              font-size: 14px;
            }
            .reply-button {
              display: inline-block;
              background: linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%);
              color: white;
              padding: 12px 24px;
              border-radius: 8px;
              text-decoration: none;
              font-weight: 600;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">💌 Nouveau Message de Contact</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">NikahScore</p>
          </div>
          
          <div class="content">
            <p style="font-size: 16px; margin-top: 0;">
              Vous avez reçu un nouveau message via le formulaire de contact de <strong>nikahscore.com</strong>
            </p>
            
            <div class="info-box">
              <div class="info-row">
                <span class="info-label">👤 Nom:</span>
                <span class="info-value">${safeName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">📧 Email:</span>
                <span class="info-value"><a href="mailto:${safeEmail}" style="color: #EC4899;">${safeEmail}</a></span>
              </div>
              <div class="info-row">
                <span class="info-label">📋 Sujet:</span>
                <span class="info-value">${safeSubject}</span>
              </div>
              <div class="info-row">
                <span class="info-label">📅 Date:</span>
                <span class="info-value">${new Date().toLocaleString('fr-FR', { 
                  dateStyle: 'full', 
                  timeStyle: 'short',
                  timeZone: 'Europe/Paris'
                })}</span>
              </div>
            </div>
            
            <div class="message-box">
              <div class="message-title">📝 Message:</div>
              <div class="message-content">${safeMessage}</div>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="mailto:${safeEmail}?subject=Re: ${encodeURIComponent(subject)}" class="reply-button">
                Répondre à ${safeName}
              </a>
            </div>
          </div>
          
          <div class="footer">
            <p style="margin: 0;">
              💡 <strong>Astuce:</strong> Cliquez sur "Répondre" dans votre client email pour répondre directement à ${safeEmail}
            </p>
            <p style="margin: 10px 0 0 0; font-size: 12px;">
              © ${new Date().getFullYear()} NikahScore - Plateforme de Rencontre Halal
            </p>
          </div>
        </body>
        </html>
      `
    })
    
    if (adminEmailError) {
      console.error('❌ Erreur Resend (email admin):', adminEmailError)
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi du message. Veuillez réessayer.' },
        { status: 500 }
      )
    }
    
    
    // 2. Envoi de l'email de confirmation à l'utilisateur
    const { data: userEmailData, error: userEmailError } = await resend.emails.send({
      from: 'NikahScore Support <support@nikahscore.com>', // ✅ Domaine vérifié
      to: email,
      subject: 'Confirmation de réception - NikahScore',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%);
              color: white;
              padding: 40px 30px;
              border-radius: 12px 12px 0 0;
              text-align: center;
            }
            .content {
              background: #ffffff;
              padding: 30px;
              border: 1px solid #E5E7EB;
              border-top: none;
            }
            .success-icon {
              font-size: 60px;
              margin-bottom: 20px;
            }
            .highlight-box {
              background: #FEF3C7;
              border-left: 4px solid #F59E0B;
              padding: 20px;
              border-radius: 8px;
              margin: 25px 0;
            }
            .message-summary {
              background: #F3F4F6;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .footer {
              background: #F9FAFB;
              padding: 25px;
              border-radius: 0 0 12px 12px;
              text-align: center;
              color: #6B7280;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%);
              color: white;
              padding: 14px 28px;
              border-radius: 8px;
              text-decoration: none;
              font-weight: 600;
              margin: 20px 0;
            }
            .link {
              color: #EC4899;
              text-decoration: none;
              font-weight: 500;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="success-icon">✅</div>
            <h1 style="margin: 0; font-size: 32px;">Message bien reçu !</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 18px;">Merci de nous avoir contactés</p>
          </div>
          
          <div class="content">
            <p style="font-size: 16px; margin-top: 0;">
              Bonjour <strong>${safeName}</strong> 👋
            </p>
            
            <p>
              Merci de nous avoir contactés via NikahScore. Nous avons bien reçu votre message concernant :
            </p>
            
            <div class="highlight-box">
              <p style="margin: 0; font-weight: 600; color: #92400E;">
                📋 ${safeSubject}
              </p>
            </div>
            
            <p>
              Notre équipe de support reviendra vers vous dans les <strong style="color: #EC4899;">24 à 48 heures</strong>. 
              Nous mettons tout en œuvre pour vous apporter une réponse rapide et complète.
            </p>
            
            <div class="message-summary">
              <p style="margin: 0 0 10px 0; font-weight: 600; color: #6B7280; font-size: 14px;">
                RÉSUMÉ DE VOTRE MESSAGE:
              </p>
              <p style="margin: 0; color: #374151; font-style: italic;">
                "${safeMessage.length > 200 ? safeMessage.substring(0, 200) + '...' : safeMessage}"
              </p>
            </div>
            
            <p>
              En attendant notre réponse, n'hésitez pas à :
            </p>
            
            <ul style="color: #4B5563;">
              <li>Consulter notre <a href="https://nikahscore.com/faq" class="link">FAQ</a> pour des réponses immédiates</li>
              <li>Explorer notre <a href="https://nikahscore.com/dashboard" class="link">Dashboard</a> pour découvrir toutes les fonctionnalités</li>
              <li>Rejoindre notre communauté sur les réseaux sociaux</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://nikahscore.com" class="button">
                Retour sur NikahScore
              </a>
            </div>
            
            <p style="color: #6B7280; font-size: 14px; margin-bottom: 0;">
              💡 <strong>Astuce:</strong> Ajoutez support@nikahscore.com à vos contacts pour ne pas manquer notre réponse !
            </p>
          </div>
          
          <div class="footer">
            <p style="margin: 0 0 15px 0;">
              <strong>NikahScore</strong> - Plateforme de Rencontre Halal
            </p>
            <p style="margin: 0; font-size: 14px;">
              <a href="https://nikahscore.com" class="link">Site web</a> • 
              <a href="https://nikahscore.com/faq" class="link">FAQ</a> • 
              <a href="https://nikahscore.com/contact" class="link">Contact</a>
            </p>
            <p style="margin: 15px 0 0 0; font-size: 12px; color: #9CA3AF;">
              © ${new Date().getFullYear()} NikahScore. Tous droits réservés.<br>
              Vous recevez cet email suite à votre demande de contact sur nikahscore.com
            </p>
          </div>
        </body>
        </html>
      `
    })
    
    // On ne bloque pas si l'email de confirmation échoue
    if (userEmailError) {
      logger.warn('⚠️ Erreur Resend (email utilisateur):', userEmailError)
    } else {
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Message envoyé avec succès',
      emailId: adminEmailData?.id
    })
    
  } catch (error) {
    console.error('❌ Erreur serveur contact form:', error)
    return NextResponse.json(
      { error: 'Erreur serveur. Veuillez réessayer plus tard.' },
      { status: 500 }
    )
  }
}
