import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'À Propos',
  description: 'Découvrez la mission de NikahScore : prévenir les divorces en aidant les couples musulmans à évaluer leur compatibilité avant le mariage.',
  alternates: { canonical: '/about' },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
