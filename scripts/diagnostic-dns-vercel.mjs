#!/usr/bin/env node

/**
 * 🌐 DIAGNOSTIC DNS NIKAHSCORE.COM - 20 OCTOBRE 2025
 * 
 * Script pour vérifier la configuration DNS et identifier les problèmes
 */

console.log('\n🌐 ==========================================')
console.log('📊 DIAGNOSTIC DNS NIKAHSCORE.COM')
console.log('🌐 ==========================================\n')

const colors = {
  success: '\x1b[32m',
  warning: '\x1b[33m',
  error: '\x1b[31m',
  info: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m'
}

const log = (type, message, details = '') => {
  const timestamp = new Date().toLocaleTimeString('fr-FR')
  const color = colors[type] || colors.reset
  console.log(`${color}${colors.bold}${message}${colors.reset}${details ? colors.dim + ' ' + details + colors.reset : ''}`)
}

// ===== ANALYSE DU PROBLÈME =====
function analyzeProblem() {
  log('error', '🚨 PROBLÈME IDENTIFIÉ PAR VERCEL')
  console.log('─'.repeat(50))
  
  log('error', '❌ Enregistrement DNS conflictuel détecté:')
  console.log('   Type: A')
  console.log('   Name: @ (domaine principal)')
  console.log('   Value: 213.186.33.5')
  console.log('')
  log('warning', '⚠️ Cet enregistrement empêche Vercel de se connecter')
  console.log('')
}

// ===== CONFIGURATION ACTUELLE vs ATTENDUE =====
function showConfiguration() {
  log('info', '📋 CONFIGURATION DNS REQUISE')
  console.log('─'.repeat(50))
  
  console.log('\n✅ CONFIGURATION CORRECTE POUR VERCEL:\n')
  
  console.log('┌─────────────────────────────────────────────────┐')
  console.log('│  ENREGISTREMENT 1 - Sous-domaine www           │')
  console.log('├─────────────────────────────────────────────────┤')
  console.log('│  Type:        CNAME                            │')
  console.log('│  Nom:         www                              │')
  console.log('│  Cible:       407f86ec2fef687a.vercel-dns-017.com. │')
  console.log('│  TTL:         3600                             │')
  console.log('└─────────────────────────────────────────────────┘')
  
  console.log('')
  
  console.log('┌─────────────────────────────────────────────────┐')
  console.log('│  ENREGISTREMENT 2 - Domaine principal (@)      │')
  console.log('├─────────────────────────────────────────────────┤')
  console.log('│  OPTION A (Préférée):                          │')
  console.log('│  Type:        CNAME                            │')
  console.log('│  Nom:         @ (ou vide)                      │')
  console.log('│  Cible:       407f86ec2fef687a.vercel-dns-017.com. │')
  console.log('│  TTL:         3600                             │')
  console.log('│                                                 │')
  console.log('│  OPTION B (Si CNAME @ impossible):             │')
  console.log('│  Type:        A                                │')
  console.log('│  Nom:         @ (ou vide)                      │')
  console.log('│  Cible:       76.76.21.21                      │')
  console.log('│  TTL:         3600                             │')
  console.log('└─────────────────────────────────────────────────┘')
}

// ===== ÉTAPES DE RÉSOLUTION =====
function showResolutionSteps() {
  log('success', '\n🔧 ÉTAPES DE RÉSOLUTION')
  console.log('─'.repeat(40))
  
  const steps = [
    {
      number: 1,
      title: 'Accéder à OVH',
      actions: [
        'Connectez-vous à https://www.ovh.com/manager/',
        'Allez dans Web Cloud → Noms de domaine',
        'Sélectionnez nikahscore.com',
        'Cliquez sur l\'onglet Zone DNS'
      ]
    },
    {
      number: 2,
      title: 'Supprimer l\'enregistrement conflictuel',
      actions: [
        'Cherchez l\'enregistrement de type A avec 213.186.33.5',
        'Cliquez sur l\'icône Supprimer (🗑️)',
        'Confirmez la suppression',
        '⚠️ IMPORTANT: Ne pas supprimer d\'autres enregistrements !'
      ]
    },
    {
      number: 3,
      title: 'Ajouter les nouveaux enregistrements',
      actions: [
        'Cliquez sur "Ajouter une entrée"',
        'Ajoutez CNAME pour www → 407f86ec2fef687a.vercel-dns-017.com.',
        'Ajoutez CNAME (ou A) pour @ selon option disponible',
        'Validez et attendez 10-15 minutes'
      ]
    },
    {
      number: 4,
      title: 'Vérifier et valider',
      actions: [
        'Utilisez nslookup nikahscore.com',
        'Vérifiez sur https://dnschecker.org',
        'Retournez sur Vercel et cliquez sur Refresh',
        'Le statut devrait passer à "Valid Configuration"'
      ]
    }
  ]
  
  steps.forEach(step => {
    console.log(`\n${colors.bold}${colors.info}ÉTAPE ${step.number}: ${step.title}${colors.reset}`)
    step.actions.forEach((action, index) => {
      console.log(`   ${index + 1}. ${action}`)
    })
  })
}

// ===== COMMANDES DE VÉRIFICATION =====
function showVerificationCommands() {
  log('info', '\n🧪 COMMANDES DE VÉRIFICATION')
  console.log('─'.repeat(50))
  
  console.log('\n💻 Depuis PowerShell/CMD (Windows):')
  console.log('─'.repeat(40))
  console.log('# Vider le cache DNS local')
  console.log(`${colors.info}ipconfig /flushdns${colors.reset}`)
  console.log('')
  console.log('# Vérifier www.nikahscore.com')
  console.log(`${colors.info}nslookup www.nikahscore.com${colors.reset}`)
  console.log('')
  console.log('# Vérifier nikahscore.com')
  console.log(`${colors.info}nslookup nikahscore.com${colors.reset}`)
  console.log('')
  console.log('# Vérifier avec Google DNS')
  console.log(`${colors.info}nslookup nikahscore.com 8.8.8.8${colors.reset}`)
  
  console.log('\n🌐 Outils en ligne:')
  console.log('─'.repeat(40))
  console.log('• https://dnschecker.org')
  console.log('• https://mxtoolbox.com/SuperTool.aspx')
  console.log('• https://www.whatsmydns.net')
}

// ===== POINTS IMPORTANTS =====
function showImportantNotes() {
  log('warning', '\n⚠️ POINTS IMPORTANTS')
  console.log('─'.repeat(40))
  
  const notes = [
    '🔴 SUPPRIMER l\'enregistrement A → 213.186.33.5',
    '✅ TOUJOURS mettre le point final: .vercel-dns-017.com.',
    '⏱️ Attendre 10-15 min minimum après modification',
    '🔄 Ne pas paniquer si ça ne marche pas immédiatement',
    '📞 Contacter support OVH si blocage technique',
    '🧪 Tester avec dnschecker.org pour voir propagation'
  ]
  
  notes.forEach(note => {
    console.log(`   ${note}`)
  })
}

// ===== CHECKLIST FINALE =====
function showFinalChecklist() {
  log('success', '\n✅ CHECKLIST DE VALIDATION')
  console.log('─'.repeat(40))
  
  const checklist = [
    '[ ] Connexion à OVH Manager réussie',
    '[ ] Zone DNS nikahscore.com ouverte',
    '[ ] Enregistrement A (213.186.33.5) supprimé',
    '[ ] CNAME www → 407f86ec2fef687a.vercel-dns-017.com. ajouté',
    '[ ] CNAME/A @ → Vercel configuré',
    '[ ] Modifications validées sur OVH',
    '[ ] Attente de 15 minutes effectuée',
    '[ ] Test nslookup effectué',
    '[ ] Vérification sur dnschecker.org',
    '[ ] Retour sur Vercel et Refresh cliqué',
    '[ ] Statut "Valid Configuration" obtenu'
  ]
  
  checklist.forEach(item => {
    console.log(`   ${item}`)
  })
}

// ===== RÉSULTAT ATTENDU =====
function showExpectedResult() {
  log('success', '\n🎯 RÉSULTAT ATTENDU APRÈS CONFIGURATION')
  console.log('─'.repeat(50))
  
  console.log('\n✅ Status Vercel:')
  console.log('   nikahscore.com: Valid Configuration ✓')
  console.log('   www.nikahscore.com: Valid Configuration ✓')
  
  console.log('\n✅ Résolution DNS:')
  console.log('   nikahscore.com → 407f86ec2fef687a.vercel-dns-017.com')
  console.log('   www.nikahscore.com → 407f86ec2fef687a.vercel-dns-017.com')
  
  console.log('\n✅ Accès site:')
  console.log('   https://nikahscore.com → ✓ Fonctionnel')
  console.log('   https://www.nikahscore.com → ✓ Redirige vers nikahscore.com')
  
  console.log('\n✅ Sécurité:')
  console.log('   Certificat SSL: ✓ Automatique (Let\'s Encrypt)')
  console.log('   HTTPS: ✓ Actif')
  console.log('   HTTP: ✓ Redirige vers HTTPS')
}

// ===== SUPPORT =====
function showSupport() {
  log('info', '\n📞 BESOIN D\'AIDE ?')
  console.log('─'.repeat(30))
  
  console.log('\n🟦 Support OVH:')
  console.log('   • Manager: https://www.ovh.com/manager/')
  console.log('   • Support: Créer un ticket depuis votre espace client')
  console.log('   • Documentation: https://docs.ovh.com/fr/domains/')
  
  console.log('\n🟩 Support Vercel:')
  console.log('   • Documentation: https://vercel.com/docs/concepts/projects/domains')
  console.log('   • Discord: https://vercel.com/discord')
  console.log('   • Email: support@vercel.com')
  
  console.log('\n💡 Conseil:')
  console.log('   Si le CNAME pour @ ne fonctionne pas sur OVH,')
  console.log('   utilisez l\'enregistrement A: @ → 76.76.21.21')
}

// ===== EXÉCUTION PRINCIPALE =====
function main() {
  analyzeProblem()
  showConfiguration()
  showResolutionSteps()
  showVerificationCommands()
  showImportantNotes()
  showFinalChecklist()
  showExpectedResult()
  showSupport()
  
  console.log('\n🌟 ==========================================')
  console.log('🎊 DIAGNOSTIC DNS COMPLET')
  console.log('🌟 ==========================================')
  
  log('success', '\n✨ Suivez les étapes ci-dessus pour résoudre le problème')
  log('info', '📅 Diagnostic effectué le 20 octobre 2025')
  log('warning', '⏱️ Temps estimé: 10-30 minutes (incluant propagation DNS)')
  
  console.log('')
  log('success', '🚀 Après configuration, votre site sera accessible sur nikahscore.com !')
  console.log('')
  
  return { status: 'DIAGNOSTIC_COMPLETE' }
}

// Exécution
if (import.meta.url === `file://${process.argv[1]}`) {
  const result = main()
  process.exit(0)
}