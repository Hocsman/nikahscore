import { NextResponse } from 'next/server'
import { PERSONALITY_QUESTIONS } from '@/data/personality-questions'

// Cache : les questions ne changent quasiment jamais
const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
}

export async function GET() {
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )

      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('order_index')

      if (!error && data && data.length > 0) {
        return NextResponse.json(
          { questions: data, source: 'supabase', count: data.length },
          { headers: CACHE_HEADERS }
        )
      }
    }

    return NextResponse.json(
      { questions: PERSONALITY_QUESTIONS, source: 'fallback-v2', count: PERSONALITY_QUESTIONS.length },
      { headers: CACHE_HEADERS }
    )
  } catch (error) {
    console.error('❌ Erreur API:', error)
    return NextResponse.json(
      { questions: PERSONALITY_QUESTIONS, source: 'fallback-error', count: PERSONALITY_QUESTIONS.length },
      { headers: CACHE_HEADERS }
    )
  }
}
