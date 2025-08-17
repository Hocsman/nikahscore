// Templates d'emails pour NikahScore
// Gère les différents types d'emails transactionnels

interface EmailTemplate {
  subject: string
  html: string
}

interface EmailData {
  email: string
  pairId: string
  inviteUrl?: string
  resultsUrl?: string
}

/**
 * Récupère le template d'email selon le type
 */
export function getEmailTemplate(type: string, data: EmailData): EmailTemplate | null {
  switch (type) {
    case 'invite':
      return getInviteTemplate(data)
    case 'results_ready':
      return getResultsReadyTemplate(data)
    case 'reminder':
      return getReminderTemplate(data)
    default:
      return null
  }
}

/**
 * Template d'invitation à répondre au questionnaire
 */
function getInviteTemplate(data: EmailData): EmailTemplate {
  const { inviteUrl } = data
  
  return {
    subject: 'Invitation à un test de compatibilité matrimoniale - NikahScore',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invitation NikahScore</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
    .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { font-size: 28px; font-weight: bold; color: #0ea5e9; margin-bottom: 10px; }
    .tagline { color: #64748b; font-size: 14px; }
    .button { display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 20px 0; }
    .button:hover { background: linear-gradient(135deg, #0284c7 0%, #075985 100%); }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 12px; }
    .highlight { background-color: #dbeafe; padding: 20px; border-radius: 6px; border-left: 4px solid #0ea5e9; margin: 20px 0; }
    .islamic-quote { background-color: #f0f9ff; padding: 15px; border-radius: 6px; font-style: italic; color: #075985; text-align: center; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">NikahScore</div>
      <div class="tagline">Compatibilité matrimoniale islamique</div>
    </div>
    
    <h2 style="color: #1e293b;">Assalamu alaykum,</h2>
    
    <p>Vous avez été invité(e) à participer à une évaluation de compatibilité matrimoniale sur NikahScore.</p>
    
    <p>Cette plateforme respectueuse des valeurs islamiques vous permettra de découvrir votre harmonie potentielle avec votre partenaire à travers un questionnaire approfondi.</p>
    
    <div class="highlight">
      <strong>Pourquoi répondre ?</strong>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li>Questionnaire basé sur les valeurs islamiques du mariage</li>
        <li>Analyse objective de votre compatibilité</li>
        <li>Recommandations personnalisées pour votre relation</li>
        <li>Confidentialité et respect de votre intimité garantis</li>
      </ul>
    </div>
    
    <div style="text-align: center;">
      <a href="${inviteUrl}" class="button">Commencer le questionnaire</a>
    </div>
    
    <div class="islamic-quote">
      "Et parmi Ses signes Il a créé de vous, pour vous, des épouses pour que vous viviez en tranquillité avec elles et Il a mis entre vous de l'affection et de la bonté."<br>
      <small>- Coran, Sourate Ar-Rum (30:21)</small>
    </div>
    
    <p><strong>Durée estimée :</strong> 15-20 minutes</p>
    <p><strong>Validité du lien :</strong> 30 jours</p>
    
    <p>Si vous avez des questions, n'hésitez pas à nous contacter à support@nikahscore.com</p>
    
    <p>Qu'Allah vous guide dans votre choix matrimonial.</p>
    
    <div class="footer">
      <p>© 2025 NikahScore - Tous droits réservés</p>
      <p>Si vous ne souhaitez plus recevoir ces emails, vous pouvez vous désabonner.</p>
    </div>
  </div>
</body>
</html>
    `
  }
}

/**
 * Template de notification de résultats prêts
 */
function getResultsReadyTemplate(data: EmailData): EmailTemplate {
  const { resultsUrl } = data
  
  return {
    subject: 'Vos résultats de compatibilité sont prêts ! - NikahScore',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Résultats NikahScore</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
    .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { font-size: 28px; font-weight: bold; color: #0ea5e9; margin-bottom: 10px; }
    .tagline { color: #64748b; font-size: 14px; }
    .button { display: inline-block; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 20px 0; }
    .button:hover { background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 12px; }
    .success-icon { font-size: 48px; text-align: center; margin: 20px 0; }
    .feature-list { background-color: #f0fdf4; padding: 20px; border-radius: 6px; border-left: 4px solid #22c55e; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">NikahScore</div>
      <div class="tagline">Compatibilité matrimoniale islamique</div>
    </div>
    
    <div class="success-icon">🎉</div>
    
    <h2 style="color: #1e293b; text-align: center;">Vos résultats sont prêts !</h2>
    
    <p>Alhamdulillah ! Vous avez tous les deux terminé le questionnaire de compatibilité.</p>
    
    <p>Votre rapport personnalisé vous attend avec :</p>
    
    <div class="feature-list">
      <ul style="margin: 0; padding-left: 20px;">
        <li><strong>Score de compatibilité global</strong> - Évaluation chiffrée de votre harmonie</li>
        <li><strong>Analyse par dimensions</strong> - Graphique radar détaillé</li>
        <li><strong>Points forts identifiés</strong> - Vos domaines d'harmonie</li>
        <li><strong>Points d'attention</strong> - Aspects à approfondir ensemble</li>
        <li><strong>Recommandations personnalisées</strong> - Conseils pour votre relation</li>
        <li><strong>Export PDF</strong> - Rapport complet téléchargeable</li>
      </ul>
    </div>
    
    <div style="text-align: center;">
      <a href="${resultsUrl}" class="button">Découvrir mes résultats</a>
    </div>
    
    <p style="background-color: #fef3c7; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b;">
      <strong>💡 Conseil :</strong> Prenez le temps de consulter ce rapport ensemble et d'en discuter ouvertement. Il s'agit d'un outil pour enrichir votre dialogue, pas d'un verdict définitif.
    </p>
    
    <p>Ces résultats restent confidentiels et sont disponibles pendant 60 jours.</p>
    
    <p>Qu'Allah bénisse votre union si telle est Sa volonté.</p>
    
    <div class="footer">
      <p>© 2025 NikahScore - Tous droits réservés</p>
      <p>Besoin d'aide ? Contactez-nous à support@nikahscore.com</p>
    </div>
  </div>
</body>
</html>
    `
  }
}

/**
 * Template de rappel pour compléter le questionnaire
 */
function getReminderTemplate(data: EmailData): EmailTemplate {
  const { inviteUrl } = data
  
  return {
    subject: 'Rappel : Votre questionnaire de compatibilité vous attend - NikahScore',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rappel NikahScore</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
    .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { font-size: 28px; font-weight: bold; color: #0ea5e9; margin-bottom: 10px; }
    .tagline { color: #64748b; font-size: 14px; }
    .button { display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 20px 0; }
    .button:hover { background: linear-gradient(135deg, #d97706 0%, #b45309 100%); }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 12px; }
    .urgent { background-color: #fef3c7; padding: 20px; border-radius: 6px; border-left: 4px solid #f59e0b; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">NikahScore</div>
      <div class="tagline">Compatibilité matrimoniale islamique</div>
    </div>
    
    <h2 style="color: #1e293b;">Assalamu alaykum,</h2>
    
    <p>Nous espérons que vous allez bien. Votre partenaire a déjà complété son questionnaire de compatibilité et attend vos réponses pour découvrir votre harmonie commune.</p>
    
    <div class="urgent">
      <strong>⏰ Action requise</strong><br>
      Il ne vous faut que 15 minutes pour compléter ce questionnaire qui pourrait éclairer votre avenir matrimonial.
    </div>
    
    <p>Rappel de ce qui vous attend :</p>
    <ul>
      <li>40 questions réfléchies sur les valeurs islamiques</li>
      <li>Analyse de compatibilité sur 6 dimensions clés</li>
      <li>Rapport détaillé avec recommandations</li>
      <li>Totale confidentialité garantie</li>
    </ul>
    
    <div style="text-align: center;">
      <a href="${inviteUrl}" class="button">Compléter mon questionnaire</a>
    </div>
    
    <p style="color: #dc2626; font-weight: 600;">⚠️ Ce lien expire dans quelques jours. Ne laissez pas passer cette opportunité d'approfondir votre connaissance mutuelle.</p>
    
    <p>Le mariage est une décision importante qui mérite d'être prise en toute connaissance de cause.</p>
    
    <p>Barakallahu fikoum.</p>
    
    <div class="footer">
      <p>© 2025 NikahScore - Tous droits réservés</p>
      <p>Pour vous désabonner de ces rappels, cliquez ici</p>
    </div>
  </div>
</body>
</html>
    `
  }
}

/**
 * Template pour les notifications d'administrateur
 */
export function getAdminNotificationTemplate(type: string, data: any): EmailTemplate {
  switch (type) {
    case 'new_pair_created':
      return {
        subject: `[NikahScore Admin] Nouvelle paire créée - ${data.pairId}`,
        html: `
          <h2>Nouvelle paire créée</h2>
          <p><strong>ID:</strong> ${data.pairId}</p>
          <p><strong>Email A:</strong> ${data.userAEmail}</p>
          <p><strong>Email B:</strong> ${data.userBEmail || 'Non renseigné'}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}</p>
        `
      }
    case 'match_completed':
      return {
        subject: `[NikahScore Admin] Match terminé - Score: ${data.score}%`,
        html: `
          <h2>Match terminé</h2>
          <p><strong>Paire:</strong> ${data.pairId}</p>
          <p><strong>Score:</strong> ${data.score}%</p>
          <p><strong>Conflits:</strong> ${data.conflicts}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}</p>
        `
      }
    default:
      return {
        subject: '[NikahScore Admin] Notification',
        html: '<p>Notification système</p>'
      }
  }
}
