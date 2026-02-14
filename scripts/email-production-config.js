// Configuration email pour production avec domaine vérifié
// À utiliser une fois nikahscore.com configuré dans Resend

// Dans src/app/api/auth/register/route.ts
const emailResult = await resend.emails.send({
  from: 'NikahScore <welcome@nikahscore.com>', // Votre domaine vérifié
  to: [email], // Email de l'utilisateur réel
  cc: ['admin@nikahscore.com'], // Copie pour vous
  subject: '🎉 Bienvenue sur NikahScore !',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #8B5CF6; text-align: center;">🎉 Bienvenue ${name} !</h1>
      <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <p>Votre compte <strong>NikahScore</strong> a été créé avec succès !</p>
        <p>Vous pouvez maintenant commencer à utiliser notre plateforme pour :</p>
        <ul>
          <li>🧠 Tester votre compatibilité amoureuse</li>
          <li>📊 Obtenir des analyses détaillées</li>
          <li>💝 Découvrir des conseils personnalisés</li>
        </ul>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://nikahscore.com/questionnaire" 
           style="background: #8B5CF6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
          ✨ Commencer le test
        </a>
      </div>
      <p style="color: #64748b; font-size: 14px; text-align: center;">
        Merci de nous faire confiance !<br>
        L'équipe NikahScore
      </p>
    </div>
  `
})
