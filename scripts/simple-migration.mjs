#!/usr/bin/env node

/**
 * Migration simplifiée vers les 100 questions de personnalité
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { PERSONALITY_QUESTIONS, QUESTIONS_STATS } from './personality-questions-data.mjs'
import './load-env.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Variables d\'environnement Supabase manquantes')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function simpleMigration() {
  console.log('🚀 Migration simplifiée vers 100 questions de personnalité')
  console.log('=' .repeat(60))
  
  try {
    // 1. Vérification connexion
    console.log('\n1️⃣ Test de connexion...')
    const { data: testData, error: testError } = await supabase
      .from('questions')
      .select('id')
      .limit(1)
    
    if (testError) {
      throw new Error(`Connexion échouée: ${testError.message}`)
    }
    console.log('✅ Connexion Supabase OK')

    // 2. Sauvegarde existante
    console.log('\n2️⃣ Sauvegarde des questions existantes...')
    const { data: oldQuestions, error: backupError } = await supabase
      .from('questions')
      .select('*')
    
    if (!backupError && oldQuestions) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const backupDir = path.join(__dirname, '../backups')
      
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true })
      }
      
      const backupFile = path.join(backupDir, `questions-backup-${timestamp}.json`)
      fs.writeFileSync(backupFile, JSON.stringify(oldQuestions, null, 2))
      console.log(`✅ Sauvegarde: ${oldQuestions.length} questions → ${path.basename(backupFile)}`)
    }

    // 3. Suppression des anciennes questions
    console.log('\n3️⃣ Suppression des anciennes questions...')
    
    // Récupérer d'abord tous les IDs
    const { data: allQuestions, error: getAllError } = await supabase
      .from('questions')
      .select('id')
    
    if (getAllError) {
      throw new Error(`Lecture des questions échouée: ${getAllError.message}`)
    }
    
    if (allQuestions && allQuestions.length > 0) {
      console.log(`   🗑️ Suppression de ${allQuestions.length} questions existantes...`)
      
      // Supprimer par chunks pour éviter les timeouts
      const deleteChunkSize = 20
      for (let i = 0; i < allQuestions.length; i += deleteChunkSize) {
        const chunk = allQuestions.slice(i, i + deleteChunkSize)
        const ids = chunk.map(q => q.id)
        
        const { error: deleteError } = await supabase
          .from('questions')
          .delete()
          .in('id', ids)
        
        if (deleteError) {
          throw new Error(`Suppression chunk ${Math.floor(i/deleteChunkSize) + 1} échouée: ${deleteError.message}`)
        }
        
        process.stdout.write(`   • Chunk ${Math.floor(i/deleteChunkSize) + 1}/${Math.ceil(allQuestions.length/deleteChunkSize)}... `)
        console.log('✅')
      }
    } else {
      console.log('   ℹ️ Aucune question à supprimer')
    }
    console.log('✅ Anciennes questions supprimées')

    // 4. Insertion par petits batches
    console.log('\n4️⃣ Insertion des 100 nouvelles questions...')
    const BATCH_SIZE = 10 // Plus petit batch pour éviter les timeouts
    let totalInserted = 0
    
    for (let i = 0; i < PERSONALITY_QUESTIONS.length; i += BATCH_SIZE) {
      const batch = PERSONALITY_QUESTIONS.slice(i, i + BATCH_SIZE)
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1
      const totalBatches = Math.ceil(PERSONALITY_QUESTIONS.length / BATCH_SIZE)
      
      process.stdout.write(`   📦 Batch ${batchNumber}/${totalBatches} (questions ${i + 1}-${i + batch.length})... `)
      
      const { data: insertedData, error: insertError } = await supabase
        .from('questions')
        .insert(batch)
        .select('id')
      
      if (insertError) {
        console.error(`❌ Erreur batch ${batchNumber}:`, insertError.message)
        throw new Error(`Insertion batch ${batchNumber} échouée`)
      }
      
      totalInserted += insertedData?.length || 0
      console.log(`✅ ${insertedData?.length || 0} questions`)
      
      // Délai entre batches
      if (i + BATCH_SIZE < PERSONALITY_QUESTIONS.length) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    // 5. Vérification finale
    console.log('\n5️⃣ Vérification finale...')
    const { data: finalQuestions, error: finalError } = await supabase
      .from('questions')
      .select('id, axis, text, is_dealbreaker')
    
    if (finalError) {
      throw new Error(`Vérification échouée: ${finalError.message}`)
    }

    const finalCount = finalQuestions?.length || 0
    
    if (finalCount !== 100) {
      throw new Error(`Nombre incorrect: ${finalCount} questions au lieu de 100`)
    }

    // 6. Statistiques finales
    console.log('\n6️⃣ Analyse des résultats...')
    const dimensionStats = {}
    let dealbreakerCount = 0
    
    finalQuestions.forEach(q => {
      if (!dimensionStats[q.axis]) {
        dimensionStats[q.axis] = 0
      }
      dimensionStats[q.axis]++
      
      if (q.is_dealbreaker) {
        dealbreakerCount++
      }
    })

    console.log('\n🎉 MIGRATION TERMINÉE AVEC SUCCÈS!')
    console.log('=' .repeat(60))
    console.log(`✅ ${finalCount} questions de personnalité insérées`)
    console.log('✅ Distribution par dimension:')
    Object.entries(dimensionStats).forEach(([dim, count]) => {
      console.log(`   • ${dim}: ${count} questions`)
    })
    console.log(`✅ ${dealbreakerCount} deal-breakers configurés`)
    console.log('✅ Algorithme v2.0 prêt pour la production')
    
    console.log('\n🚀 Votre plateforme NikahScore est maintenant prête!')
    console.log('📅 Objectif octobre 2025: ✅ EN BONNE VOIE!')

  } catch (error) {
    console.error('\n❌ ERREUR DE MIGRATION:', error.message)
    console.log('\n🔧 Actions recommandées:')
    console.log('   1. Vérifiez votre connexion internet')
    console.log('   2. Vérifiez les permissions Supabase')
    console.log('   3. Restaurez depuis la sauvegarde si nécessaire')
    
    // Tentative de restauration si une sauvegarde existe
    try {
      const backupDir = path.join(__dirname, '../backups')
      if (fs.existsSync(backupDir)) {
        const backupFiles = fs.readdirSync(backupDir)
          .filter(f => f.startsWith('questions-backup-'))
          .sort()
          .reverse()
        
        if (backupFiles.length > 0) {
          console.log(`   4. Dernière sauvegarde: ${backupFiles[0]}`)
        }
      }
    } catch (e) {
      // Ignore backup check errors
    }
    
    process.exit(1)
  }
}

// Lancer la migration
simpleMigration().catch(console.error)