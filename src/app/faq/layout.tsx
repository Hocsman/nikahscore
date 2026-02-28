import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Questions fréquentes sur NikahScore : fonctionnement du test, confidentialité, plans, remboursement et accompagnement matrimonial.',
  alternates: { canonical: '/faq' },
}

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children
}
