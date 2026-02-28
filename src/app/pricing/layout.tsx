import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tarifs',
  description: 'Plans Gratuit, Premium et Conseil pour NikahScore. Test de compatibilité matrimoniale islamique à partir de 0€.',
  alternates: { canonical: '/pricing' },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children
}
