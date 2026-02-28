import type { Metadata } from 'next'
import LandingPage from '@/components/LandingPage'

export const metadata: Metadata = {
  title: 'NikahScore - Compatibilité Matrimoniale Islamique | Test Gratuit',
  description: 'Évaluez votre compatibilité matrimoniale selon les valeurs islamiques. Questionnaire scientifique de 100 questions, analyse détaillée et conseils personnalisés. Commencez gratuitement.',
  alternates: { canonical: '/' },
}

export default function HomePage() {
  return <LandingPage />
}
