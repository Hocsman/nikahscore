'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { Mail, Loader2, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const router = useRouter()
  
  const supabase = createClient()

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Pour le développement, on simule l'envoi du code
      // En production, on utilisera signInWithOtp
      
      // Simuler un délai
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast({
        title: "Mode développement",
        description: "Utilisez le code: 123456",
      })
      
      setCodeSent(true)
      
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi du code:', error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'envoi du code.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsVerifying(true)

    try {
      // Pour le développement, on vérifie le code simulé
      if (otp !== '123456') {
        throw new Error('Code incorrect')
      }

      // Créer ou connecter l'utilisateur
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: 'temp_password_123', // Mot de passe temporaire pour le développement
      })

      if (signUpError && signUpError.message !== 'User already registered') {
        throw signUpError
      }

      // Si l'utilisateur existe déjà, on le connecte
      if (signUpError?.message === 'User already registered') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: 'temp_password_123',
        })
        
        if (error) {
          throw error
        }
      }

      toast({
        title: "Connexion réussie !",
        description: "Redirection vers votre profil...",
      })
      
      router.push('/onboarding')

    } catch (error: any) {
      console.error('Erreur lors de la vérification:', error)
      toast({
        title: "Code incorrect",
        description: "Utilisez le code: 123456",
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
          <CardDescription>
            Entrez votre email pour recevoir un code de connexion sécurisé
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!codeSent ? (
            // Formulaire pour demander le code
            <>
              <form onSubmit={handleSendCode} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    'Envoyer le code'
                  )}
                </Button>
              </form>
              
              <div className="mt-6 text-center text-sm text-gray-600">
                <p>
                  Vous recevrez un code de connexion valable 10 minutes.
                </p>
                <p className="mt-2">
                  Pas encore de compte ? Il sera créé automatiquement lors de votre première connexion.
                </p>
              </div>
            </>
          ) : (
            // Formulaire pour saisir le code
            <>
              <div className="text-center mb-6">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold">Code envoyé !</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Nous avons envoyé un code de connexion à <strong>{email}</strong>
                </p>
              </div>

              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="otp" className="text-sm font-medium">
                    Code de connexion
                  </label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="text-center text-xl font-mono tracking-wider"
                    maxLength={6}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isVerifying || otp.length !== 6}>
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Vérification...
                    </>
                  ) : (
                    'Vérifier le code'
                  )}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <Button 
                  variant="link" 
                  onClick={() => {
                    setCodeSent(false)
                    setOtp('')
                  }}
                  className="text-sm"
                >
                  Utiliser une autre adresse email
                </Button>
              </div>
              
              <div className="mt-4 text-center text-sm text-gray-600">
                <p>
                  Le code expire dans 10 minutes. Vérifiez vos spams si vous ne le recevez pas.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
