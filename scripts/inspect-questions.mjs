#!/usr/bin/env node

/**
 * Inspection de la structure de la table questions
 */

import { createClient } from '@supabase/supabase-js'
import './load-env.mjs'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

async function inspectQuestions() {
  console.log('🔍 INSPECTION DE LA TABLE QUESTIONS')
  console.log('=' .repeat(40))
  
  try {
    // Récupérer toutes les questions pour voir leur structure
    const { data: questions, error } = await supabase
      .from('questions')
      .select('*')
      .limit(3)
    
    if (error) {
      console.error('❌ Erreur:', error.message)
      return
    }
    
    console.log(`📊 Nombre de questions trouvées: ${questions?.length || 0}`)
    
    if (questions && questions.length > 0) {
      console.log('\n📋 Structure de la première question:')
      const firstQuestion = questions[0]
      Object.keys(firstQuestion).forEach(key => {
        console.log(`   ${key}: ${typeof firstQuestion[key]} = ${JSON.stringify(firstQuestion[key])}`)
      })
      
      console.log('\n📝 Exemples de questions:')
      questions.forEach((q, i) => {
        console.log(`   ${i + 1}. [${q.axis || 'N/A'}] ${q.text?.substring(0, 60)}...`)
        console.log(`      ID: ${q.id}, Dealbreaker: ${q.is_dealbreaker}`)
      })
    }
    
    // Compter toutes les questions
    const { data: allQuestions, error: countError } = await supabase
      .from('questions')
      .select('id')
    
    if (!countError) {
      console.log(`\n📈 Total des questions: ${allQuestions?.length || 0}`)
    }
    
  } catch (error) {
    console.error('❌ Erreur inattendue:', error.message)
  }
}

inspectQuestions().catch(console.error)