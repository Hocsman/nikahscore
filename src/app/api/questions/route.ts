import { NextResponse } from 'next/server'
import { PERSONALITY_QUESTIONS } from '@/data/personality-questions'

// 100 questions NikahScore axées sur la personnalité

export async function GET() {
  try {
    // Essayer d'abord Supabase
    
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
        return NextResponse.json({ 
          questions: data,
          source: 'supabase',
          count: data.length 
        })
      } else {
      }
    } else {
    }
    
    // Fallback vers les questions en dur
    return NextResponse.json({ 
      questions: PERSONALITY_QUESTIONS,
      source: 'fallback-v2',
      count: PERSONALITY_QUESTIONS.length,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Erreur API:', error)
    // Fallback final
    return NextResponse.json({ 
      questions: PERSONALITY_QUESTIONS,
      source: 'fallback-error',
      count: PERSONALITY_QUESTIONS.length 
    })
  }
}
