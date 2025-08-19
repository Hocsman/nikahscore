import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

// Initialisation conditionnelle de Resend
let resend: Resend | null = null
console.log('🔑 RESEND_API_KEY présente:', !!process.env.RESEND_API_KEY)
console.log('🔑 RESEND_API_KEY valeur:', process.env.RESEND_API_KEY?.substring(0, 8) + '...')

if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your_resend_api_key_here') {
  resend = new Resend(process.env.RESEND_API_KEY)
  console.log('✅ Resend initialisé avec succès')
} else {
  console.log('❌ Resend NON initialisé - API key manquante ou invalide')
}

interface EmailRequest {
  email: string
  name?: string
  globalScore: number
  axisScores: Array<{
    axis: string
    percentage: number
    questionCount: number
    dealbreakers: number
    dealbreakersPassed: number
  }>
  dealbreakersTotal: number
  dealbreakersPassed: number
  recommendations: string[]
  strengths: string[]
  concerns: string[]
}

export async function POST(request: NextRequest) {
  try {
    const data: EmailRequest = await request.json()
    
    if (!data.email || !data.globalScore) {
      return NextResponse.json(
        { error: 'Email et résultats requis' },
        { status: 400 }
      )
    }

    // Vérifier si Resend est configuré
    if (!resend) {
      console.log('🚧 Mode démo - Resend non configuré')
      console.log('🚧 Mode démo - Email simulé:', {
        to: data.email,
        name: data.name,
        score: data.globalScore
      })
      
      // Mode démo - simulation d'envoi réussi
      return NextResponse.json({
        success: true,
        message: 'Email envoyé avec succès (mode démo)',
        emailId: 'demo-' + Date.now(),
        demo: true
      })
    }

    console.log('📧 Tentative d\'envoi d\'email réel avec Resend...')
    
    // Template HTML de l'email
    const htmlContent = generateEmailTemplate(data)
    
    console.log('📧 Envoi vers:', data.email)
    console.log('📧 Expéditeur: onboarding@resend.dev (domaine vérifié)')
    
    const emailResult = await resend.emails.send({
      from: 'NikahScore <onboarding@resend.dev>',
      to: [data.email],
      subject: `Vos résultats NikahScore - Score: ${data.globalScore}%`,
      html: htmlContent
    })

    console.log('✅ Email envoyé avec succès:', emailResult)
    console.log('✅ Structure de la réponse:', JSON.stringify(emailResult, null, 2))
    
    return NextResponse.json({
      success: true,
      message: 'Email envoyé avec succès',
      emailId: emailResult.data?.id
    })

  } catch (error) {
    console.error('❌ Erreur envoi email:', error)
    console.error('❌ Type d\'erreur:', typeof error)
    console.error('❌ Message d\'erreur:', error instanceof Error ? error.message : 'Erreur inconnue')
    
    return NextResponse.json(
      { 
        error: 'Erreur lors de l\'envoi de l\'email',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}

function generateEmailTemplate(data: EmailRequest): string {
  const { globalScore, axisScores, dealbreakersTotal, dealbreakersPassed, recommendations, strengths, concerns, name } = data
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#16a34a' // green
    if (score >= 65) return '#2563eb' // blue
    if (score >= 50) return '#ca8a04' // yellow
    return '#dc2626' // red
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 65) return 'Très Bien'
    if (score >= 50) return 'Bien'
    return 'À Améliorer'
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vos Résultats NikahScore</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
      background-color: #f8fafc;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      color: white;
      padding: 40px 20px;
      text-align: center;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .subtitle {
      font-size: 16px;
      opacity: 0.9;
    }
    .content {
      padding: 40px 30px;
    }
    .score-section {
      text-align: center;
      margin-bottom: 40px;
      padding: 30px;
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border-radius: 12px;
      border: 2px solid #bae6fd;
    }
    .global-score {
      font-size: 72px;
      font-weight: bold;
      margin-bottom: 10px;
      color: ${getScoreColor(globalScore)};
    }
    .score-label {
      font-size: 24px;
      color: #374151;
      margin-bottom: 10px;
    }
    .score-badge {
      display: inline-block;
      padding: 8px 16px;
      background-color: ${getScoreColor(globalScore)};
      color: white;
      border-radius: 20px;
      font-weight: bold;
      font-size: 14px;
    }
    .dealbreakers {
      display: flex;
      justify-content: center;
      gap: 30px;
      margin-top: 20px;
    }
    .dealbreaker-item {
      text-align: center;
    }
    .dealbreaker-number {
      font-size: 32px;
      font-weight: bold;
      color: #16a34a;
    }
    .dealbreaker-label {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 20px;
      font-weight: bold;
      color: #1f2937;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e5e7eb;
    }
    .axis-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      margin-bottom: 8px;
      background-color: #f9fafb;
      border-radius: 8px;
      border-left: 4px solid ${getScoreColor(globalScore)};
    }
    .axis-name {
      font-weight: 600;
      color: #374151;
    }
    .axis-score {
      font-weight: bold;
      font-size: 18px;
    }
    .recommendations {
      background-color: #fef3c7;
      border: 1px solid #f59e0b;
      border-radius: 8px;
      padding: 20px;
    }
    .strengths {
      background-color: #d1fae5;
      border: 1px solid #10b981;
      border-radius: 8px;
      padding: 20px;
    }
    .concerns {
      background-color: #fee2e2;
      border: 1px solid #ef4444;
      border-radius: 8px;
      padding: 20px;
    }
    .list-item {
      margin-bottom: 8px;
      padding-left: 20px;
      position: relative;
    }
    .list-item:before {
      content: "•";
      color: #3b82f6;
      font-weight: bold;
      position: absolute;
      left: 0;
    }
    .footer {
      background-color: #1f2937;
      color: white;
      padding: 30px;
      text-align: center;
    }
    .cta-button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #3b82f6;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      margin: 20px 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="logo">🤝 NikahScore</div>
      <div class="subtitle">Votre analyse de compatibilité matrimoniale</div>
    </div>

    <!-- Content -->
    <div class="content">
      ${name ? `<p>Assalamu alaikum ${name},</p>` : '<p>Assalamu alaikum,</p>'}
      
      <p>Voici vos résultats d'analyse de compatibilité matrimoniale NikahScore :</p>

      <!-- Score Global -->
      <div class="score-section">
        <div class="global-score">${globalScore}%</div>
        <div class="score-label">Score Global de Compatibilité</div>
        <div class="score-badge">${getScoreBadge(globalScore)}</div>
        
        <div class="dealbreakers">
          <div class="dealbreaker-item">
            <div class="dealbreaker-number">${dealbreakersPassed}</div>
            <div class="dealbreaker-label">Critères validés</div>
          </div>
          <div class="dealbreaker-item">
            <div class="dealbreaker-number">${dealbreakersTotal}</div>
            <div class="dealbreaker-label">Critères au total</div>
          </div>
        </div>
      </div>

      <!-- Analyse par Axes -->
      <div class="section">
        <div class="section-title">📊 Analyse par Domaine</div>
        ${axisScores.map(axis => `
          <div class="axis-item">
            <div class="axis-name">${axis.axis}</div>
            <div class="axis-score" style="color: ${getScoreColor(axis.percentage)}">${axis.percentage}%</div>
          </div>
        `).join('')}
      </div>

      <!-- Points Forts -->
      ${strengths.length > 0 ? `
      <div class="section">
        <div class="section-title">✅ Vos Points Forts</div>
        <div class="strengths">
          ${strengths.map(strength => `<div class="list-item">${strength}</div>`).join('')}
        </div>
      </div>
      ` : ''}

      <!-- Points d'Attention -->
      ${concerns.length > 0 ? `
      <div class="section">
        <div class="section-title">⚠️ Points d'Attention</div>
        <div class="concerns">
          ${concerns.map(concern => `<div class="list-item">${concern}</div>`).join('')}
        </div>
      </div>
      ` : ''}

      <!-- Recommandations -->
      <div class="section">
        <div class="section-title">💡 Recommandations Personnalisées</div>
        <div class="recommendations">
          ${recommendations.map(rec => `<div class="list-item">${rec}</div>`).join('')}
        </div>
      </div>

      <p style="margin-top: 30px;">
        Ces résultats sont conçus pour vous aider dans votre réflexion personnelle sur le mariage. 
        N'hésitez pas à consulter des conseillers matrimoniaux qualifiés pour un accompagnement personnalisé.
      </p>

      <div style="text-align: center; margin-top: 30px;">
        <a href="https://nikahscore-platform.vercel.app/questionnaire" class="cta-button">
          Refaire le test
        </a>
        <a href="https://nikahscore-platform.vercel.app" class="cta-button">
          Visiter le site
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>NikahScore</strong> - Plateforme d'analyse de compatibilité matrimoniale</p>
      <p style="font-size: 14px; opacity: 0.8;">
        Barakallahu lak - Qu'Allah vous facilite votre chemin vers le mariage
      </p>
    </div>
  </div>
</body>
</html>
  `
}
