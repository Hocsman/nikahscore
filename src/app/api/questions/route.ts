import { NextResponse } from 'next/server'
import { PERSONALITY_QUESTIONS } from '@/data/personality-questions'

// 100 questions NikahScore axées sur la personnalité

export async function GET() {
  try {
    // Essayer d'abord Supabase
    console.log('🚀 API Questions - Tentative Supabase...')
    
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
        console.log('✅ Supabase connecté:', data.length, 'questions')
        return NextResponse.json({ 
          questions: data,
          source: 'supabase',
          count: data.length 
        })
      } else {
        console.log('⚠️ Supabase vide ou erreur:', error?.message)
      }
    } else {
      console.log('⚠️ Variables Supabase manquantes')
    }
    
    // Fallback vers les questions en dur
    console.log('📊 Fallback vers questions hardcodées')
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
