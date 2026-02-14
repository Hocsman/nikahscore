require('dotenv').config({ path: '.env.local' })

console.log('🚀 Déploiement du système de questionnaire couple\n')

console.log('📋 INSTRUCTIONS DE DÉPLOIEMENT MANUEL:')
console.log('==========================================')
console.log()
console.log('1. 🌐 Ouvrez votre dashboard Supabase:')
console.log('   https://supabase.com/dashboard/project/[YOUR_PROJECT_ID]')
console.log()
console.log('2. 📝 Allez dans "SQL Editor" (menu de gauche)')
console.log()
console.log('3. ✨ Créez une nouvelle requête et copiez-collez ce SQL:')
console.log('   👉 Utilisez le fichier: couple-system-simple.sql')
console.log()
console.log('4. ▶️  Cliquez sur "Run" pour exécuter')
console.log()
console.log('5. ✅ Vérifiez que vous voyez les messages de succès')
console.log()

console.log('📁 FICHIERS DISPONIBLES:')
console.log('========================')
console.log('• couple-system-simple.sql  → Version optimisée pour Supabase SQL Editor')
console.log('• couple-system-clean.sql   → Version complète avec toutes les options')
console.log()

console.log('🔧 APRÈS LE DÉPLOIEMENT:')
console.log('========================')
console.log('• Vérifiez les tables: couple_questionnaires, couple_responses')
console.log('• Testez la fonction: SELECT generate_couple_code();')
console.log('• Vérifiez les politiques RLS dans Authentication > Policies')
console.log()

console.log('🌟 PRÊT À TESTER:')
console.log('================')
console.log('• Lancez: npm run dev')
console.log('• Visitez: http://localhost:3000/couple')
console.log('• Créez votre premier questionnaire couple!')
console.log()

console.log('💡 CONTENU DU FICHIER SIMPLE:')
console.log('=============================')
const fs = require('fs')
const path = require('path')

try {
  const sqlContent = fs.readFileSync(path.join(__dirname, 'couple-system-simple.sql'), 'utf8')
  console.log(sqlContent)
} catch (error) {
  console.log('❌ Erreur lecture fichier SQL:', error.message)
  console.log('📄 Utilisez couple-system-clean.sql à la place')
}
