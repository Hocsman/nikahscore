import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Stockage temporaire des codes (en production, utiliser Redis ou base de données)
const verificationCodes = new Map<string, { code: string, expires: number, action: string }>()

// Générer un code à 6 chiffres
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const { email, action } = await request.json()

    if (!email || !action) {
      return NextResponse.json(
        { error: 'Email et action requis' },
        { status: 400 }
      )
    }

    // Générer le code
    const code = generateVerificationCode()
    const expires = Date.now() + 10 * 60 * 1000 // Expire dans 10 minutes
    
    // Stocker le code
    verificationCodes.set(email, { code, expires, action })

    const actionText = action === 'download' 
      ? 'télécharger votre rapport PDF NikahScore'
      : 'partager vos résultats NikahScore'

    // Envoyer l'email avec le code
    await resend.emails.send({
      from: 'NikahScore <noreply@nikahscore.com>',
      to: email,
      subject: `Code de vérification NikahScore - ${code}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Code de vérification NikahScore</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f8fafc; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 16px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); overflow: hidden;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🔐 Code de Vérification</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">NikahScore</p>
            </div>

            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 22px;">Bonjour,</h2>
              
              <p style="color: #6b7280; margin: 0 0 25px 0; font-size: 16px; line-height: 1.6;">
                Vous avez demandé à <strong>${actionText}</strong>. 
                Utilisez le code de vérification ci-dessous pour confirmer votre identité :
              </p>

              <!-- Code Box -->
              <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; border: 2px dashed #3b82f6;">
                <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">Votre Code</p>
                <div style="background: white; border-radius: 8px; padding: 20px; display: inline-block; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
                  <span style="font-size: 32px; font-weight: bold; color: #3b82f6; font-family: 'Courier New', monospace; letter-spacing: 8px;">${code}</span>
                </div>
                <p style="color: #ef4444; margin: 15px 0 0 0; font-size: 14px; font-weight: 500;">
                  ⏰ Ce code expire dans 10 minutes
                </p>
              </div>

              <!-- Instructions -->
              <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">📝 Instructions :</h3>
                <ol style="color: #92400e; margin: 0; padding-left: 20px; font-size: 14px;">
                  <li>Copiez le code à 6 chiffres ci-dessus</li>
                  <li>Retournez sur NikahScore.com</li>
                  <li>Collez le code dans le champ prévu</li>
                  <li>Cliquez sur "Valider"</li>
                </ol>
              </div>

              <!-- Security Notice -->
              <div style="background: #fee2e2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <h3 style="color: #dc2626; margin: 0 0 10px 0; font-size: 16px;">🔒 Sécurité</h3>
                <p style="color: #7f1d1d; margin: 0; font-size: 14px; line-height: 1.5;">
                  • Ne partagez jamais ce code avec personne<br>
                  • Si vous n'avez pas demandé cette vérification, ignorez cet email<br>
                  • Ce code n'est valide que pour une seule utilisation
                </p>
              </div>

              <p style="color: #6b7280; margin: 25px 0 0 0; font-size: 14px; line-height: 1.6;">
                Si vous rencontrez des difficultés, n'hésitez pas à nous contacter à 
                <a href="mailto:support@nikahscore.com" style="color: #3b82f6; text-decoration: none;">support@nikahscore.com</a>
              </p>
            </div>

            <!-- Footer -->
            <div style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">
                Cordialement,<br>
                <strong style="color: #1f2937;">L'équipe NikahScore</strong>
              </p>
              <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                © ${new Date().getFullYear()} NikahScore. Tous droits réservés.<br>
                Plateforme de compatibilité matrimoniale islamique
              </p>
            </div>

          </div>

          <!-- Bottom Spacer -->
          <div style="height: 40px;"></div>
        </body>
        </html>
      `
    })

    return NextResponse.json({ 
      success: true,
      message: 'Code de vérification envoyé'
    })

  } catch (error) {
    console.error('Erreur envoi code de vérification:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi du code' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { email, code, action } = await request.json()

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email et code requis' },
        { status: 400 }
      )
    }

    const stored = verificationCodes.get(email)
    
    if (!stored) {
      return NextResponse.json(
        { error: 'Code non trouvé ou expiré' },
        { status: 400 }
      )
    }

    if (stored.expires < Date.now()) {
      verificationCodes.delete(email)
      return NextResponse.json(
        { error: 'Code expiré' },
        { status: 400 }
      )
    }

    if (stored.code !== code || stored.action !== action) {
      return NextResponse.json(
        { error: 'Code incorrect' },
        { status: 400 }
      )
    }

    // Code valide, le supprimer
    verificationCodes.delete(email)

    return NextResponse.json({ 
      success: true,
      message: 'Code validé avec succès'
    })

  } catch (error) {
    console.error('Erreur validation code:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la validation' },
      { status: 500 }
    )
  }
}
