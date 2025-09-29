#!/usr/bin/env node

/**
 * Test simple de connexion Supabase
 */

import { createClient } from '@supabase/supabase-js'
import './load-env.mjs'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔍 Test de connexion Supabase')
console.log('URL:', SUPABASE_URL ? 'Configurée' : 'Manquante')
console.log('Service Key:', SUPABASE_SERVICE_KEY ? 'Configurée' : 'Manquante')

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Variables d\'environnement manquantes')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function testConnection() {
  try {
    console.log('\n📡 Test de connexion...')
    
    const { data, error } = await supabase
      .from('questions')
      .select('id')
      .limit(1)
    
    if (error) {
      console.error('❌ Erreur de connexion:', error.message)
      return false
    }
    
    console.log('✅ Connexion réussie!')
    console.log('📊 Nombre de questions actuelles:', data.length === 0 ? 0 : 'Inconnue')
    
    // Test de lecture des questions
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .limit(5)
    
    if (questionsError) {
      console.error('⚠️ Erreur lecture questions:', questionsError.message)
      return true // Connexion OK mais pas de données
    }
    
    console.log(`📋 Échantillon: ${questions?.length || 0} questions trouvées`)
    if (questions && questions.length > 0) {
      console.log('   Première question:', questions[0].text?.substring(0, 50) + '...')
    }
    
    return true
    
  } catch (error) {
    console.error('❌ Erreur inattendue:', error.message)
    return false
  }
}

testConnection().then(success => {
  if (success) {
    console.log('\n🎉 Test de connexion terminé avec succès!')
  } else {
    console.log('\n❌ Test de connexion échoué')
    process.exit(1)
  }
}).catch(error => {
  console.error('❌ Erreur fatale:', error.message)
  process.exit(1)
})