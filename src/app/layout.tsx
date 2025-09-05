import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '../styles/mobile-optimizations.css'
import { Toaster } from '@/components/ui/toaster'
import { ClientProviders } from '@/components/ClientProviders'
import { Navbar } from '@/components/NavbarSimple'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'NikahScore - Compatibilité Matrimoniale Islamique',
  description: 'Découvrez votre compatibilité matrimoniale selon les valeurs islamiques avec notre questionnaire détaillé et nos analyses approfondies.',
  keywords: 'mariage islamique, compatibilité, nikah, musulman, questionnaire matrimonial',
  authors: [{ name: 'NikahScore Team' }],
  creator: 'NikahScore',
  publisher: 'NikahScore',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'NikahScore - Compatibilité Matrimoniale Islamique',
    description: 'Découvrez votre compatibilité matrimoniale selon les valeurs islamiques',
    url: '/',
    siteName: 'NikahScore',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NikahScore - Compatibilité Matrimoniale Islamique',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NikahScore - Compatibilité Matrimoniale Islamique',
    description: 'Découvrez votre compatibilité matrimoniale selon les valeurs islamiques',
    images: ['/og-image.png'],
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
        </ClientProviders>
      </body>
    </html>
  )
}
