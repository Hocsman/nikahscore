import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface CompatibilityResult {
  globalScore: number
  axisScores: Array<{
    axis: string
    percentage: number
    score: number
    maxScore: number
    questionCount: number
    dealbreakers: number
    dealbreakersPassed: number
  }>
  dealbreakersTotal: number
  dealbreakersPassed: number
  recommendations: string[]
  strengths: string[]
  concerns: string[]
  responsesCount: number
}

export async function POST(request: NextRequest) {
  try {
    const { email, code, results } = await request.json()

    if (!email || !code || !results) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      )
    }

    // Vérifier le code
    const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-verification-code`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, action: 'download' })
    })

    if (!verifyResponse.ok) {
      return NextResponse.json(
        { error: 'Code de vérification invalide' },
        { status: 400 }
      )
    }

    const resultData: CompatibilityResult = results

    // Générer le contenu HTML pour le PDF
    const htmlContent = generatePDFContent(resultData, email)

    // Pour l'instant, on envoie le rapport par email
    // En production, on pourrait utiliser une librairie comme Puppeteer pour générer un vrai PDF
    await resend.emails.send({
      from: 'NikahScore <noreply@nikahscore.com>',
      to: email,
      subject: `Votre Rapport NikahScore - Score ${resultData.globalScore}%`,
      html: htmlContent
    })

    return NextResponse.json({ 
      success: true,
      message: 'Rapport PDF envoyé par email'
    })

  } catch (error) {
    console.error('Erreur génération PDF:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération du rapport' },
      { status: 500 }
    )
  }
}

function generatePDFContent(results: CompatibilityResult, email: string): string {
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'
    if (score >= 65) return '#3b82f6'
    if (score >= 50) return '#f59e0b'
    return '#ef4444'
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return '🌟 Excellent'
    if (score >= 65) return '✅ Très Bien'
    if (score >= 50) return '⚡ Correct'
    return '🔄 À Améliorer'
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Rapport NikahScore - ${results.globalScore}%</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #1f2937;
          background-color: #f8fafc;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
          padding: 40px;
          text-align: center;
        }
        .header h1 {
          margin: 0 0 10px 0;
          font-size: 32px;
          font-weight: bold;
        }
        .score-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          border: 4px solid rgba(255, 255, 255, 0.5);
          margin: 20px auto;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          font-weight: bold;
        }
        .content {
          padding: 40px;
        }
        .section {
          margin: 30px 0;
          padding: 25px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          background: #f9fafb;
        }
        .section h2 {
          margin: 0 0 20px 0;
          font-size: 20px;
          color: #1f2937;
        }
        .axis-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 0;
          border-bottom: 1px solid #e5e7eb;
        }
        .axis-item:last-child {
          border-bottom: none;
        }
        .axis-name {
          font-weight: 500;
          color: #374151;
        }
        .axis-score {
          font-weight: bold;
          font-size: 18px;
          padding: 5px 15px;
          border-radius: 20px;
          color: white;
        }
        .recommendations {
          background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
          border: 1px solid #3b82f6;
        }
        .recommendations h2 {
          color: #1e40af;
        }
        .rec-item {
          background: white;
          padding: 15px;
          margin: 10px 0;
          border-radius: 8px;
          border-left: 4px solid #3b82f6;
        }
        .strengths {
          background: linear-gradient(135deg, #dcfce7 0%, #d1fae5 100%);
          border: 1px solid #10b981;
        }
        .strengths h2 {
          color: #047857;
        }
        .strength-item {
          background: white;
          padding: 12px;
          margin: 8px 0;
          border-radius: 8px;
          border-left: 4px solid #10b981;
        }
        .concerns {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border: 1px solid #f59e0b;
        }
        .concerns h2 {
          color: #92400e;
        }
        .concern-item {
          background: white;
          padding: 12px;
          margin: 8px 0;
          border-radius: 8px;
          border-left: 4px solid #f59e0b;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin: 20px 0;
        }
        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          text-align: center;
        }
        .stat-value {
          font-size: 28px;
          font-weight: bold;
          color: #3b82f6;
          margin: 10px 0;
        }
        .footer {
          background: #f9fafb;
          padding: 30px 40px;
          text-align: center;
          color: #6b7280;
          border-top: 1px solid #e5e7eb;
        }
      </style>
    </head>
    <body>
      <div class="container">
        
        <!-- Header -->
        <div class="header">
          <h1>🎯 Rapport NikahScore</h1>
          <div class="score-circle">
            ${results.globalScore}%
          </div>
          <p style="font-size: 18px; margin: 10px 0;">${getScoreBadge(results.globalScore)}</p>
          <p style="font-size: 14px; opacity: 0.9;">Généré le ${currentDate}</p>
        </div>

        <!-- Content -->
        <div class="content">
          
          <!-- Statistics -->
          <div class="section">
            <h2>📊 Statistiques Générales</h2>
            <div class="stats-grid">
              <div class="stat-card">
                <div>Réponses Complétées</div>
                <div class="stat-value">${results.responsesCount}</div>
              </div>
              <div class="stat-card">
                <div>Domaines Évalués</div>
                <div class="stat-value">${results.axisScores.length}</div>
              </div>
              <div class="stat-card">
                <div>Critères Essentiels</div>
                <div class="stat-value">${results.dealbreakersPassed}/${results.dealbreakersTotal}</div>
              </div>
            </div>
          </div>

          <!-- Scores by Domain -->
          <div class="section">
            <h2>📈 Scores par Domaine</h2>
            ${results.axisScores.map(axis => `
              <div class="axis-item">
                <div class="axis-name">${axis.axis}</div>
                <div class="axis-score" style="background-color: ${getScoreColor(axis.percentage)}">
                  ${axis.percentage}%
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Strengths -->
          ${results.strengths.length > 0 ? `
          <div class="section strengths">
            <h2>🏆 Vos Points Forts</h2>
            ${results.strengths.map(strength => `
              <div class="strength-item">${strength}</div>
            `).join('')}
          </div>
          ` : ''}

          <!-- Concerns -->
          ${results.concerns.length > 0 ? `
          <div class="section concerns">
            <h2>⚠️ Points d'Attention</h2>
            ${results.concerns.map(concern => `
              <div class="concern-item">${concern}</div>
            `).join('')}
          </div>
          ` : ''}

          <!-- Recommendations -->
          <div class="section recommendations">
            <h2>💡 Recommandations Personnalisées</h2>
            ${results.recommendations.map((rec, index) => `
              <div class="rec-item">
                <strong>${index + 1}.</strong> ${rec}
              </div>
            `).join('')}
          </div>

          <!-- Next Steps -->
          <div class="section">
            <h2>🚀 Prochaines Étapes</h2>
            <div class="rec-item">
              <strong>1.</strong> Réfléchissez aux domaines qui nécessitent votre attention
            </div>
            <div class="rec-item">
              <strong>2.</strong> Discutez de vos attentes avec vos proches
            </div>
            <div class="rec-item">
              <strong>3.</strong> Consultez nos guides sur nikahscore.com
            </div>
            <div class="rec-item">
              <strong>4.</strong> Reprenez le test dans quelques mois pour voir votre évolution
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div class="footer">
          <p><strong>NikahScore.com</strong> - Plateforme de compatibilité matrimoniale islamique</p>
          <p>Rapport généré pour : ${email}</p>
          <p style="font-size: 12px; margin-top: 15px;">
            Ce rapport est confidentiel et personnalisé selon vos réponses.<br>
            © ${new Date().getFullYear()} NikahScore. Tous droits réservés.
          </p>
        </div>

      </div>
    </body>
    </html>
  `
}
