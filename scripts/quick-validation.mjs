#!/usr/bin/env node

/**
 * Validation simplifiée de la migration
 */

import { createClient } from '@supabase/supabase-js'
import { QUESTIONS_STATS } from './personality-questions-data.mjs'
import './load-env.mjs'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

async function quickValidation() {
  console.log('🔍 VALIDATION RAPIDE POST-MIGRATION')
  console.log('=' .repeat(40))
  
  try {
    // 1. Nombre total
    const { data: allQuestions, error } = await supabase
      .from('questions')
      .select('*')
    
    if (error) {
      throw new Error(`Erreur lecture: ${error.message}`)
    }

    console.log(`✅ Nombre total: ${allQuestions?.length || 0}/100`)
    
    if (!allQuestions || allQuestions.length !== 100) {
      console.error(`❌ Nombre incorrect: ${allQuestions?.length || 0} au lieu de 100`)
      return false
    }

    // 2. Dimensions
    const dimensions = {}
    allQuestions.forEach(q => {
      dimensions[q.axis] = (dimensions[q.axis] || 0) + 1
    })
    
    console.log('\n📊 Distribution par dimension:')
    let dimensionOK = true
    Object.entries(QUESTIONS_STATS.dimensions).forEach(([dim, expected]) => {
      const actual = dimensions[dim] || 0
      const status = actual === expected ? '✅' : '❌'
      console.log(`   ${status} ${dim}: ${actual}/${expected}`)
      if (actual !== expected) dimensionOK = false
    })

    // 3. Deal-breakers
    const dealbreakers = allQuestions.filter(q => q.is_dealbreaker).length
    const expectedDealbreakers = QUESTIONS_STATS.dealbreakers
    const dealbreakerOK = dealbreakers === expectedDealbreakers
    
    console.log(`\n${dealbreakerOK ? '✅' : '❌'} Deal-breakers: ${dealbreakers}/${expectedDealbreakers}`)

    // 4. Catégories
    const categories = {}
    allQuestions.forEach(q => {
      categories[q.category] = (categories[q.category] || 0) + 1
    })
    
    console.log('\n📋 Catégories:')
    let categoryOK = true
    Object.entries(QUESTIONS_STATS.categories).forEach(([cat, expected]) => {
      const actual = categories[cat] || 0
      const status = actual === expected ? '✅' : '❌'
      console.log(`   ${status} ${cat}: ${actual}/${expected}`)
      if (actual !== expected) categoryOK = false
    })

    // 5. Ordre
    const sortedQuestions = [...allQuestions].sort((a, b) => a.order_index - b.order_index)
    let orderOK = true
    for (let i = 0; i < sortedQuestions.length; i++) {
      if (sortedQuestions[i].order_index !== i + 1) {
        orderOK = false
        break
      }
    }
    
    console.log(`\n${orderOK ? '✅' : '❌'} Ordre des questions: ${orderOK ? 'Correct' : 'Incorrect'}`)

    // Résultat final
    const allChecksOK = allQuestions.length === 100 && dimensionOK && dealbreakerOK && categoryOK && orderOK
    
    console.log('\n' + '='.repeat(40))
    if (allChecksOK) {
      console.log('🎉 VALIDATION RÉUSSIE!')
      console.log('✅ Toutes les vérifications sont passées')
      console.log('🚀 Base de données prête pour la production')
    } else {
      console.log('⚠️ VALIDATION PARTIELLEMENT RÉUSSIE')
      console.log('❌ Certaines vérifications ont échoué')
    }

    return allChecksOK

  } catch (error) {
    console.error('❌ Erreur de validation:', error.message)
    return false
  }
}

quickValidation().catch(console.error)