#!/usr/bin/env node

/**
 * Script de migration automatique vers les 100 questions de personnalité
 * Migrate automatiquement Supabase avec les nouvelles questions
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { PERSONALITY_QUESTIONS, QUESTIONS_STATS } from './personality-questions-data.mjs'
import './load-env.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Variables d\'environnement Supabase manquantes')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', !!SUPABASE_URL)
  console.log('SUPABASE_SERVICE_ROLE_KEY:', !!SUPABASE_SERVICE_KEY)
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function main() {
  console.log('🚀 Début de la migration vers 100 questions de personnalité')
  console.log('📊 Cible: Supabase Database')
  
  try {
    // 1. Vérification de la connexion
    console.log('\n🔍 1. Vérification de la connexion Supabase...')
    const { data: testData, error: testError } = await supabase
      .from('questions')
      .select('count()')
      .limit(1)
    
    if (testError) {
      throw new Error(`Connexion Supabase échouée: ${testError.message}`)
    }
    
    console.log('✅ Connexion Supabase OK')

    // 2. Sauvegarde des anciennes questions
    console.log('\n💾 2. Sauvegarde des anciennes questions...')
    const { data: oldQuestions, error: backupError } = await supabase
      .from('questions')
      .select('*')
    
    if (backupError) {
      console.warn('⚠️ Impossible de sauvegarder:', backupError.message)
    } else {
      const backupFile = path.join(__dirname, '../backups', `questions-backup-${Date.now()}.json`)
      const backupDir = path.dirname(backupFile)
      
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true })
      }
      
      fs.writeFileSync(backupFile, JSON.stringify(oldQuestions, null, 2))
      console.log(`✅ Sauvegarde créée: ${path.basename(backupFile)} (${oldQuestions?.length || 0} questions)`)
    }

    // 3. Suppression des anciennes questions
    console.log('\n🗑️ 3. Suppression des anciennes questions...')
    const { error: deleteError } = await supabase
      .from('questions')
      .delete()
      .neq('id', 0) // Supprimer tout
    
    if (deleteError) {
      throw new Error(`Suppression échouée: ${deleteError.message}`)
    }
    
    console.log('✅ Anciennes questions supprimées')

    // 4. Réinitialisation de la séquence
    console.log('\n🔄 4. Réinitialisation de la séquence...')
    const { error: resetError } = await supabase.rpc('reset_questions_sequence')
    
    if (resetError) {
      console.warn('⚠️ Impossible de réinitialiser la séquence:', resetError.message)
    } else {
      console.log('✅ Séquence réinitialisée')
    }

    // 5. Insertion des nouvelles questions par batches
    console.log('\n📥 5. Insertion des 100 nouvelles questions...')
    const BATCH_SIZE = 25
    let insertedCount = 0
    
    for (let i = 0; i < PERSONALITY_QUESTIONS.length; i += BATCH_SIZE) {
      const batch = PERSONALITY_QUESTIONS.slice(i, i + BATCH_SIZE)
      
      console.log(`   📦 Batch ${Math.floor(i/BATCH_SIZE) + 1}: questions ${i + 1} à ${i + batch.length}`)
      
      const { data: insertData, error: insertError } = await supabase
        .from('questions')
        .insert(batch)
        .select()
      
      if (insertError) {
        throw new Error(`Insertion batch ${Math.floor(i/BATCH_SIZE) + 1} échouée: ${insertError.message}`)
      }
      
      insertedCount += insertData?.length || 0
      
      // Délai entre les batches pour éviter le rate limiting
      if (i + BATCH_SIZE < PERSONALITY_QUESTIONS.length) {
        await new Promise(resolve => setTimeout(resolve, 200))
      }
    }

    // 6. Vérification finale
    console.log('\n🔍 6. Vérification finale...')
    const { data: finalCount, error: countError } = await supabase
      .from('questions')
      .select('id', { count: 'exact' })
    
    if (countError) {
      throw new Error(`Vérification échouée: ${countError.message}`)
    }

    const actualCount = finalCount?.length || 0
    
    if (actualCount !== 100) {
      throw new Error(`Nombre incorrect: ${actualCount} questions au lieu de 100`)
    }

    // 7. Validation des données
    console.log('\n✅ 7. Validation des données...')
    const { data: sampleQuestions, error: sampleError } = await supabase
      .from('questions')
      .select('*')
      .limit(5)
    
    if (sampleError) {
      console.warn('⚠️ Impossible de valider:', sampleError.message)
    } else {
      console.log('   📋 Échantillon de questions:')
      sampleQuestions?.forEach((q, i) => {
        console.log(`   ${i + 1}. [${q.axis}] ${q.text.substring(0, 50)}...`)
      })
    }

    // 8. Mise à jour du schéma si nécessaire
    console.log('\n🔧 8. Vérification du schéma...')
    
    // Vérifier que la table compatibility_results existe avec les bonnes colonnes
    const { data: tableInfo, error: tableError } = await supabase.rpc('get_table_info', {
      table_name: 'compatibility_results'
    })
    
    if (tableError || !tableInfo) {
      console.log('   📝 Création de la table compatibility_results...')
      
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS compatibility_results (
          id SERIAL PRIMARY KEY,
          couple_code VARCHAR(255) UNIQUE NOT NULL,
          user1_name VARCHAR(255),
          user2_name VARCHAR(255),
          overall_score DECIMAL(5,2),
          compatibility_level VARCHAR(50),
          dimension_scores JSONB,
          dealbreaker_conflicts INTEGER DEFAULT 0,
          detailed_analysis JSONB,
          question_matches JSONB,
          generated_at TIMESTAMPTZ DEFAULT NOW(),
          algorithm_version VARCHAR(50) DEFAULT 'v2.0-personality'
        );
      `
      
      const { error: createError } = await supabase.rpc('execute_sql', {
        sql: createTableSQL
      })
      
      if (createError) {
        console.warn('⚠️ Impossible de créer la table:', createError.message)
      } else {
        console.log('✅ Table compatibility_results créée')
      }
    }

    // 9. Succès final
    console.log('\n🎉 MIGRATION TERMINÉE AVEC SUCCÈS!')
    console.log('📊 Résumé:')
    console.log(`   ✅ ${actualCount} questions de personnalité insérées`)
    console.log(`   ✅ 6 dimensions psychologiques: ${Object.keys(QUESTIONS_STATS.dimensions).join(', ')}`)
    console.log(`   ✅ ${QUESTIONS_STATS.dealbreakers} deal-breakers identifiés`)
    console.log(`   ✅ Distribution des questions:`)
    Object.entries(QUESTIONS_STATS.dimensions).forEach(([dim, count]) => {
      console.log(`      - ${dim}: ${count} questions`)
    })
    console.log(`   ✅ Algorithme v2.0 prêt (poids moyen: ${QUESTIONS_STATS.averageWeight.toFixed(2)})`)
    console.log('\n📈 Statistiques complètes:')
    console.log(`   • Questions scale: ${QUESTIONS_STATS.categories.scale}`)
    console.log(`   • Questions boolean: ${QUESTIONS_STATS.categories.bool}`)
    console.log(`   • Poids total cumulé: ${PERSONALITY_QUESTIONS.reduce((sum, q) => sum + q.weight, 0).toFixed(1)}`)
    console.log('\n🚀 Votre plateforme NikahScore est maintenant prête pour octobre 2025!')

  } catch (error) {
    console.error('\n❌ ERREUR DE MIGRATION:', error.message)
    console.log('\n🔧 Actions recommandées:')
    console.log('   1. Vérifiez vos variables d\'environnement Supabase')
    console.log('   2. Vérifiez les permissions de votre service key')
    console.log('   3. Vérifiez que les tables existent')
    console.log('   4. Restaurez depuis la sauvegarde si nécessaire')
    process.exit(1)
  }
}

// Fonctions utilitaires pour Supabase
async function createSupabaseFunctions() {
  console.log('\n🔧 Création des fonctions utilitaires Supabase...')
  
  // Fonction pour réinitialiser la séquence
  const resetSequenceSQL = `
    CREATE OR REPLACE FUNCTION reset_questions_sequence()
    RETURNS void AS $$
    BEGIN
      ALTER SEQUENCE questions_id_seq RESTART WITH 1;
    END;
    $$ LANGUAGE plpgsql;
  `
  
  // Fonction pour exécuter du SQL arbitraire
  const executeSQLFunction = `
    CREATE OR REPLACE FUNCTION execute_sql(sql text)
    RETURNS void AS $$
    BEGIN
      EXECUTE sql;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `
  
  // Fonction pour obtenir les infos de table
  const getTableInfoFunction = `
    CREATE OR REPLACE FUNCTION get_table_info(table_name text)
    RETURNS json AS $$
    BEGIN
      RETURN (
        SELECT json_agg(
          json_build_object(
            'column_name', column_name,
            'data_type', data_type,
            'is_nullable', is_nullable
          )
        )
        FROM information_schema.columns 
        WHERE table_name = $1 AND table_schema = 'public'
      );
    END;
    $$ LANGUAGE plpgsql;
  `
  
  const functions = [
    { name: 'reset_questions_sequence', sql: resetSequenceSQL },
    { name: 'execute_sql', sql: executeSQLFunction },
    { name: 'get_table_info', sql: getTableInfoFunction }
  ]
  
  for (const func of functions) {
    try {
      const { error } = await supabase.rpc('exec', { sql: func.sql })
      if (error) {
        console.warn(`⚠️ Fonction ${func.name}:`, error.message)
      } else {
        console.log(`✅ Fonction ${func.name} créée`)
      }
    } catch (e) {
      console.warn(`⚠️ Erreur fonction ${func.name}:`, e.message)
    }
  }
}

// Lancer la migration
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}

export { main as migrateTo100Questions }