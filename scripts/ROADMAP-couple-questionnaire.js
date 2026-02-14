// ROADMAP: Système de questionnaire couplé pour NikahScore
// 📋 À développer après la configuration auth/email

/*
🎯 PHASE 1: Partage de questionnaire
- Génération de code couple (ex: ABC123)
- Page questionnaire/couple/[code]
- Stockage des réponses liées au code couple

🎯 PHASE 2: Analyse de compatibilité  
- Algorithme de matching des réponses
- Score de compatibilité personnalisé
- Visualisation des différences/similitudes

🎯 PHASE 3: Rapport couple
- PDF de compatibilité à télécharger
- Conseils personnalisés selon les réponses
- Recommandations pour améliorer la relation

🎯 PHASE 4: Features premium
- Analyse approfondie
- Sessions de conseil en ligne
- Suivi de l'évolution du couple
*/

// Structure technique proposée:
const coupleQuestionnaireSchema = {
  couple_questionnaires: {
    id: 'UUID',
    couple_code: 'VARCHAR(10)', // Code de partage unique
    user1_id: 'UUID',
    user2_id: 'UUID', 
    user1_completed: 'BOOLEAN',
    user2_completed: 'BOOLEAN',
    compatibility_score: 'INTEGER', // Score calculé
    analysis_generated: 'BOOLEAN',
    created_at: 'TIMESTAMPTZ'
  },
  
  couple_responses: {
    id: 'UUID',
    couple_id: 'UUID', // Référence vers couple_questionnaires
    user_id: 'UUID',
    question_id: 'VARCHAR',
    response: 'JSONB', // Réponse flexible
    created_at: 'TIMESTAMPTZ'
  }
}

// Pages à créer:
const newPages = [
  'src/app/questionnaire/couple/page.tsx',      // Génération du code couple
  'src/app/questionnaire/couple/[code]/page.tsx', // Questionnaire partagé
  'src/app/results/couple/[code]/page.tsx',       // Résultats couple
  'src/app/api/couple/create/route.ts',           // API création couple
  'src/app/api/couple/analyze/route.ts'           // API analyse compatibilité
]

export default 'ROADMAP_COUPLE_QUESTIONNAIRE'
