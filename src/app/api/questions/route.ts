import { NextResponse } from 'next/server'

// 60 questions NikahScore en dur (temporaire)
const QUESTIONS = [
  { id: 1, axis: 'Intentions', text: 'Je souhaite me marier dans les 12 prochains mois.', category: 'bool', weight: 1, is_dealbreaker: true, order_index: 1 },
  { id: 2, axis: 'Intentions', text: 'Je souhaite le mariage civil avant toute vie commune.', category: 'bool', weight: 1, is_dealbreaker: true, order_index: 2 },
  { id: 3, axis: 'Intentions', text: 'Le mariage religieux est prioritaire pour moi.', category: 'scale', weight: 1, is_dealbreaker: true, order_index: 3 },
  { id: 4, axis: 'Intentions', text: 'Je recherche une relation sérieuse en vue du mariage.', category: 'bool', weight: 1, is_dealbreaker: false, order_index: 4 },
  { id: 5, axis: 'Intentions', text: 'Je suis prêt(e) à m\'engager pour la vie.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 5 },
  { id: 6, axis: 'Intentions', text: 'Une période de fiançailles courte me convient.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 6 },
  { id: 7, axis: 'Intentions', text: 'Les familles doivent se rencontrer rapidement.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 7 },
  { id: 8, axis: 'Intentions', text: 'Le mariage doit suivre les traditions islamiques.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 8 },
  { id: 9, axis: 'Valeurs', text: 'La pratique religieuse régulière est importante pour moi.', category: 'scale', weight: 1, is_dealbreaker: true, order_index: 9 },
  { id: 10, axis: 'Valeurs', text: 'Je souhaite préserver des limites d\'interaction avant le mariage.', category: 'bool', weight: 1, is_dealbreaker: true, order_index: 10 },
  { id: 11, axis: 'Valeurs', text: 'La lecture du Coran fait partie de ma routine.', category: 'scale', weight: 1, is_dealbreaker: true, order_index: 11 },
  { id: 12, axis: 'Valeurs', text: 'Je prie les cinq prières quotidiennes.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 12 },
  { id: 13, axis: 'Valeurs', text: 'Je jeûne pendant le mois de Ramadan.', category: 'bool', weight: 1, is_dealbreaker: false, order_index: 13 },
  { id: 14, axis: 'Valeurs', text: 'Je souhaite faire le pèlerinage ensemble.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 14 },
  { id: 15, axis: 'Valeurs', text: 'L\'apprentissage religieux en couple est important.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 15 },
  { id: 16, axis: 'Valeurs', text: 'Je participe aux activités de la mosquée.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 16 },
  { id: 17, axis: 'Rôles', text: 'Je préfère une répartition traditionnelle des rôles.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 17 },
  { id: 18, axis: 'Rôles', text: 'L\'homme doit être le principal pourvoyeur financier.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 18 },
  { id: 19, axis: 'Rôles', text: 'La femme peut travailler après le mariage.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 19 },
  { id: 20, axis: 'Rôles', text: 'Les tâches ménagères doivent être partagées.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 20 }
]

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
      questions: QUESTIONS,
      source: 'fallback-v2',
      count: QUESTIONS.length,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Erreur API:', error)
    // Fallback final
    return NextResponse.json({ 
      questions: QUESTIONS,
      source: 'fallback-error',
      count: QUESTIONS.length 
    })
  }
}
