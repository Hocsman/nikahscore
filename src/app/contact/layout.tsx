import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: "Contactez l'équipe NikahScore pour toute question sur la compatibilité matrimoniale islamique. Réponse sous 24h.",
  alternates: { canonical: '/contact' },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
