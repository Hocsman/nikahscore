// ✅ EXEMPLE D'INTÉGRATION - UserDashboard.tsx
// Fichier: src/components/dashboard/UserDashboard.tsx

// 1️⃣ AJOUTER CES IMPORTS EN HAUT DU FICHIER :
import FeatureGate from '@/components/premium/FeatureGate'

// 2️⃣ REMPLACER LA SECTION EXPORT PDF (lignes 276-289) PAR :

<FeatureGate 
  featureCode="pdf_export"
  customMessage="L'export PDF est limité à 10 par mois pour Premium, illimité pour Conseil"
>
  <Button 
    variant="outline" 
    size="sm" 
    onClick={handleExportPDF}
    disabled={isGeneratingPDF}
  >
    <Download className="w-4 h-4 mr-2" />
    {isGeneratingPDF ? 'Génération...' : 'Export PDF'}
  </Button>
</FeatureGate>

// 3️⃣ LE BOUTON "PASSER PREMIUM" RESTE TEL QUEL (pour les users gratuits)


// ========================================
// ✅ EXEMPLE 2 - results/[pairId]/page.tsx
// ========================================

// 1️⃣ AJOUTER LES IMPORTS :
import FeatureGate from '@/components/premium/FeatureGate'
import { Download } from 'lucide-react'

// 2️⃣ REMPLACER LE BOUTON PDF (lignes 532-541) PAR :

<FeatureGate featureCode="pdf_export">
  <Button
    onClick={handleExportPDF}
    disabled={isExporting}
    className="flex items-center gap-2"
    variant="outline"
  >
    <Download className="h-4 w-4" />
    {isExporting ? 'Génération...' : 'Télécharger le rapport PDF'}
  </Button>
</FeatureGate>


// ========================================
// ✅ EXEMPLE 3 - Bloquer les questions avancées
// ========================================

// Fichier: src/app/questionnaire/page.tsx (à créer/modifier)

import { useFeatureGate } from '@/components/premium/FeatureGate'

function QuestionnairePage() {
  const { isAllowed: canAccessAdvanced } = useFeatureGate('advanced_questions')
  
  const filteredQuestions = questions.filter(q => {
    // Si question avancée ET user n'a pas accès
    if (q.category === 'advanced' && !canAccessAdvanced) {
      return false // Ne pas afficher
    }
    return true
  })
  
  return (
    <div>
      {filteredQuestions.map(question => (
        <QuestionCard key={question.id} question={question} />
      ))}
      
      {!canAccessAdvanced && (
        <div className="mt-8 p-6 bg-purple-50 border border-purple-200 rounded-lg text-center">
          <Crown className="w-12 h-12 mx-auto text-purple-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Questions avancées verrouillées
          </h3>
          <p className="text-gray-600 mb-4">
            Débloquez 50+ questions avancées sur la finance, les projets et le style de vie avec Premium
          </p>
          <Link href="/pricing">
            <Button className="bg-gradient-to-r from-purple-500 to-purple-600">
              Voir les offres Premium
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}


// ========================================
// ✅ EXEMPLE 4 - Limiter la création de questionnaires
// ========================================

// Dans le Dashboard, avant de créer un nouveau questionnaire :

import { useFeatureGate } from '@/components/premium/FeatureGate'
import { useUserStats } from '@/hooks/useUserStats'

function CreateQuestionnaireButton() {
  const { isAllowed } = useFeatureGate('unlimited_questionnaires')
  const { questionnaireCount } = useUserStats()
  
  const handleCreate = () => {
    // Users gratuits : 1 seul questionnaire
    if (!isAllowed && questionnaireCount >= 1) {
      toast.error('Vous avez atteint la limite de questionnaires gratuits')
      // Optionnel : ouvrir automatiquement UpgradePrompt
      return
    }
    
    // Continuer la création
    router.push('/questionnaire/new')
  }
  
  return (
    <Button onClick={handleCreate}>
      Nouveau questionnaire
      {!isAllowed && questionnaireCount >= 1 && (
        <Badge className="ml-2 bg-orange-500">Limite atteinte</Badge>
      )}
    </Button>
  )
}


// ========================================
// ✅ EXEMPLE 5 - Analyses détaillées (results page)
// ========================================

import FeatureGate from '@/components/premium/FeatureGate'

// Dans la page de résultats, wrapper les analyses avancées :

<FeatureGate 
  featureCode="detailed_analysis"
  silent={false} // Affiche le contenu grisé avec badge
>
  <Card>
    <CardHeader>
      <CardTitle>Analyses détaillées</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {detailedAnalysis.map(item => (
          <AnalysisItem key={item.id} data={item} />
        ))}
      </div>
    </CardContent>
  </Card>
</FeatureGate>

// Ou version silencieuse (ne rien afficher) :

{isPremium && (
  <FeatureGate featureCode="detailed_analysis" silent={true}>
    <DetailedAnalysisSection />
  </FeatureGate>
)}


// ========================================
// ✅ RÉSUMÉ DES ACTIONS
// ========================================

/*
  1. ✅ Composants créés (FeatureGate + UpgradePrompt)
  2. ⏳ Intégrer dans UserDashboard.tsx (PDF export)
  3. ⏳ Intégrer dans results/[pairId]/page.tsx (PDF export)
  4. ⏳ Bloquer questions avancées dans questionnaire
  5. ⏳ Limiter création questionnaires (1 pour gratuit)
  6. ⏳ Wrapper analyses détaillées
  7. ⏳ Tester avec 3 types de comptes (gratuit, premium, conseil)
*/
