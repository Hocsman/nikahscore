import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variables d\'environnement Supabase:', {
    url: supabaseUrl ? 'OK' : 'MISSING',
    key: supabaseAnonKey ? 'OK' : 'MISSING'
  })
  throw new Error('Variables d\'environnement Supabase manquantes')
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// Client admin pour les opérations serveur uniquement
export const createSupabaseAdmin = () => {
  if (typeof window !== 'undefined') {
    throw new Error('supabaseAdmin ne peut être utilisé que côté serveur')
  }
  
  const { createClient } = require('@supabase/supabase-js')
  
  return createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

// Types pour TypeScript
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          email_hash: string
          age: number | null
          city: string | null
          practice_level: 'debutant' | 'pratiquant' | 'tres_pratiquant' | null
          marriage_intention: 'dans_annee' | 'dans_2_ans' | 'pas_presse' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          email_hash: string
          age?: number | null
          city?: string | null
          practice_level?: 'debutant' | 'pratiquant' | 'tres_pratiquant' | null
          marriage_intention?: 'dans_annee' | 'dans_2_ans' | 'pas_presse' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          email_hash?: string
          age?: number | null
          city?: string | null
          practice_level?: 'debutant' | 'pratiquant' | 'tres_pratiquant' | null
          marriage_intention?: 'dans_annee' | 'dans_2_ans' | 'pas_presse' | null
          created_at?: string
          updated_at?: string
        }
      }
      pairs: {
        Row: {
          id: string
          user_a_email: string
          user_b_email: string | null
          user_a_hash: string
          user_b_hash: string | null
          status: 'pending' | 'both_completed' | 'expired'
          invite_token: string
          expires_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_a_email: string
          user_b_email?: string | null
          user_a_hash: string
          user_b_hash?: string | null
          status?: 'pending' | 'both_completed' | 'expired'
          invite_token: string
          expires_at: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_a_email?: string
          user_b_email?: string | null
          user_a_hash?: string
          user_b_hash?: string | null
          status?: 'pending' | 'both_completed' | 'expired'
          invite_token?: string
          expires_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          text: string
          category: string
          axis: string
          is_dealbreaker: boolean
          order_index: number
          weight: number
          created_at: string
        }
        Insert: {
          id?: string
          text: string
          category: string
          axis: string
          is_dealbreaker?: boolean
          order_index: number
          weight?: number
          created_at?: string
        }
        Update: {
          id?: string
          text?: string
          category?: string
          axis?: string
          is_dealbreaker?: boolean
          order_index?: number
          weight?: number
          created_at?: string
        }
      }
      answers: {
        Row: {
          id: string
          pair_id: string
          question_id: string
          respondent: 'A' | 'B'
          value: number
          importance: number
          created_at: string
        }
        Insert: {
          id?: string
          pair_id: string
          question_id: string
          respondent: 'A' | 'B'
          value: number
          importance: number
          created_at?: string
        }
        Update: {
          id?: string
          pair_id?: string
          question_id?: string
          respondent?: 'A' | 'B'
          value?: number
          importance?: number
          created_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          pair_id: string
          overall_score: number
          axis_scores: Record<string, number>
          dealbreaker_conflicts: number
          strengths: string[]
          frictions: string[]
          recommendations: string[]
          computed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          pair_id: string
          overall_score: number
          axis_scores: Record<string, number>
          dealbreaker_conflicts?: number
          strengths: string[]
          frictions: string[]
          recommendations: string[]
          computed_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          pair_id?: string
          overall_score?: number
          axis_scores?: Record<string, number>
          dealbreaker_conflicts?: number
          strengths?: string[]
          frictions?: string[]
          recommendations?: string[]
          computed_at?: string
          created_at?: string
        }
      }
    }
  }
}
