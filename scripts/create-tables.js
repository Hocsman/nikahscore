// Script pour créer les tables manquantes dans Supabase
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vhwdgjzjxrcglbmnjzot.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJiss3MiOiJzdXBhYmFzZSIsInJlZiI6InZod2RnanpqeHJjZ2xibW5qem90Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTA3ODU4NCwiZXhwIjoyMDcwNjU0NTg0fQ.QXM43DeeVqwtbYdFvd1xtwM3__WdHtzmS4jE_4NIui4';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTables() {
  console.log('🔧 Création des tables couples et responses...');
  
  try {
    // Essayer de créer la table couples via une requête SQL brute
    const couplesSql = `
      CREATE TABLE IF NOT EXISTS couples (
          id BIGSERIAL PRIMARY KEY,
          pair_id UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
          invite_token UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
          
          initiator_email VARCHAR(255) NOT NULL,
          partner_email VARCHAR(255) NOT NULL,
          initiator_name VARCHAR(100),
          partner_name VARCHAR(100),
          
          status VARCHAR(20) DEFAULT 'pending',
          initiator_completed BOOLEAN DEFAULT FALSE,
          partner_completed BOOLEAN DEFAULT FALSE,
          
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '7 days',
          completed_at TIMESTAMP WITH TIME ZONE,
          
          compatibility_score INTEGER,
          report_generated BOOLEAN DEFAULT FALSE,
          payment_status VARCHAR(20) DEFAULT 'pending'
      );
    `;
    
    const responsesSql = `
      CREATE TABLE IF NOT EXISTS responses (
          id BIGSERIAL PRIMARY KEY,
          pair_id UUID NOT NULL,
          question_id BIGINT NOT NULL,
          
          respondent VARCHAR(20) NOT NULL,
          
          answer_value INTEGER,
          answer_boolean BOOLEAN,
          
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          
          UNIQUE(pair_id, question_id, respondent)
      );
    `;
    
    // Pour Supabase, on va créer les tables en insérant des données factices puis les supprimer
    // C'est un hack car Supabase ne permet pas CREATE TABLE via l'API standard
    
    console.log('📋 Tentative création table couples...');
    try {
      // Insérer un enregistrement test pour forcer la création de la table
      const testCouple = {
        pair_id: '00000000-0000-0000-0000-000000000000',
        initiator_email: 'test@init.com',
        partner_email: 'test@partner.com',
        status: 'pending'
      };
      
      const { data, error } = await supabase
        .from('couples')
        .insert(testCouple)
        .select();
      
      if (error) {
        if (error.message.includes('does not exist')) {
          console.log('❌ Impossible de créer la table couples via l\'API');
          console.log('🔧 Vous devez créer les tables manuellement dans Supabase');
          console.log('\n📋 SQL à exécuter dans l\'éditeur SQL Supabase:');
          console.log('\n-- Table couples:');
          console.log(couplesSql);
          console.log('\n-- Table responses:');  
          console.log(responsesSql);
          return false;
        } else {
          console.log('⚠️  Erreur création couples:', error.message);
        }
      } else {
        console.log('✅ Table couples créée/existe');
        
        // Supprimer l'enregistrement test
        await supabase
          .from('couples')
          .delete()
          .eq('pair_id', '00000000-0000-0000-0000-000000000000');
      }
    } catch (couplesError) {
      console.log('❌ Erreur table couples:', couplesError.message);
    }
    
    console.log('📋 Tentative création table responses...');
    try {
      // Test création table responses
      const testResponse = {
        pair_id: '00000000-0000-0000-0000-000000000000',
        question_id: 1,
        respondent: 'initiator',
        answer_value: 3
      };
      
      const { data: respData, error: respError } = await supabase
        .from('responses')
        .insert(testResponse)
        .select();
      
      if (respError) {
        if (respError.message.includes('does not exist')) {
          console.log('❌ Impossible de créer la table responses via l\'API');
        } else {
          console.log('⚠️  Erreur création responses:', respError.message);
        }
      } else {
        console.log('✅ Table responses créée/existe');
        
        // Supprimer l'enregistrement test
        await supabase
          .from('responses')
          .delete()
          .eq('pair_id', '00000000-0000-0000-0000-000000000000');
      }
    } catch (responsesError) {
      console.log('❌ Erreur table responses:', responsesError.message);
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
    return false;
  }
}

async function testApi() {
  console.log('\n🧪 Test de l\'API answers/save...');
  
  try {
    const testData = {
      pairId: 'test123',
      respondent: 'A',
      answers: [
        { questionId: 1, value: true },
        { questionId: 2, value: 4 }
      ]
    };
    
    // Simuler un appel API
    const response = await fetch('http://localhost:3000/api/answers/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ API answers/save fonctionne:', result);
    } else {
      console.log('❌ Erreur API:', result);
    }
    
  } catch (error) {
    console.error('❌ Erreur test API:', error.message);
  }
}

async function main() {
  console.log('🚀 Configuration des tables Supabase\n');
  
  const tablesCreated = await createTables();
  
  if (tablesCreated) {
    await testApi();
  }
  
  console.log('\n🎉 Configuration terminée !');
  console.log('\n📋 Si les tables n\'ont pas pu être créées automatiquement:');
  console.log('   1. Allez dans Supabase Dashboard > SQL Editor');
  console.log('   2. Exécutez les requêtes SQL affichées ci-dessus');
  console.log('   3. Relancez ce script pour tester l\'API');
}

main().catch(console.error);
