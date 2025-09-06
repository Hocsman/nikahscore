import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Vérifier les variables d'environnement critiques
  const envCheck = {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'MANQUANT',
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'MANQUANT',
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'PRÉSENT' : 'MANQUANT',
    RESEND_API_KEY: process.env.RESEND_API_KEY ? 'PRÉSENT' : 'MANQUANT',
    NODE_ENV: process.env.NODE_ENV || 'MANQUANT'
  }

  return NextResponse.json({
    status: 'Environment Check',
    environment: envCheck,
    timestamp: new Date().toISOString(),
    // Test de l'URL de redirection
    emailRedirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL}/questionnaire`
  })
}
