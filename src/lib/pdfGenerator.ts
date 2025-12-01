import jsPDF from 'jspdf'

interface DimensionScore {
    name: string
    score: number
    maxScore?: number
    percentage?: number
}

interface PDFData {
    user1Name: string
    user2Name: string
    overallScore: number
    dimensions: DimensionScore[]
    strengths: string[]
    improvements: string[]
    recommendations: string[]
    coupleCode: string
    generatedDate: string
}

/**
 * Génère un PDF professionnel du rapport de compatibilité avec jsPDF
 * @param data - Données du rapport de compatibilité
 * @returns Blob du PDF généré
 */
export function generateCompatibilityPDF(data: PDFData): Blob {
    const doc = new jsPDF('p', 'mm', 'a4')
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    let yPosition = margin

    // Couleurs
    const primaryColor = [147, 51, 234] // Purple
    const secondaryColor = [236, 72, 153] // Pink
    const textDark = [31, 41, 55]
    const textLight = [107, 114, 128]
    const green = [16, 185, 129]
    const orange = [251, 146, 60]
    const blue = [59, 130, 246]

    // Helper: Ajouter une nouvelle page si nécessaire
    const checkPageBreak = (heightNeeded: number) => {
        if (yPosition + heightNeeded > pageHeight - margin) {
            doc.addPage()
            yPosition = margin
            return true
        }
        return false
    }

    // Helper: Score color
    const getScoreColor = (score: number): number[] => {
        if (score >= 80) return green
        if (score >= 65) return blue
        if (score >= 50) return orange
        return [239, 68, 68] // Red
    }

    // ========== HEADER ==========
    // Gradient background (simulé avec rectangles)
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.rect(0, 0, pageWidth, 80, 'F')

    // Logo / Titre
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(28)
    doc.setFont('helvetica', 'bold')
    doc.text('🎯 NikahScore', pageWidth / 2, 25, { align: 'center' })

    doc.setFontSize(14)
    doc.setFont('helvetica', 'normal')
    doc.text('Rapport de Compatibilité Matrimoniale', pageWidth / 2, 35, { align: 'center' })

    // Score global - cercle
    const circleX = pageWidth / 2
    const circleY = 55
    const circleRadius = 15

    doc.setFillColor(255, 255, 255)
    doc.circle(circleX, circleY, circleRadius, 'F')

    const scoreColor = getScoreColor(data.overallScore)
    doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2])
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text(`${data.overallScore}%`, circleX, circleY + 2, { align: 'center' })

    yPosition = 90

    // ========== INFO COUPLE ==========
    doc.setTextColor(textDark[0], textDark[1], textDark[2])
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text(`${data.user1Name} & ${data.user2Name}`, pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 6

    doc.setFontSize(9)
    doc.setTextColor(textLight[0], textLight[1], textLight[2])
    doc.text(`Code couple: ${data.coupleCode} • Généré le ${data.generatedDate}`, pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 15

    // ========== SCORES PAR DIMENSION ==========
    checkPageBreak(80)

    doc.setFillColor(249, 250, 251)
    doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 10, 2, 2, 'F')

    doc.setTextColor(textDark[0], textDark[1], textDark[2])
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('📊 Scores par Dimension', margin + 5, yPosition + 7)
    yPosition += 15

    data.dimensions.forEach((dimension, index) => {
        checkPageBreak(15)

        const percentage = dimension.percentage || Math.round((dimension.score / (dimension.maxScore || 100)) * 100)
        const dimColor = getScoreColor(percentage)

        // Nom de la dimension
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(textDark[0], textDark[1], textDark[2])
        doc.text(dimension.name, margin + 5, yPosition)

        // Barre de progression
        const barWidth = 100
        const barX = pageWidth - margin - barWidth - 25
        const barY = yPosition - 4

        // Background bar
        doc.setFillColor(229, 231, 235)
        doc.roundedRect(barX, barY, barWidth, 6, 1, 1, 'F')

        // Progress bar
        doc.setFillColor(dimColor[0], dimColor[1], dimColor[2])
        doc.roundedRect(barX, barY, (barWidth * percentage) / 100, 6, 1, 1, 'F')

        // Pourcentage
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(dimColor[0], dimColor[1], dimColor[2])
        doc.text(`${percentage}%`, pageWidth - margin - 15, yPosition, { align: 'right' })

        yPosition += 10
    })

    yPosition += 10

    // ========== POINTS FORTS ==========
    if (data.strengths.length > 0) {
        checkPageBreak(30)

        doc.setFillColor(220, 252, 231)
        doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 10, 2, 2, 'F')

        doc.setTextColor(4, 120, 87)
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text('🏆 Vos Points Forts', margin + 5, yPosition + 7)
        yPosition += 15

        data.strengths.forEach((strength, index) => {
            checkPageBreak(12)

            doc.setFillColor(255, 255, 255)
            doc.roundedRect(margin, yPosition - 4, pageWidth - 2 * margin, 10, 2, 2, 'F')

            doc.setFillColor(green[0], green[1], green[2])
            doc.rect(margin, yPosition - 4, 3, 10, 'F')

            doc.setFontSize(9)
            doc.setFont('helvetica', 'normal')
            doc.setTextColor(textDark[0], textDark[1], textDark[2])

            const lines = doc.splitTextToSize(strength, pageWidth - 2 * margin - 15)
            doc.text(lines, margin + 8, yPosition + 2)

            yPosition += 12
        })

        yPosition += 5
    }

    // ========== POINTS D'AMÉLIORATION ==========
    if (data.improvements.length > 0) {
        checkPageBreak(30)

        doc.setFillColor(254, 243, 199)
        doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 10, 2, 2, 'F')

        doc.setTextColor(146, 64, 14)
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text('⚡ Points d\'Amélioration', margin + 5, yPosition + 7)
        yPosition += 15

        data.improvements.forEach((improvement, index) => {
            checkPageBreak(12)

            doc.setFillColor(255, 255, 255)
            doc.roundedRect(margin, yPosition - 4, pageWidth - 2 * margin, 10, 2, 2, 'F')

            doc.setFillColor(orange[0], orange[1], orange[2])
            doc.rect(margin, yPosition - 4, 3, 10, 'F')

            doc.setFontSize(9)
            doc.setFont('helvetica', 'normal')
            doc.setTextColor(textDark[0], textDark[1], textDark[2])

            const lines = doc.splitTextToSize(improvement, pageWidth - 2 * margin - 15)
            doc.text(lines, margin + 8, yPosition + 2)

            yPosition += 12
        })

        yPosition += 5
    }

    // ========== RECOMMANDATIONS ==========
    if (data.recommendations.length > 0) {
        checkPageBreak(30)

        doc.setFillColor(219, 234, 254)
        doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 10, 2, 2, 'F')

        doc.setTextColor(30, 64, 175)
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text('💡 Recommandations Personnalisées', margin + 5, yPosition + 7)
        yPosition += 15

        data.recommendations.forEach((recommendation, index) => {
            checkPageBreak(14)

            doc.setFillColor(255, 255, 255)
            doc.roundedRect(margin, yPosition - 4, pageWidth - 2 * margin, 12, 2, 2, 'F')

            doc.setFillColor(blue[0], blue[1], blue[2])
            doc.rect(margin, yPosition - 4, 3, 12, 'F')

            doc.setFontSize(9)
            doc.setFont('helvetica', 'bold')
            doc.setTextColor(blue[0], blue[1], blue[2])
            doc.text(`${index + 1}.`, margin + 8, yPosition + 2)

            doc.setFont('helvetica', 'normal')
            doc.setTextColor(textDark[0], textDark[1], textDark[2])

            const lines = doc.splitTextToSize(recommendation, pageWidth - 2 * margin - 20)
            doc.text(lines, margin + 15, yPosition + 2)

            yPosition += 14
        })
    }

    // ========== FOOTER ==========
    const footerY = pageHeight - 20
    doc.setDrawColor(229, 231, 235)
    doc.line(margin, footerY, pageWidth - margin, footerY)

    doc.setFontSize(8)
    doc.setTextColor(textLight[0], textLight[1], textLight[2])
    doc.setFont('helvetica', 'normal')
    doc.text('NikahScore.com - Plateforme de compatibilité matrimoniale islamique', pageWidth / 2, footerY + 5, { align: 'center' })
    doc.text(`© ${new Date().getFullYear()} NikahScore. Tous droits réservés. | Confidentiel et personnalisé`, pageWidth / 2, footerY + 10, { align: 'center' })

    return doc.output('blob')
}
