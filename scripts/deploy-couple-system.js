const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes')
  console.log('Vérifiez NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function deployCoupleSystem() {
  console.log('🚀 Déploiement du système de questionnaire couple...\n')

  try {
    // Lire le fichier SQL
    const sqlContent = fs.readFileSync(path.join(__dirname, 'couple-system-clean.sql'), 'utf8')
    
    // Diviser en statements individuels (séparés par ;)
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    console.log(`📄 ${statements.length} instructions SQL à exécuter\n`)

    // Exécuter chaque statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      
      if (statement.includes('SELECT') && statement.includes('status')) {
        // C'est un message de confirmation, on l'affiche
        const { data, error } = await supabase.rpc('query', { 
          query_text: statement 
        }).single()
        
        if (data) {
          console.log(`✅ ${data.status}`)
        }
        continue
      }

      try {
        console.log(`⏳ Exécution: ${statement.substring(0, 50).replace(/\n/g, ' ')}...`)
        
        // Utiliser la fonction query pour exécuter du SQL brut
        const { error } = await supabase.rpc('query', { 
          query_text: statement 
        })
        
        if (error) {
          console.log(`⚠️  Erreur (possiblement normale): ${error.message}`)
        } else {
          console.log(`✅ Succès`)
        }
      } catch (err) {
        console.log(`⚠️  Exception: ${err.message}`)
      }
    }

    // Vérifier que les tables ont été créées
    console.log('\n🔍 Vérification des tables créées...')
    
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['couple_questionnaires', 'couple_responses'])

    if (tableError) {
      console.log('❌ Erreur lors de la vérification des tables:', tableError.message)
    } else {
      console.log(`✅ Tables trouvées: ${tables.map(t => t.table_name).join(', ')}`)
    }

    console.log('\n🎉 Déploiement du système couple terminé !')
    console.log('Vous pouvez maintenant:')
    console.log('1. Tester la création de questionnaires couple')
    console.log('2. Vérifier les permissions RLS dans Supabase')
    console.log('3. Lancer le serveur de développement')

  } catch (error) {
    console.error('❌ Erreur lors du déploiement:', error.message)
    process.exit(1)
  }
}

// Alternative plus simple : instructions manuelles
function showManualInstructions() {
  console.log('📋 Instructions de déploiement manuel:')
  console.log('1. Ouvrez https://supabase.com/dashboard')
  console.log('2. Sélectionnez votre projet NikahScore')
  console.log('3. Allez dans "SQL Editor"')
  console.log('4. Copiez-collez le contenu de couple-system-clean.sql')
  console.log('5. Cliquez sur "Run"')
  console.log('\nOu utilisez cette commande si vous avez psql:')
  console.log('psql "postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DB]" -f couple-system-clean.sql')
}

// Vérifier si on peut se connecter à Supabase
supabase.from('profiles').select('count').limit(1).then(({ error }) => {
  if (error) {
    console.log('❌ Connexion Supabase impossible, utilisation manuelle requise\n')
    showManualInstructions()
  } else {
    console.log('✅ Connexion Supabase OK, déploiement automatique...\n')
    deployCoupleSystem()
  }
}).catch(() => {
  console.log('❌ Connexion Supabase impossible, utilisation manuelle requise\n')
  showManualInstructions()
})
