import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET() {
  try {
    console.log('🔍 Tentative connexion Supabase...')
    console.log('URL:', supabaseUrl)
    console.log('Key exists:', !!supabaseKey)
    
    const { data: questions, error } = await supabase
      .from('questions')
      .select('*')
      .order('order_index', { ascending: true })

    if (error) {
      console.error('❌ Erreur Supabase:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des questions', details: error },
        { status: 500 }
      )
    }

    console.log('✅ Questions récupérées:', questions?.length || 0)
    return NextResponse.json({ questions: questions || [] })
  } catch (error) {
    console.error('❌ Erreur API:', error)
    return NextResponse.json(
      { error: 'Erreur serveur', details: error },
      { status: 500 }
    )
  }
}
