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
          name: name
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/questionnaire`
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
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            name: name,
            email: email,
            created_at: new Date().toISOString()
          }
        ])

      if (profileError) {
        console.error('Erreur création profil:', profileError)
      } else {
        console.log('✅ Profil créé pour:', name)
      }

      // Envoyer l'email de bienvenue via Resend
      try {
        console.log('🚀 Tentative envoi email de bienvenue à:', email)
        
        const emailResult = await resend.emails.send({
          from: 'NikahScore <welcome@nikahscore.com>',
          to: [email], // Email directement à l'utilisateur
          subject: `🎉 Bienvenue sur NikahScore, ${name} !`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #8B5CF6; text-align: center;">🎉 Bienvenue sur NikahScore !</h1>
              <p>Bonjour <strong>${name}</strong>,</p>
              
              <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <p>Votre compte <strong>NikahScore</strong> a été créé avec succès ! 🎉</p>
                <p>Nous sommes ravis de vous accompagner dans votre parcours vers un mariage réussi.</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/questionnaire" 
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
        
        console.log('✅ Email envoyé avec succès:', emailResult)
      } catch (emailError) {
        console.error('❌ Erreur envoi email:', emailError)
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
        name: name,
        email: data.user?.email,
        emailConfirmed: !!data.user?.email_confirmed_at
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
