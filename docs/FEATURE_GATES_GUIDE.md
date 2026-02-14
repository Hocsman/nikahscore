# 🔒 Guide d'Utilisation des Feature Gates

## Vue d'ensemble

Le système de **Feature Gates** permet de bloquer l'accès aux fonctionnalités premium et d'inviter les utilisateurs à upgrader leur plan.

## Composants créés

### 1. `FeatureGate.tsx`
Composant wrapper qui vérifie les permissions d'accès.

### 2. `UpgradePrompt.tsx`
Modal qui affiche les avantages du plan premium et invite à upgrader.

---

## 🎯 Utilisation de base

### Exemple 1 : Bloquer un bouton

```tsx
import FeatureGate from '@/components/premium/FeatureGate'
import { Button } from '@/components/ui/button'

function MyComponent() {
  return (
    <FeatureGate featureCode="pdf_export">
      <Button onClick={handleExportPDF}>
        Exporter en PDF
      </Button>
    </FeatureGate>
  )
}
```

**Comportement** :
- ✅ Si l'utilisateur a accès : le bouton est cliquable
- ❌ Si l'utilisateur n'a pas accès : le bouton est grisé avec un badge "🔒 Premium"
- 👆 Cliquer dessus ouvre la modal `UpgradePrompt`

---

### Exemple 2 : Bloquer une section complète

```tsx
<FeatureGate featureCode="detailed_analysis" silent={false}>
  <div className="advanced-stats">
    <h3>Analyses détaillées</h3>
    <Chart data={detailedData} />
  </div>
</FeatureGate>
```

---

### Exemple 3 : Vérification programmatique (sans UI)

```tsx
import { useFeatureGate } from '@/components/premium/FeatureGate'

function MyComponent() {
  const { isAllowed, remaining } = useFeatureGate('pdf_export')
  
  const handleClick = () => {
    if (!isAllowed) {
      toast.error('Cette fonctionnalité est réservée aux membres Premium')
      return
    }
    
    // Logique pour les utilisateurs autorisés
    exportPDF()
  }
  
  return (
    <div>
      {isAllowed && <p>PDF restants : {remaining}/10</p>}
      <button onClick={handleClick}>Export</button>
    </div>
  )
}
```

---

## 📋 Liste des FeatureCodes disponibles

```typescript
type FeatureCode =
  | 'basic_questionnaire'          // Gratuit
  | 'unlimited_questionnaires'     // Premium+
  | 'advanced_questions'           // Premium+
  | 'basic_results'                // Gratuit
  | 'detailed_analysis'            // Premium+
  | 'ai_recommendations'           // Premium+
  | 'compatibility_trends'         // Conseil uniquement
  | 'pdf_export'                   // Premium (limite 10/mois), Conseil (illimité)
  | 'share_results'                // Gratuit
  | 'custom_branding'              // Conseil uniquement
  | 'email_support'                // Gratuit
  | 'priority_support'             // Premium+
  | 'dedicated_support'            // Conseil uniquement
  | 'basic_achievements'           // Gratuit
  | 'all_achievements'             // Premium+
  | 'leaderboard'                  // Conseil uniquement
  | 'couple_mode'                  // Premium+
  | 'couple_insights'              // Premium+
  | 'compatibility_tracking'       // Premium+
```

---

## 🎨 Props de `FeatureGate`

| Prop | Type | Obligatoire | Description |
|------|------|-------------|-------------|
| `featureCode` | `FeatureCode` | ✅ | Code de la feature à vérifier |
| `children` | `ReactNode` | ✅ | Contenu à afficher si accès autorisé |
| `fallback` | `ReactNode` | ❌ | Contenu alternatif (au lieu d'UpgradePrompt) |
| `silent` | `boolean` | ❌ | Si true, retourne null au lieu d'afficher le prompt |
| `customMessage` | `string` | ❌ | Message personnalisé pour le prompt |

---

## 📍 Où ajouter les gates

### ✅ À faire immédiatement

1. **Export PDF** (UserDashboard.tsx + results/page.tsx)
   ```tsx
   <FeatureGate featureCode="pdf_export">
     <Button onClick={handleExportPDF}>Export PDF</Button>
   </FeatureGate>
   ```

2. **Questions avancées** (questionnaire/page.tsx)
   ```tsx
   {question.category === 'advanced' && (
     <FeatureGate featureCode="advanced_questions">
       <QuestionCard question={question} />
     </FeatureGate>
   )}
   ```

3. **Analyses détaillées** (results/page.tsx)
   ```tsx
   <FeatureGate featureCode="detailed_analysis">
     <DetailedInsightsSection data={analysis} />
   </FeatureGate>
   ```

4. **Création questionnaires supplémentaires** (dashboard)
   ```tsx
   const { isAllowed } = useFeatureGate('unlimited_questionnaires')
   
   if (!isAllowed && questionnaireCount >= 1) {
     return <UpgradePrompt ... />
   }
   ```

---

## 🧪 Tests

### Test 1 : Utilisateur Gratuit
- Doit voir les badges "🔒 Premium" sur PDF export
- Modal s'ouvre au clic
- Ne peut pas accéder aux questions avancées

### Test 2 : Utilisateur Premium  
- Peut exporter 10 PDF/mois
- Accès aux questions avancées
- Voit "⚠️ Limite atteinte" après 10 exports

### Test 3 : Utilisateur Conseil
- Export PDF illimité
- Accès complet à toutes les features

---

## 🚀 Déploiement

1. Créer les composants ✅
2. Ajouter les gates sur les features
3. Tester en local avec différents plans
4. Déployer sur Vercel
5. Tester en production

---

## 💡 Bonnes pratiques

1. **Toujours wrapper les features payantes** avec `FeatureGate`
2. **Utiliser `silent={true}`** pour masquer complètement (au lieu de griser)
3. **Messages clairs** : expliquer pourquoi la feature est bloquée
4. **Tester les limites** : vérifier que les compteurs (PDF 10/mois) fonctionnent

---

## 📝 Exemple complet : UserDashboard.tsx

```tsx
import FeatureGate from '@/components/premium/FeatureGate'

// Dans le JSX :
<FeatureGate 
  featureCode="pdf_export"
  customMessage="L'export PDF est limité à 10 par mois pour les membres Premium"
>
  <Button
    onClick={handleExportPDF}
    disabled={isGeneratingPDF}
    className="flex items-center gap-2"
  >
    <Download className="h-4 w-4" />
    {isGeneratingPDF ? 'Génération...' : 'Export PDF'}
  </Button>
</FeatureGate>
```

---

## ❓ FAQ

**Q : Que se passe-t-il si je n'entoure pas une feature premium avec FeatureGate ?**  
R : Les utilisateurs gratuits auront accès gratuitement ! 🚨

**Q : Comment tester les différents plans ?**  
R : Changez manuellement le plan dans Supabase ou créez des comptes de test.

**Q : Le hook `useFeaturePermission` fait-il des appels API ?**  
R : Oui, il appelle `checkFeatureAccess()` qui vérifie en base de données.

**Q : Peut-on customiser l'apparence de UpgradePrompt ?**  
R : Oui, modifiez directement `UpgradePrompt.tsx` ou passez des props custom.

---

✅ **Status** : Composants créés et prêts à l'emploi !
