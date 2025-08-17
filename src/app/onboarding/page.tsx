'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { ArrowRight, User, MapPin, Heart, Target } from 'lucide-react'

interface OnboardingData {
  age: string
  city: string
  practiceLevel: string
  marriageIntention: string
}

export default function OnboardingPage() {
  const [data, setData] = useState<OnboardingData>({
    age: '',
    city: '',
    practiceLevel: '',
    marriageIntention: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          age: data.age,
          city: data.city,
          practiceLevel: data.practiceLevel,
          marriageIntention: data.marriageIntention
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la sauvegarde')
      }
      
      toast({
        title: "Profil créé !",
        description: "Passons maintenant au questionnaire de compatibilité.",
      })
      
      // Redirection vers le questionnaire
      router.push('/questionnaire')
      
    } catch (error: any) {
      console.error('Erreur onboarding:', error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la sauvegarde.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = data.age && data.city && data.practiceLevel && data.marriageIntention

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <User className="h-6 w-6" />
            Créons votre profil
          </CardTitle>
          <CardDescription>
            Quelques informations pour personnaliser votre expérience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Âge */}
            <div className="space-y-2">
              <Label htmlFor="age" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Âge
              </Label>
              <Input
                id="age"
                type="number"
                min="18"
                max="100"
                placeholder="25"
                value={data.age}
                onChange={(e) => setData(prev => ({ ...prev, age: e.target.value }))}
                required
              />
            </div>

            {/* Ville */}
            <div className="space-y-2">
              <Label htmlFor="city" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Ville de résidence
              </Label>
              <Input
                id="city"
                type="text"
                placeholder="Paris, Lyon, Marseille..."
                value={data.city}
                onChange={(e) => setData(prev => ({ ...prev, city: e.target.value }))}
                required
              />
            </div>

            {/* Niveau de pratique */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Niveau de pratique religieuse
              </Label>
              <Select 
                value={data.practiceLevel} 
                onValueChange={(value) => setData(prev => ({ ...prev, practiceLevel: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debutant">
                    <div className="flex flex-col text-left">
                      <span className="font-medium">Débutant</span>
                      <span className="text-sm text-gray-500">Je découvre ou redécouvre l'Islam</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="pratiquant">
                    <div className="flex flex-col text-left">
                      <span className="font-medium">Pratiquant</span>
                      <span className="text-sm text-gray-500">Je pratique régulièrement (prières, jeûne)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="tres_pratiquant">
                    <div className="flex flex-col text-left">
                      <span className="font-medium">Très pratiquant</span>
                      <span className="text-sm text-gray-500">Islam au centre de ma vie quotidienne</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Intention de mariage */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Intention de mariage
              </Label>
              <Select 
                value={data.marriageIntention} 
                onValueChange={(value) => setData(prev => ({ ...prev, marriageIntention: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Quand souhaitez-vous vous marier ?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dans_annee">
                    <div className="flex flex-col text-left">
                      <span className="font-medium">Dans l'année</span>
                      <span className="text-sm text-gray-500">Je souhaite me marier rapidement</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="dans_2_ans">
                    <div className="flex flex-col text-left">
                      <span className="font-medium">Dans les 2 ans</span>
                      <span className="text-sm text-gray-500">Je prends le temps nécessaire</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="pas_presse">
                    <div className="flex flex-col text-left">
                      <span className="font-medium">Pas pressé(e)</span>
                      <span className="text-sm text-gray-500">Quand la bonne personne se présentera</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                'Sauvegarde...'
              ) : (
                <>
                  Continuer vers le questionnaire
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
