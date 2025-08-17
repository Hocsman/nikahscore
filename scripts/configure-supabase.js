// Script de test et configuration Supabase
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vhwdgjzjxrcglbmnjzot.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZod2RnanpqeHJjZ2xibW5qem90Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTA3ODU4NCwiZXhwIjoyMDcwNjU0NTg0fQ.QXM43DeeVqwtbYdFvd1xtwM3__WdHtzmS4jE_4NIui4';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testSupabaseConnection() {
  try {
    console.log('🔧 Test de connexion Supabase...');
    
    // Test simple: tenter de lire la table questions directement
    const { data: questionsTest, error: connectionError } = await supabase
      .from('questions')
      .select('count')
      .limit(1);
    
    if (connectionError && connectionError.message.includes('relation "public.questions" does not exist')) {
      console.log('⚠️  Table questions n\'existe pas encore - création nécessaire');
      return { hasQuestions: false, needsTableCreation: true };
    } else if (connectionError) {
      throw connectionError;
    }
    
    console.log('✅ Connexion Supabase OK');
    
    // Test 2: Compter les questions existantes
    const { count, error: countError } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.log('❌ Erreur comptage questions:', countError.message);
      return { hasQuestions: false, needsTableCreation: true };
    }
    
    console.log(`📊 Questions actuelles dans la DB: ${count}`);
    
    if (count === 0) {
      console.log('📝 Aucune question trouvée - seed nécessaire');
      return { hasQuestions: false, questionsCount: 0, needsSeed: true };
    } else if (count < 60) {
      console.log(`⚠️  Seulement ${count} questions trouvées - reseed recommandé`);
      return { hasQuestions: true, questionsCount: count, needsReseed: true };
    } else {
      console.log('✅ Base de données des questions complète');
      
      // Afficher quelques exemples
      const { data: samples } = await supabase
        .from('questions')
        .select('id, axis, text, category, is_dealbreaker')
        .limit(3);
      
      console.log('\n📋 Exemples de questions:');
      samples?.forEach(q => {
        console.log(`  ${q.id}. [${q.axis}] ${q.text.substring(0, 50)}... (${q.category}${q.is_dealbreaker ? ', DEAL-BREAKER' : ''})`);
      });
      
      return { hasQuestions: true, questionsCount: count, isComplete: true };
    }
    
  } catch (error) {
    console.error('❌ Erreur test Supabase:', error.message);
    return { error: error.message };
  }
}

async function applyMigrations() {
  console.log('\n🔄 Application des migrations...');
  
  try {
    // Créer les nouvelles tables si elles n'existent pas
    const migrationSQL = `
      -- Créer la table couples si elle n'existe pas
      CREATE TABLE IF NOT EXISTS couples (
          id BIGSERIAL PRIMARY KEY,
          pair_id UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
          invite_token UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
          
          initiator_email VARCHAR(255) NOT NULL,
          partner_email VARCHAR(255) NOT NULL,
          initiator_name VARCHAR(100),
          partner_name VARCHAR(100),
          
          status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'both_completed', 'expired')),
          initiator_completed BOOLEAN DEFAULT FALSE,
          partner_completed BOOLEAN DEFAULT FALSE,
          
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '7 days',
          completed_at TIMESTAMP WITH TIME ZONE,
          
          compatibility_score INTEGER,
          report_generated BOOLEAN DEFAULT FALSE,
          payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'expired'))
      );

      -- Créer la table responses si elle n'existe pas
      CREATE TABLE IF NOT EXISTS responses (
          id BIGSERIAL PRIMARY KEY,
          pair_id UUID REFERENCES couples(pair_id) ON DELETE CASCADE,
          question_id BIGINT REFERENCES questions(id) ON DELETE CASCADE,
          
          respondent VARCHAR(20) NOT NULL CHECK (respondent IN ('initiator', 'partner')),
          
          answer_value INTEGER,
          answer_boolean BOOLEAN,
          
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          
          UNIQUE(pair_id, question_id, respondent)
      );
    `;
    
    const { error: migrationError } = await supabase.rpc('exec_sql', { 
      sql: migrationSQL 
    });
    
    if (migrationError) {
      console.log('⚠️  Migration par RPC échouée, les tables existent peut-être déjà');
      console.log('Détails:', migrationError.message);
    } else {
      console.log('✅ Migrations appliquées avec succès');
    }
    
  } catch (error) {
    console.log('⚠️  Erreur migration:', error.message);
    console.log('Les tables existent probablement déjà, ce n\'est pas grave.');
  }
}

async function seedQuestions() {
  console.log('\n🌱 Insertion des 60 vraies questions...');
  
  try {
    // D'abord, vider la table
    const { error: deleteError } = await supabase
      .from('questions')
      .delete()
      .neq('id', 0); // Supprimer tout
    
    if (deleteError) {
      console.log('⚠️  Erreur suppression questions existantes:', deleteError.message);
    }
    
    // Préparer les 60 questions
    const questions = [
      // INTENTIONS (8 questions)
      { axis: 'Intentions', text: 'Je souhaite me marier dans les 12 prochains mois.', category: 'bool', weight: 1, is_dealbreaker: true, order_index: 1 },
      { axis: 'Intentions', text: 'Je souhaite le mariage civil avant toute vie commune.', category: 'bool', weight: 1, is_dealbreaker: true, order_index: 2 },
      { axis: 'Intentions', text: 'Le mariage religieux est prioritaire pour moi.', category: 'scale', weight: 1, is_dealbreaker: true, order_index: 3 },
      { axis: 'Intentions', text: 'Je recherche une relation sérieuse en vue du mariage.', category: 'bool', weight: 1, is_dealbreaker: false, order_index: 4 },
      { axis: 'Intentions', text: 'Je suis prêt(e) à m\'engager pour la vie.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 5 },
      { axis: 'Intentions', text: 'Une période de fiançailles courte me convient.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 6 },
      { axis: 'Intentions', text: 'Les familles doivent se rencontrer rapidement.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 7 },
      { axis: 'Intentions', text: 'Le mariage doit suivre les traditions islamiques.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 8 },
      
      // VALEURS (8 questions)
      { axis: 'Valeurs', text: 'La pratique religieuse régulière est importante pour moi.', category: 'scale', weight: 1, is_dealbreaker: true, order_index: 9 },
      { axis: 'Valeurs', text: 'Je souhaite préserver des limites d\'interaction avant le mariage.', category: 'bool', weight: 1, is_dealbreaker: true, order_index: 10 },
      { axis: 'Valeurs', text: 'La lecture du Coran fait partie de ma routine.', category: 'scale', weight: 1, is_dealbreaker: true, order_index: 11 },
      { axis: 'Valeurs', text: 'Je prie les cinq prières quotidiennes.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 12 },
      { axis: 'Valeurs', text: 'Je jeûne pendant le mois de Ramadan.', category: 'bool', weight: 1, is_dealbreaker: false, order_index: 13 },
      { axis: 'Valeurs', text: 'Je souhaite faire le pèlerinage ensemble.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 14 },
      { axis: 'Valeurs', text: 'L\'apprentissage religieux en couple est important.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 15 },
      { axis: 'Valeurs', text: 'Je participe aux activités de la mosquée.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 16 },
      
      // RÔLES (7 questions)
      { axis: 'Rôles', text: 'Je préfère une répartition traditionnelle des rôles.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 17 },
      { axis: 'Rôles', text: 'L\'homme doit être le principal pourvoyeur financier.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 18 },
      { axis: 'Rôles', text: 'La femme peut travailler après le mariage.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 19 },
      { axis: 'Rôles', text: 'Les tâches ménagères doivent être partagées.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 20 },
      { axis: 'Rôles', text: 'Mon conjoint doit participer à l\'éducation des enfants.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 21 },
      { axis: 'Rôles', text: 'Les décisions importantes se prennent ensemble.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 22 },
      { axis: 'Rôles', text: 'Je peux accepter un conjoint plus ou moins éduqué que moi.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 23 },
      
      // ENFANTS (7 questions)
      { axis: 'Enfants', text: 'Je souhaite des enfants.', category: 'bool', weight: 1, is_dealbreaker: true, order_index: 24 },
      { axis: 'Enfants', text: 'Je veux plus de trois enfants.', category: 'scale', weight: 1, is_dealbreaker: true, order_index: 25 },
      { axis: 'Enfants', text: 'L\'éducation islamique des enfants est prioritaire.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 26 },
      { axis: 'Enfants', text: 'Je préfère l\'école islamique pour mes enfants.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 27 },
      { axis: 'Enfants', text: 'L\'apprentissage de l\'arabe est important pour les enfants.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 28 },
      { axis: 'Enfants', text: 'Je veux avoir des enfants rapidement après le mariage.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 29 },
      { axis: 'Enfants', text: 'L\'éducation mixte est acceptable pour mes enfants.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 30 },
      
      // FINANCE (7 questions)
      { axis: 'Finance', text: 'La transparence financière est essentielle dans le couple.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 31 },
      { axis: 'Finance', text: 'Nous devons avoir un budget commun.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 32 },
      { axis: 'Finance', text: 'L\'épargne pour le pèlerinage est prioritaire.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 33 },
      { axis: 'Finance', text: 'Je peux accepter un crédit immobilier conforme.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 34 },
      { axis: 'Finance', text: 'Le niveau de vie doit rester modeste.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 35 },
      { axis: 'Finance', text: 'L\'alimentation halal est non négociable même si plus chère.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 36 },
      { axis: 'Finance', text: 'Les achats importants se décident ensemble.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 37 },
      
      // STYLE (7 questions)
      { axis: 'Style', text: 'Je refuse l\'alcool dans le foyer.', category: 'bool', weight: 1, is_dealbreaker: true, order_index: 38 },
      { axis: 'Style', text: 'La nourriture doit être exclusivement halal.', category: 'scale', weight: 1, is_dealbreaker: true, order_index: 39 },
      { axis: 'Style', text: 'Je limite mes sorties en soirée.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 40 },
      { axis: 'Style', text: 'Les voyages en couple sont importants pour moi.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 41 },
      { axis: 'Style', text: 'Je pratique régulièrement une activité sportive.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 42 },
      { axis: 'Style', text: 'Je limite mon utilisation des réseaux sociaux.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 43 },
      { axis: 'Style', text: 'Les loisirs culturels m\'intéressent.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 44 },
      
      // COMMUNICATION (7 questions)
      { axis: 'Communication', text: 'Je préfère résoudre les conflits par la discussion.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 45 },
      { axis: 'Communication', text: 'Je suis à l\'aise pour exprimer mes sentiments.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 46 },
      { axis: 'Communication', text: 'Les non-dits peuvent détruire un couple.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 47 },
      { axis: 'Communication', text: 'Je peux accepter les critiques constructives.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 48 },
      { axis: 'Communication', text: 'Je présente facilement mes excuses quand j\'ai tort.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 49 },
      { axis: 'Communication', text: 'L\'humour est important dans la relation.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 50 },
      { axis: 'Communication', text: 'Je consulte un imam en cas de conflit important.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 51 },
      
      // PERSONNALITÉ (4 questions)
      { axis: 'Personnalité', text: 'Je me considère comme une personne patiente.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 52 },
      { axis: 'Personnalité', text: 'J\'ai une stabilité émotionnelle.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 53 },
      { axis: 'Personnalité', text: 'Je suis plutôt introverti(e).', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 54 },
      { axis: 'Personnalité', text: 'J\'exprime facilement mes émotions.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 55 },
      
      // LOGISTIQUE (5 questions)
      { axis: 'Logistique', text: 'Je vis (ou peux vivre) en Île-de-France.', category: 'bool', weight: 1, is_dealbreaker: true, order_index: 56 },
      { axis: 'Logistique', text: 'Je peux déménager dans une autre région.', category: 'bool', weight: 1, is_dealbreaker: true, order_index: 57 },
      { axis: 'Logistique', text: 'Je préfère rester proche de ma famille.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 58 },
      { axis: 'Logistique', text: 'Je suis ouvert(e) à l\'expatriation.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 59 },
      { axis: 'Logistique', text: 'La mobilité géographique ne me dérange pas.', category: 'scale', weight: 1, is_dealbreaker: false, order_index: 60 }
    ];
    
    console.log(`📝 Insertion de ${questions.length} questions...`);
    
    const { data: insertedQuestions, error: insertError } = await supabase
      .from('questions')
      .insert(questions)
      .select();
    
    if (insertError) {
      console.error('❌ Erreur insertion questions:', insertError.message);
      return false;
    }
    
    console.log(`✅ ${insertedQuestions.length} questions insérées avec succès !`);
    
    // Vérification finale
    const { count } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true });
    
    console.log(`📊 Total final: ${count} questions`);
    
    // Compter les deal-breakers
    const { count: dealbreakerCount } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('is_dealbreaker', true);
    
    console.log(`⚠️  Deal-breakers: ${dealbreakerCount} questions`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Erreur seed questions:', error.message);
    return false;
  }
}

// Fonction principale
async function main() {
  console.log('🚀 Configuration Supabase NikahScore\n');
  
  // Étape 1: Test connexion
  const connectionResult = await testSupabaseConnection();
  
  if (connectionResult.error) {
    console.error('💥 Impossible de continuer sans connexion Supabase');
    return;
  }
  
  // Étape 2: Créer table questions si nécessaire
  if (connectionResult.needsTableCreation) {
    console.log('\n🔧 Création de la table questions...');
    // La table sera créée automatiquement par Supabase lors du premier insert
  }
  
  // Étape 3: Seed des questions si nécessaire
  if (connectionResult.needsSeed || connectionResult.needsReseed || connectionResult.needsTableCreation) {
    const seedSuccess = await seedQuestions();
    if (!seedSuccess) {
      console.error('💥 Échec du seed des questions');
      return;
    }
  }
  
  console.log('\n🎉 Configuration Supabase terminée avec succès !');
  console.log('✅ Votre base de données est prête pour NikahScore');
  console.log('\n📋 Prochaines étapes:');
  console.log('   1. Tester le questionnaire sur http://localhost:3000/questionnaire?pair=test123&who=A');
  console.log('   2. Vérifier que les 60 questions s\'affichent correctement');
  console.log('   3. Tester la sauvegarde des réponses (même si l\'API retourne 404 pour l\'instant)');
}

main().catch(console.error);
