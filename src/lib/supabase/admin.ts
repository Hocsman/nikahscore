import { createClient } from '@supabase/supabase-js'

/**
 * Crée un client Supabase admin avec le service role key.
 * À utiliser uniquement dans les API routes côté serveur pour bypasser RLS.
 * IMPORTANT: Ne pas initialiser au niveau du module pour éviter les erreurs au build.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
