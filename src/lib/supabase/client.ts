import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Pendant le build/prerendering, les env vars NEXT_PUBLIC_ peuvent ne pas être disponibles.
  // On utilise des placeholders pour éviter le crash au build - le vrai client sera créé au runtime.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
