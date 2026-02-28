import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Connexion & Inscription',
  description: 'Connectez-vous ou créez votre compte NikahScore pour accéder au test de compatibilité matrimoniale islamique.',
  alternates: { canonical: '/auth' },
  robots: { index: false, follow: false },
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children
}
