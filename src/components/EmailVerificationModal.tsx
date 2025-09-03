'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Mail, Send, CheckCircle, AlertCircle } from 'lucide-react'

interface EmailModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (email: string, code?: string) => Promise<void>
  title: string
  description: string
  action: 'download' | 'share'
}

export default function EmailVerificationModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title, 
  description, 
  action 
}: EmailModalProps) {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'email' | 'code' | 'success'>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleEmailSubmit = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Veuillez entrer une adresse email valide')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      // Envoyer le code de vérification
      const response = await fetch('/api/send-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, action })
      })

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du code')
      }

      setStep('code')
    } catch (err) {
      setError('Erreur lors de l\'envoi du code. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  const handleCodeSubmit = async () => {
    if (!code || code.length !== 6) {
      setError('Le code doit contenir 6 chiffres')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      await onSubmit(email, code)
      setStep('success')
      setTimeout(() => {
        onClose()
        resetModal()
      }, 2000)
    } catch (err) {
      setError('Code incorrect. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  const resetModal = () => {
    setEmail('')
    setCode('')
    setStep('email')
    setError('')
    setLoading(false)
  }

  const handleClose = () => {
    onClose()
    resetModal()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="bg-white shadow-2xl border-0">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <span>{title}</span>
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleClose}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <AnimatePresence mode="wait">
                  {step === 'email' && (
                    <motion.div
                      key="email"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-4"
                    >
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {description}
                      </p>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Adresse email
                        </label>
                        <Input
                          type="email"
                          placeholder="votre@email.com"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value)
                            setError('')
                          }}
                          className="h-12"
                          disabled={loading}
                        />
                      </div>

                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center space-x-2 text-red-600 text-sm"
                        >
                          <AlertCircle className="w-4 h-4" />
                          <span>{error}</span>
                        </motion.div>
                      )}

                      <Button
                        onClick={handleEmailSubmit}
                        disabled={loading || !email}
                        className="w-full h-12 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                      >
                        {loading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Envoi en cours...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Send className="w-4 h-4" />
                            <span>Envoyer le code</span>
                          </div>
                        )}
                      </Button>
                    </motion.div>
                  )}

                  {step === 'code' && (
                    <motion.div
                      key="code"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-4"
                    >
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Mail className="w-8 h-8 text-blue-600" />
                        </div>
                        <p className="text-sm text-gray-600">
                          Un code de vérification a été envoyé à<br />
                          <span className="font-medium text-gray-800">{email}</span>
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Code de vérification (6 chiffres)
                        </label>
                        <Input
                          type="text"
                          placeholder="123456"
                          value={code}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').substring(0, 6)
                            setCode(value)
                            setError('')
                          }}
                          className="h-12 text-center text-lg font-mono tracking-widest"
                          disabled={loading}
                          maxLength={6}
                        />
                      </div>

                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center space-x-2 text-red-600 text-sm"
                        >
                          <AlertCircle className="w-4 h-4" />
                          <span>{error}</span>
                        </motion.div>
                      )}

                      <div className="flex space-x-3">
                        <Button
                          variant="outline"
                          onClick={() => setStep('email')}
                          disabled={loading}
                          className="flex-1"
                        >
                          Retour
                        </Button>
                        <Button
                          onClick={handleCodeSubmit}
                          disabled={loading || code.length !== 6}
                          className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                        >
                          {loading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            'Valider'
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {step === 'success' && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-6"
                    >
                      <motion.div
                        className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6 }}
                      >
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </motion.div>
                      <h3 className="text-lg font-semibold text-green-800 mb-2">
                        {action === 'download' ? 'Téléchargement en cours...' : 'Partage réussi !'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {action === 'download' 
                          ? 'Votre rapport PDF va se télécharger automatiquement.'
                          : 'Vos résultats ont été partagés avec succès.'
                        }
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
