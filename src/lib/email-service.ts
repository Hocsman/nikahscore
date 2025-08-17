// Service d'envoi d'emails pour les invitations
// Utilise Resend ou peut être adapté pour SendGrid, Nodemailer, etc.

interface InviteEmailData {
  initiatorName: string;
  initiatorEmail: string;
  partnerName: string;
  partnerEmail: string;
  inviteLink: string;
  pairId: string;
  message?: string;
}

interface EmailService {
  sendInviteEmail(data: InviteEmailData): Promise<{ success: boolean; messageId?: string; error?: string }>;
}

// Template HTML pour l'email d'invitation
const getInviteEmailTemplate = (data: InviteEmailData) => `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invitation NikahScore</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f8fffe; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #10b981; margin-bottom: 30px; }
        .header h1 { color: #047857; margin: 0; font-size: 28px; }
        .header p { color: #6b7280; margin: 5px 0 0 0; }
        .content { padding: 0 20px; }
        .message-box { background: #f0fdfa; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0; }
        .message-box p { margin: 0; color: #047857; font-style: italic; }
        .cta-button { display: inline-block; padding: 15px 30px; background-color: #10b981; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; text-align: center; }
        .cta-button:hover { background-color: #059669; }
        .link-box { background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px dashed #d1d5db; }
        .link-box p { margin: 0; font-size: 12px; color: #6b7280; }
        .link-box a { word-break: break-all; color: #047857; }
        .footer { text-align: center; padding: 20px 0; border-top: 1px solid #e5e7eb; margin-top: 30px; color: #6b7280; font-size: 14px; }
        .islamic-quote { text-align: center; font-style: italic; color: #047857; margin: 20px 0; padding: 15px; background: #f0f9ff; border-radius: 8px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤝 NikahScore</h1>
            <p>Test de compatibilité matrimoniale</p>
        </div>
        
        <div class="content">
            <h2>Assalaam aleykum ${data.partnerName} ! 👋</h2>
            
            <p><strong>${data.initiatorName}</strong> vous invite à faire un test de compatibilité matrimoniale ensemble.</p>
            
            ${data.message ? `
            <div class="message-box">
                <p>"${data.message}"</p>
            </div>
            ` : ''}
            
            <div class="islamic-quote">
                <p><em>"Et parmi Ses signes Il a créé de vous, pour vous, des épouses pour que vous viviez en tranquillité avec elles et Il a mis entre vous de l'affection et de la bonté."</em></p>
                <p><strong>- Sourate Ar-Rum, verset 21</strong></p>
            </div>
            
            <h3>🎯 À propos du test :</h3>
            <ul>
                <li><strong>Durée :</strong> 10-15 minutes</li>
                <li><strong>Questions :</strong> 60 questions sur 9 axes essentiels</li>
                <li><strong>Résultats :</strong> Analyse détaillée de votre compatibilité</li>
                <li><strong>Confidentialité :</strong> Données 100% sécurisées</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${data.inviteLink}" class="cta-button">
                    ✨ Commencer mon questionnaire
                </a>
            </div>
            
            <div class="link-box">
                <p><strong>Lien direct :</strong></p>
                <a href="${data.inviteLink}">${data.inviteLink}</a>
                <p style="margin-top: 10px;"><em>Ce lien est sécurisé et personnel. Vous avez 7 jours pour compléter le test.</em></p>
            </div>
            
            <h3>❓ Comment ça marche ?</h3>
            <ol>
                <li>Cliquez sur le lien ci-dessus</li>
                <li>Répondez aux 60 questions en toute sincérité</li>
                <li>Une fois que vous avez tous les deux terminé, recevez vos résultats</li>
                <li>Découvrez vos points forts et les axes d'amélioration</li>
            </ol>
            
            <p><strong>Barakallahu feeki</strong> pour prendre le temps de participer à cette démarche ! 🌸</p>
        </div>
        
        <div class="footer">
            <p>Cet email a été envoyé par <strong>NikahScore</strong></p>
            <p>Si vous avez des questions, contactez-nous : <a href="mailto:support@nikahscore.com">support@nikahscore.com</a></p>
            <p style="font-size: 12px; margin-top: 10px;">
                ID de l'invitation : ${data.pairId.substring(0, 8)}...
            </p>
        </div>
    </div>
</body>
</html>
`;

// Implémentation avec Resend (recommandé)
class ResendEmailService implements EmailService {
  private apiKey: string;
  private fromEmail: string;

  constructor(apiKey: string, fromEmail: string = 'noreply@nikahscore.com') {
    this.apiKey = apiKey;
    this.fromEmail = fromEmail;
  }

  async sendInviteEmail(data: InviteEmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `NikahScore <${this.fromEmail}>`,
          to: [data.partnerEmail],
          subject: `${data.initiatorName} vous invite à un test de compatibilité matrimoniale 💕`,
          html: getInviteEmailTemplate(data),
          reply_to: data.initiatorEmail, // Permettre la réponse directe
          tags: [
            { name: 'type', value: 'invite' },
            { name: 'pair_id', value: data.pairId }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur Resend:', errorData);
        return { success: false, error: errorData.message || 'Erreur envoi email' };
      }

      const result = await response.json();
      console.log('✅ Email envoyé avec succès:', result.id);

      return { success: true, messageId: result.id };

    } catch (error) {
      console.error('❌ Erreur ResendEmailService:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      };
    }
  }
}

// Implémentation alternative avec Nodemailer (si pas Resend)
class NodemailerEmailService implements EmailService {
  async sendInviteEmail(data: InviteEmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // TODO: Implémenter avec nodemailer si nécessaire
      // const nodemailer = require('nodemailer');
      // const transporter = nodemailer.createTransporter({...});
      
      console.log('📧 Email simulation (Nodemailer non configuré)');
      console.log('Destinataire:', data.partnerEmail);
      console.log('Expéditeur:', data.initiatorName);
      console.log('Lien:', data.inviteLink);
      
      return { success: true, messageId: `sim_${Date.now()}` };

    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur Nodemailer' 
      };
    }
  }
}

// Factory pour choisir le service d'email
export function createEmailService(): EmailService {
  const resendApiKey = process.env.RESEND_API_KEY;
  
  if (resendApiKey) {
    console.log('📧 Utilisation de Resend pour les emails');
    return new ResendEmailService(resendApiKey);
  } else {
    console.log('📧 Utilisation du service email de simulation');
    return new NodemailerEmailService();
  }
}

// Fonction utilitaire principale
export async function sendInviteEmail(data: InviteEmailData) {
  const emailService = createEmailService();
  const result = await emailService.sendInviteEmail(data);
  
  if (result.success) {
    console.log(`✅ Invitation envoyée à ${data.partnerEmail} (ID: ${result.messageId})`);
  } else {
    console.error(`❌ Échec envoi email: ${result.error}`);
  }
  
  return result;
}

export type { InviteEmailData, EmailService };
