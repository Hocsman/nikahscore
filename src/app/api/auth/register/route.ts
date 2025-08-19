import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Stockage temporaire (en production, utiliser une vraie base de données)
const users = new Map<string, { 
  id: string, 
  name: string, 
  email: string, 
  password: string, 
  createdAt: Date 
}>()

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      )
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: 'Adresse email invalide' },
        { status: 400 }
      )
    }

    // Vérifier si l'utilisateur existe déjà
    if (users.has(email)) {
      return NextResponse.json(
        { error: 'Cette adresse email est déjà utilisée' },
        { status: 409 }
      )
    }

    // Créer l'utilisateur (en production, hasher le mot de passe)
    const user = {
      id: Date.now().toString(),
      name,
      email,
      password, // En production: await bcrypt.hash(password, 10)
      createdAt: new Date()
    }

    users.set(email, user)

    // Envoyer un email de bienvenue
    try {
      await resend.emails.send({
        from: 'NikahScore <noreply@nikahscore.com>',
        to: email,
        subject: '🎉 Bienvenue sur NikahScore !',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Bienvenue sur NikahScore</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f8fafc; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 16px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); overflow: hidden;">
              
              <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">🎯 Bienvenue sur NikahScore !</h1>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0;">Votre parcours de compatibilité commence maintenant</p>
              </div>

              <div style="padding: 40px 30px;">
                <h2 style="color: #1f2937; margin: 0 0 20px 0;">Bonjour ${name} ! 👋</h2>
                
                <p style="color: #6b7280; margin: 0 0 25px 0;">
                  Félicitations ! Votre compte NikahScore a été créé avec succès. 
                  Vous faites maintenant partie d'une communauté qui valorise la compatibilité dans le mariage islamique.
                </p>

                <div style="background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
                  <h3 style="color: #1e40af; margin: 0 0 15px 0;">🚀 Prochaines étapes :</h3>
                  <ul style="color: #1e40af; margin: 0; padding-left: 20px;">
                    <li>Complétez votre questionnaire de compatibilité</li>
                    <li>Découvrez votre score personnalisé</li>
                    <li>Recevez des recommandations adaptées</li>
                    <li>Téléchargez votre rapport détaillé</li>
                  </ul>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/questionnaire" 
                     style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 15px 30px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 16px;">
                    🎯 Commencer le Questionnaire
                  </a>
                </div>

                <p style="color: #6b7280; margin: 25px 0 0 0; font-size: 14px;">
                  Si vous avez des questions, n'hésitez pas à nous contacter à 
                  <a href="mailto:support@nikahscore.com" style="color: #3b82f6;">support@nikahscore.com</a>
                </p>
              </div>

              <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
                <p style="margin: 0;">© ${new Date().getFullYear()} NikahScore. Tous droits réservés.</p>
              </div>

            </div>
          </body>
          </html>
        `
      })
    } catch (emailError) {
      console.error('Erreur envoi email de bienvenue:', emailError)
      // Continue même si l'email échoue
    }

    return NextResponse.json({
      success: true,
      message: 'Compte créé avec succès',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })

  } catch (error) {
    console.error('Erreur inscription:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du compte' },
      { status: 500 }
    )
  }
}
