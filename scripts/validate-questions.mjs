#!/usr/bin/env node

/**
 * Script de validation des 100 questions de personnalité
 * Vérifie l'intégrité et la cohérence des données après migration
 */

import { createClient } from '@supabase/supabase-js'
import { PERSONALITY_QUESTIONS, QUESTIONS_STATS } from './personality-questions-data.mjs'
import './load-env.mjs'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Variables d\'environnement Supabase manquantes')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function validateQuestions() {
  console.log('🔍 VALIDATION DES 100 QUESTIONS DE PERSONNALITÉ')
  console.log('=' .repeat(50))

  let errors = []
  let warnings = []
  let validations = []

  try {
    // 1. Test de connexion
    console.log('\n1️⃣ Test de connexion Supabase...')
    const { data: connectionTest, error: connectionError } = await supabase
      .from('questions')
      .select('count()')
      .limit(1)
    
    if (connectionError) {
      errors.push(`Connexion Supabase: ${connectionError.message}`)
    } else {
      validations.push('✅ Connexion Supabase OK')
    }

    // 2. Vérification du nombre total
    console.log('\n2️⃣ Vérification du nombre total de questions...')
    const { data: allQuestions, error: countError } = await supabase
      .from('questions')
      .select('*')
    
    if (countError) {
      errors.push(`Lecture des questions: ${countError.message}`)
    } else {
      const totalCount = allQuestions?.length || 0
      
      if (totalCount === 100) {
        validations.push(`✅ Nombre correct: ${totalCount} questions`)
      } else {
        errors.push(`❌ Nombre incorrect: ${totalCount} au lieu de 100`)
      }
      
      console.log(`   📊 Questions trouvées: ${totalCount}`)
    }

    // 3. Vérification des dimensions
    console.log('\n3️⃣ Vérification des 6 dimensions...')
    if (allQuestions) {
      const dbDimensions = {}
      allQuestions.forEach(q => {
        if (!dbDimensions[q.axis]) {
          dbDimensions[q.axis] = 0
        }
        dbDimensions[q.axis]++
      })
      
      console.log('   📋 Distribution par dimension:')
      const expectedDimensions = QUESTIONS_STATS.dimensions
      
      for (const [dim, expectedCount] of Object.entries(expectedDimensions)) {
        const actualCount = dbDimensions[dim] || 0
        
        if (actualCount === expectedCount) {
          validations.push(`✅ ${dim}: ${actualCount} questions`)
          console.log(`      ✅ ${dim}: ${actualCount}/${expectedCount}`)
        } else {
          errors.push(`❌ ${dim}: ${actualCount} au lieu de ${expectedCount}`)
          console.log(`      ❌ ${dim}: ${actualCount}/${expectedCount}`)
        }
      }
      
      // Dimensions inattendues
      for (const dim of Object.keys(dbDimensions)) {
        if (!expectedDimensions[dim]) {
          warnings.push(`⚠️ Dimension inattendue: ${dim}`)
          console.log(`      ⚠️ Dimension inattendue: ${dim}`)
        }
      }
    }

    // 4. Vérification des deal-breakers
    console.log('\n4️⃣ Vérification des deal-breakers...')
    if (allQuestions) {
      const dealbreakers = allQuestions.filter(q => q.is_dealbreaker)
      const expectedDealbreakers = QUESTIONS_STATS.dealbreakers
      
      if (dealbreakers.length === expectedDealbreakers) {
        validations.push(`✅ Deal-breakers: ${dealbreakers.length}`)
        console.log(`   ✅ Deal-breakers trouvés: ${dealbreakers.length}/${expectedDealbreakers}`)
      } else {
        errors.push(`❌ Deal-breakers: ${dealbreakers.length} au lieu de ${expectedDealbreakers}`)
        console.log(`   ❌ Deal-breakers trouvés: ${dealbreakers.length}/${expectedDealbreakers}`)
      }
      
      // Liste des deal-breakers par dimension
      const dealbreakersByDim = {}
      dealbreakers.forEach(q => {
        if (!dealbreakersByDim[q.axis]) {
          dealbreakersByDim[q.axis] = 0
        }
        dealbreakersByDim[q.axis]++
      })
      
      console.log('   📋 Deal-breakers par dimension:')
      Object.entries(dealbreakersByDim).forEach(([dim, count]) => {
        console.log(`      - ${dim}: ${count}`)
      })
    }

    // 5. Vérification des catégories
    console.log('\n5️⃣ Vérification des catégories...')
    if (allQuestions) {
      const categories = {}
      allQuestions.forEach(q => {
        if (!categories[q.category]) {
          categories[q.category] = 0
        }
        categories[q.category]++
      })
      
      const expectedCategories = QUESTIONS_STATS.categories
      
      for (const [cat, expectedCount] of Object.entries(expectedCategories)) {
        const actualCount = categories[cat] || 0
        
        if (actualCount === expectedCount) {
          validations.push(`✅ Catégorie ${cat}: ${actualCount}`)
          console.log(`   ✅ ${cat}: ${actualCount}/${expectedCount}`)
        } else {
          errors.push(`❌ Catégorie ${cat}: ${actualCount} au lieu de ${expectedCount}`)
          console.log(`   ❌ ${cat}: ${actualCount}/${expectedCount}`)
        }
      }
    }

    // 6. Vérification des poids
    console.log('\n6️⃣ Vérification des poids...')
    if (allQuestions) {
      const weights = allQuestions.map(q => q.weight).filter(w => w != null)
      const minWeight = Math.min(...weights)
      const maxWeight = Math.max(...weights)
      const avgWeight = weights.reduce((sum, w) => sum + w, 0) / weights.length
      
      console.log(`   📊 Poids - Min: ${minWeight}, Max: ${maxWeight}, Moyenne: ${avgWeight.toFixed(2)}`)
      
      if (minWeight >= 0.4 && maxWeight <= 2.0) {
        validations.push(`✅ Poids dans les limites (${minWeight}-${maxWeight})`)
      } else {
        warnings.push(`⚠️ Poids hors limites: ${minWeight}-${maxWeight}`)
      }
      
      if (Math.abs(avgWeight - QUESTIONS_STATS.averageWeight) < 0.1) {
        validations.push(`✅ Poids moyen cohérent: ${avgWeight.toFixed(2)}`)
      } else {
        warnings.push(`⚠️ Poids moyen différent: ${avgWeight.toFixed(2)} vs ${QUESTIONS_STATS.averageWeight.toFixed(2)}`)
      }
    }

    // 7. Vérification de l'ordre
    console.log('\n7️⃣ Vérification de l\'ordre des questions...')
    if (allQuestions) {
      const sortedQuestions = [...allQuestions].sort((a, b) => a.order_index - b.order_index)
      let orderErrors = 0
      
      for (let i = 0; i < sortedQuestions.length; i++) {
        if (sortedQuestions[i].order_index !== i + 1) {
          orderErrors++
        }
      }
      
      if (orderErrors === 0) {
        validations.push(`✅ Ordre des questions correct (1-${sortedQuestions.length})`)
        console.log(`   ✅ Ordre des questions correct`)
      } else {
        errors.push(`❌ ${orderErrors} erreurs dans l'ordre des questions`)
        console.log(`   ❌ ${orderErrors} erreurs dans l'ordre`)
      }
    }

    // 8. Test d'algorithme de compatibilité
    console.log('\n8️⃣ Test de l\'algorithme de compatibilité...')
    try {
      // Créer des réponses de test
      const testResponses1 = allQuestions?.slice(0, 10).map(q => ({
        question_id: q.id,
        response: q.category === 'scale' ? 4 : true
      })) || []
      
      const testResponses2 = allQuestions?.slice(0, 10).map(q => ({
        question_id: q.id,
        response: q.category === 'scale' ? 3 : true
      })) || []
      
      // Test API de génération de rapport
      const testReport = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/generate-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          coupleCode: 'TEST_VALIDATION',
          user1Name: 'TestUser1',
          user2Name: 'TestUser2',
          responses1: testResponses1,
          responses2: testResponses2
        })
      })
      
      if (testReport.ok) {
        validations.push('✅ API de compatibilité fonctionnelle')
        console.log('   ✅ Test API de compatibilité réussi')
      } else {
        warnings.push('⚠️ API de compatibilité inaccessible')
        console.log('   ⚠️ Test API de compatibilité échoué')
      }
    } catch (apiError) {
      warnings.push(`⚠️ Test API impossible: ${apiError.message}`)
      console.log(`   ⚠️ Test API impossible: ${apiError.message}`)
    }

    // 9. Rapport final
    console.log('\n' + '='.repeat(50))
    console.log('📋 RAPPORT DE VALIDATION FINAL')
    console.log('='.repeat(50))
    
    console.log(`\n✅ VALIDATIONS RÉUSSIES (${validations.length}):`);
    validations.forEach(v => console.log(`   ${v}`))
    
    if (warnings.length > 0) {
      console.log(`\n⚠️ AVERTISSEMENTS (${warnings.length}):`);
      warnings.forEach(w => console.log(`   ${w}`))
    }
    
    if (errors.length > 0) {
      console.log(`\n❌ ERREURS (${errors.length}):`);
      errors.forEach(e => console.log(`   ${e}`))
    }
    
    // Score de santé
    const totalChecks = validations.length + warnings.length + errors.length
    const healthScore = Math.round((validations.length / totalChecks) * 100)
    
    console.log(`\n📊 SCORE DE SANTÉ: ${healthScore}%`)
    
    if (errors.length === 0) {
      console.log('\n🎉 VALIDATION TERMINÉE AVEC SUCCÈS!')
      console.log('✅ Toutes les vérifications critiques sont passées')
      console.log('🚀 Votre base de données est prête pour la production!')
    } else {
      console.log('\n⚠️ VALIDATION TERMINÉE AVEC DES ERREURS')
      console.log(`❌ ${errors.length} erreur(s) critique(s) détectée(s)`)
      console.log('🔧 Veuillez corriger ces erreurs avant la mise en production')
    }

  } catch (error) {
    console.error('\n❌ ERREUR CRITIQUE DE VALIDATION:', error.message)
    console.log('\n🆘 Actions recommandées:')
    console.log('   1. Vérifiez que la migration a été exécutée')
    console.log('   2. Vérifiez vos variables d\'environnement')
    console.log('   3. Vérifiez la connectivité à Supabase')
    process.exit(1)
  }
}

// Lancer la validation
if (import.meta.url === `file://${process.argv[1]}`) {
  validateQuestions().catch(console.error)
}

export { validateQuestions }