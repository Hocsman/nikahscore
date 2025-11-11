import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Client admin pour bypasser RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password } = await request.json()

    if (!firstName || !email || !password) {
      return NextResponse.json(
        { error: 'Prénom, email et mot de passe sont requis' },
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

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Créer l'utilisateur avec Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName || null
        }
        // Note: L'email de confirmation Supabase peut être désactivé dans le dashboard
        // Pour éviter la double réception d'emails
      }
    })

    if (error) {
      if (error.message.includes('already registered')) {
        return NextResponse.json(
          { error: 'Cette adresse email est déjà utilisée' },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    // Créer le profil utilisateur avec un client admin (bypass RLS)
    if (data.user) {
      // Attendre un peu pour que Supabase Auth finalise l'utilisateur
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Vérifier d'abord si l'utilisateur existe dans auth.users
      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(data.user.id)
      
      if (authUser.user) {
        // Générer le hash SHA-256 de l'email
        const crypto = require('crypto')
        const emailHash = crypto.createHash('sha256').update(email.toLowerCase()).digest('hex')
        
        // Créer l'entrée dans la table users avec first_name et last_name
        const { error: userError } = await supabaseAdmin
          .from('users')
          .insert([
            {
              id: data.user.id,
              first_name: firstName,
              last_name: lastName || null,
              email: email,
              email_hash: emailHash,
              created_at: new Date().toISOString()
            }
          ])

        if (userError) {
          console.error('❌ Erreur création profil users:', userError)
          return NextResponse.json(
            { error: 'Database error saving new user', details: userError.message },
            { status: 400 }
          )
        }
      }

      // Envoyer l'email de bienvenue via Resend
      try {
        await resend.emails.send({
          from: 'NikahScore <welcome@nikahscore.com>',
          to: [email], // Email directement à l'utilisateur
          subject: `🎉 Bienvenue sur NikahScore, ${firstName} !`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #8B5CF6; text-align: center;">🎉 Bienvenue sur NikahScore !</h1>
              <p>Bonjour <strong>${firstName}</strong>,</p>
              
              <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <p>Votre compte <strong>NikahScore</strong> a été créé avec succès ! 🎉</p>
                <p>Nous sommes ravis de vous accompagner dans votre parcours vers un mariage réussi.</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://nikahscore-platform.vercel.app/questionnaire" 
                   style="background: #8B5CF6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
                  ✨ Commencer mon questionnaire
                </a>
              </div>
              
              <div style="margin: 30px 0; padding: 20px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                <h3 style="color: #d97706; margin-top: 0;">🚀 Prochaines étapes :</h3>
                <ul style="color: #92400e;">
                  <li>Complétez votre questionnaire de compatibilité</li>
                  <li>Découvrez votre profil personnalisé</li>
                  <li>Explorez nos conseils pour un mariage réussi</li>
                </ul>
              </div>
              
              <p style="color: #64748b; font-size: 14px; text-align: center; margin-top: 40px;">
                Vous recevez cet email car vous vous êtes inscrit sur NikahScore<br>
                <a href="mailto:contact@nikahscore.com" style="color: #8B5CF6;">contact@nikahscore.com</a>
              </p>
            </div>
          `
        })
      } catch (emailError) {
        // Ne pas échouer l'inscription si l'email ne marche pas
      }
    }

    return NextResponse.json({
      success: true,
      message: data.user?.email_confirmed_at ? 
        'Compte créé avec succès !' : 
        'Compte créé ! Vérifiez votre email pour activer votre compte.',
      user: {
        id: data.user?.id,
        name: firstName + (lastName ? ' ' + lastName : ''),
        email: data.user?.email,
        emailConfirmed: !!data.user?.email_confirmed_at
      }
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la création du compte' },
      { status: 500 }
    )
  }
}
