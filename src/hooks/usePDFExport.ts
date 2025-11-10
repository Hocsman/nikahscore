'use client'

import { useState } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

interface PDFExportOptions {
  filename?: string
  quality?: number
  format?: 'a4' | 'letter'
}

export function usePDFExport() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generatePDF = async (
    elementId: string,
    options: PDFExportOptions = {}
  ) => {
    const {
      filename = 'nikahscore-rapport.pdf',
      quality = 0.95,
      format = 'a4'
    } = options

    setIsGenerating(true)
    setError(null)

    try {
      // Trouver l'élément à capturer
      const element = document.getElementById(elementId)
      if (!element) {
        throw new Error(`Element with id "${elementId}" not found`)
      }

      // Sauvegarder les styles actuels pour les restaurer après
      const originalStyle = {
        maxWidth: element.style.maxWidth,
        padding: element.style.padding,
        backgroundColor: element.style.backgroundColor
      }

      // Optimiser pour le PDF
      element.style.maxWidth = '1200px'
      element.style.padding = '40px'
      element.style.backgroundColor = '#ffffff'

      // Capturer l'élément en canvas avec haute qualité
      const canvas = await html2canvas(element, {
        scale: 2, // Haute résolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 0,
        onclone: (clonedDoc) => {
          // Optimiser les éléments clonés pour le PDF
          const clonedElement = clonedDoc.getElementById(elementId)
          if (clonedElement) {
            // Masquer les boutons d'action
            const buttons = clonedElement.querySelectorAll('button')
            buttons.forEach(btn => btn.style.display = 'none')
            
            // Masquer les éléments interactifs
            const interactive = clonedElement.querySelectorAll('[role="button"]')
            interactive.forEach(el => (el as HTMLElement).style.display = 'none')
          }
        }
      })

      // Restaurer les styles originaux
      element.style.maxWidth = originalStyle.maxWidth
      element.style.padding = originalStyle.padding
      element.style.backgroundColor = originalStyle.backgroundColor

      // Créer le PDF
      const imgWidth = format === 'a4' ? 210 : 216 // A4: 210mm, Letter: 216mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
        unit: 'mm',
        format: format
      })

      const imgData = canvas.toDataURL('image/jpeg', quality)
      
      // Si le contenu est trop long, créer plusieurs pages
      const pageHeight = format === 'a4' ? 297 : 279 // A4: 297mm, Letter: 279mm
      let heightLeft = imgHeight
      let position = 0

      // Première page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      // Pages supplémentaires si nécessaire
      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // Sauvegarder le PDF
      pdf.save(filename)

      return true
    } catch (err) {
      console.error('❌ Erreur génération PDF:', err)
      setError(err instanceof Error ? err.message : 'Erreur lors de la génération du PDF')
      return false
    } finally {
      setIsGenerating(false)
    }
  }

  return {
    generatePDF,
    isGenerating,
    error
  }
}
