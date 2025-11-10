'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Share2, 
  Copy, 
  Check, 
  MessageCircle,
  Mail,
  Link as LinkIcon
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAchievements } from '@/hooks/useAchievements'

interface ShareButtonsProps {
  pairId: string
  overallScore: number
  partnerName?: string
}

export function ShareButtons({ pairId, overallScore, partnerName }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const { checkAchievements } = useAchievements()

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const resultsUrl = `${baseUrl}/results/${pairId}`
  
  const scoreEmoji = overallScore >= 80 ? '💚' : overallScore >= 60 ? '💛' : '💙'
  const partnerText = partnerName ? ` avec ${partnerName}` : ''
  
  const shareMessage = `${scoreEmoji} J'ai obtenu ${overallScore}% de compatibilité${partnerText} sur NikahScore ! Découvre notre score : ${resultsUrl}`
  
  const emailSubject = 'Notre Score de Compatibilité NikahScore'
  const emailBody = `Salam,\n\nNous avons complété le questionnaire de compatibilité sur NikahScore et obtenu un score de ${overallScore}%.\n\nConsulte nos résultats détaillés : ${resultsUrl}\n\nBarakAllahu fik !`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(resultsUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      // Vérifier les achievements de partage
      await checkAchievements()
    } catch (err) {
      console.error('Erreur copie lien:', err)
    }
  }

  const handleWhatsAppShare = async () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`
    window.open(whatsappUrl, '_blank')
    // Vérifier les achievements de partage
    await checkAchievements()
  }

  const handleEmailShare = async () => {
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
    window.open(mailtoUrl)
    // Vérifier les achievements de partage
    await checkAchievements()
  }

  const handleNativeShare = async () => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: 'NikahScore - Résultats de Compatibilité',
          text: shareMessage,
          url: resultsUrl,
        })
        // Vérifier les achievements de partage
        await checkAchievements()
      } catch (err) {
        console.error('Erreur partage natif:', err)
      }
    } else {
      // Fallback sur le dropdown menu
      handleCopyLink()
    }
  }

  // Vérifier si le partage natif est disponible
  const hasNativeShare = typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'share' in navigator

  return (
    <div className="flex items-center gap-2">
      {/* Bouton principal de partage */}
      {hasNativeShare ? (
        <Button
          onClick={handleNativeShare}
          className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Partager mes résultats
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white">
              <Share2 className="w-4 h-4 mr-2" />
              Partager mes résultats
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={handleWhatsAppShare} className="cursor-pointer">
              <MessageCircle className="w-4 h-4 mr-2 text-green-600" />
              <span>Partager sur WhatsApp</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEmailShare} className="cursor-pointer">
              <Mail className="w-4 h-4 mr-2 text-blue-600" />
              <span>Envoyer par Email</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  <span className="text-green-600">Lien copié !</span>
                </>
              ) : (
                <>
                  <LinkIcon className="w-4 h-4 mr-2" />
                  <span>Copier le lien</span>
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Bouton rapide copier (visible sur desktop) */}
      <Button
        onClick={handleCopyLink}
        variant="outline"
        className="hidden sm:flex"
        disabled={copied}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 mr-2 text-green-600" />
            Copié !
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 mr-2" />
            Copier le lien
          </>
        )}
      </Button>
    </div>
  )
}
