import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '../styles/mobile-optimizations.css'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from 'sonner'
import { ClientProviders } from '@/components/ClientProviders'
import { Navbar } from '@/components/NavbarSimple'
import { Analytics } from '@vercel/analytics/react'
import { StructuredData } from '@/components/StructuredData'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'NikahScore - Compatibilité Matrimoniale Islamique',
    template: '%s | NikahScore',
  },
  description: 'Découvrez votre compatibilité matrimoniale selon les valeurs islamiques avec notre questionnaire scientifique. Test de couple détaillé, analyse approfondie et conseils personnalisés pour un mariage réussi.',
  keywords: [
    'mariage musulman',
    'compatibilité matrimoniale',
    'nikah',
    'test couple musulman',
    'mariage halal',
    'questionnaire mariage islamique',
    'compatibilité couple islam',
    'préparation nikah',
    'conseil matrimonial musulman',
    'mariage islamique en ligne',
    'test compatibilité halal',
    'couple musulman',
  ],
  authors: [{ name: 'NikahScore Team' }],
  creator: 'NikahScore',
  publisher: 'NikahScore',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nikahscore.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'NikahScore - Compatibilité Matrimoniale Islamique',
    description: 'Test de compatibilité matrimoniale scientifique pour couples musulmans. Découvrez vos forces, points d\'amélioration et recevez des conseils personnalisés.',
    url: 'https://nikahscore.com',
    siteName: 'NikahScore',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NikahScore - Plateforme de Compatibilité Matrimoniale Islamique',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NikahScore - Compatibilité Matrimoniale Islamique',
    description: 'Test de compatibilité pour couples musulmans. Analyse détaillée et conseils personnalisés.',
    images: ['/twitter-image.png'],
    creator: '@NikahScore',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'votre-code-google-search-console',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ClientProviders>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
          </div>
          <Toaster />
          <Sonner />
        </ClientProviders>
        <StructuredData />
        <Analytics />
      </body>
    </html>
  )
}
