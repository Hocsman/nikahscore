# 🚀 Plan d'Amélioration NikahScore - Dashboard & Expérience Utilisateur

## 📊 État Actuel (Analyse)

### ✅ Ce qui fonctionne bien
- Dashboard avec stats (fictives actuellement)
- Graphiques de compatibilité (RadarChart, BarChart)
- Système d'abonnement Premium/Conseil
- Interface moderne et responsive
- Animations Framer Motion
- Actions rapides (Découvrir, Messages, Résultats, Paramètres)

### 🔴 Points faibles identifiés
- **Données fictives** : stats hardcodées (profileCompletion: 85, compatibilityScore: 92, etc.)
- **Aucune donnée réelle** de la base de données
- **Pas d'historique** des questionnaires complétés
- **Pas de progression** visible du profil utilisateur
- **Fonctionnalités manquantes** : messages, découverte de profils, paramètres
- **Export PDF** temporairement désactivé

---

## 🎯 Améliorations Prioritaires (Ordre d'Impact)

### 1. **CRITIQUES** - Données Réelles du Dashboard (Impact : ⭐⭐⭐⭐⭐)

#### A. Récupérer les données réelles de l'utilisateur
**Problème** : Stats actuellement hardcodées
**Solution** :

```typescript
// src/hooks/useUserStats.ts (À CRÉER)
export function useUserStats() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      // 1. Récupérer les questionnaires complétés
      const { data: questionnaires } = await supabase
        .from('pairs')
        .select('*, answers(count)')
        .or(`user_a_email.eq.${user.email},user_b_email.eq.${user.email}`)
        .eq('status', 'both_completed')

      // 2. Calculer le score de compatibilité moyen
      const avgScore = calculateAverageCompatibility(questionnaires)

      // 3. Compter les couples créés
      const couplesCount = questionnaires?.length || 0

      // 4. Calculer la complétude du profil
      const profileCompletion = calculateProfileCompletion(user)

      setStats({
        profileCompletion,
        compatibilityScore: avgScore,
        questionnairesCompleted: couplesCount,
        couplesCreated: couplesCount,
        lastActivity: getLastActivity()
      })
    }

    fetchStats()
  }, [user])

  return { stats, loading }
}
```

**Fichiers à modifier** :
- `src/hooks/useUserStats.ts` (CRÉER)
- `src/components/dashboard/UserDashboard.tsx` (ADAPTER)

**Temps estimé** : 2-3 heures

---

#### B. Historique des questionnaires
**Problème** : Pas de vue d'ensemble des tests passés
**Solution** : Afficher la liste des couples avec leur score

```typescript
// Composant à ajouter dans UserDashboard.tsx
<Card>
  <CardHeader>
    <CardTitle>📋 Historique des tests</CardTitle>
  </CardHeader>
  <CardContent>
    {userQuestionnaires.map(questionnaire => (
      <div key={questionnaire.id} className="flex justify-between items-center p-3 border-b">
        <div>
          <p className="font-medium">
            Couple avec {questionnaire.partner_name || 'Partenaire'}
          </p>
          <p className="text-sm text-gray-500">
            {formatDate(questionnaire.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={questionnaire.score >= 80 ? 'success' : 'warning'}>
            {questionnaire.score}% compatibilité
          </Badge>
          <Button size="sm" variant="outline" asChild>
            <Link href={`/results/${questionnaire.id}`}>
              Voir détails
            </Link>
          </Button>
        </div>
      </div>
    ))}
  </CardContent>
</Card>
```

**Temps estimé** : 1-2 heures

---

### 2. **IMPORTANTES** - Fonctionnalités Manquantes (Impact : ⭐⭐⭐⭐)

#### A. Page Profil Utilisateur (Actuellement inexistante)
**Chemin** : `/profile` ou `/settings`

**Fonctionnalités à ajouter** :
- ✏️ Modifier prénom, nom
- 📧 Gérer l'email (avec vérification)
- 🔒 Changer le mot de passe
- 🗑️ Supprimer le compte
- 📊 Voir les statistiques personnelles
- 🔔 Préférences de notifications

**Fichiers à créer** :
```
src/app/profile/page.tsx
src/components/profile/ProfileForm.tsx
src/components/profile/SecuritySettings.tsx
src/components/profile/NotificationSettings.tsx
src/app/api/profile/update/route.ts
```

**Temps estimé** : 4-5 heures

---

#### B. Système de Notifications Réel
**Problème** : Notifications hardcodées dans le dashboard
**Solution** : Table `notifications` + hook + affichage temps réel

```typescript
// src/hooks/useNotifications.ts (DÉJÀ EXISTE - À VÉRIFIER)
export function useNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    // Récupérer les notifications depuis Supabase
    const fetchNotifications = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      setNotifications(data || [])
    }

    fetchNotifications()

    // Écouter les nouvelles notifications en temps réel
    const subscription = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        setNotifications(prev => [payload.new, ...prev])
      })
      .subscribe()

    return () => subscription.unsubscribe()
  }, [user])

  return { notifications }
}
```

**Types de notifications à implémenter** :
- 🎯 Nouveau questionnaire partagé reçu
- ✅ Partenaire a complété le questionnaire
- 📊 Résultats disponibles
- ⭐ Upgrade Premium/Conseil réussi
- 🔄 Renouvellement d'abonnement

**Temps estimé** : 3-4 heures

---

#### C. Calcul Automatique de Complétude du Profil
**Problème** : Valeur fixe à 85%
**Solution** : Calculer basé sur les données réelles

```typescript
function calculateProfileCompletion(user: AuthUser): number {
  let score = 0
  const maxScore = 100

  // Email vérifié : 20%
  if (user.email_verified) score += 20

  // Prénom et nom : 15%
  if (user.firstName) score += 10
  if (user.lastName) score += 5

  // Au moins 1 questionnaire complété : 30%
  if (user.questionnairesCompleted > 0) score += 30

  // Photo de profil : 10%
  if (user.avatar_url) score += 10

  // Abonnement actif : 15%
  if (user.isPremium) score += 15

  // Couple actif : 10%
  if (user.activeCoupleCount > 0) score += 10

  return Math.min(score, maxScore)
}
```

**Temps estimé** : 1 heure

---

### 3. **UTILES** - Améliorations UX (Impact : ⭐⭐⭐)

#### A. Onboarding Guidé pour Nouveaux Utilisateurs
**Problème** : Utilisateurs perdus après inscription
**Solution** : Tour guidé avec étapes

```typescript
// src/components/onboarding/OnboardingTour.tsx
const steps = [
  {
    target: '.dashboard-stats',
    title: 'Bienvenue sur NikahScore ! 👋',
    content: 'Voici votre tableau de bord. Suivez votre progression ici.',
  },
  {
    target: '.create-couple-button',
    title: 'Créez votre premier couple 💑',
    content: 'Commencez par créer un questionnaire partagé avec votre partenaire.',
  },
  {
    target: '.quick-actions',
    title: 'Actions rapides ⚡',
    content: 'Accédez rapidement aux fonctionnalités principales.',
  },
]

// Utiliser react-joyride ou shepherd.js
```

**Temps estimé** : 2-3 heures

---

#### B. Amélioration de la Page Résultats
**Fichiers** : `src/app/results/[pairId]/page.tsx`

**Améliorations** :
- ✅ Graphiques interactifs (hover pour détails)
- 📥 Bouton "Partager les résultats" (lien partageable)
- 💬 Section "Conseils personnalisés" basés sur le score
- 🔖 Sauvegarder en favoris
- 📧 Envoyer par email (PDF ou lien)

**Temps estimé** : 3-4 heures

---

#### C. Dashboard Mobile Optimisé
**Problème** : Dashboard chargé, difficile à naviguer sur mobile
**Solution** :
- Version simplifiée pour < 768px
- Swipe entre les sections
- Bottom navigation bar
- Cards condensées

**Temps estimé** : 2-3 heures

---

### 4. **BONUS** - Fonctionnalités Avancées (Impact : ⭐⭐)

#### A. Comparaison de Couples
**Fonctionnalité** : Comparer 2 tests de compatibilité
- "Couple A vs Couple B : qui est le plus compatible ?"
- Graphique superposé
- Tableau comparatif

**Temps estimé** : 3-4 heures

---

#### B. Export PDF Fonctionnel
**Problème** : Actuellement désactivé
**Solution** : 
- Utiliser @react-pdf/renderer (côté client)
- ou puppeteer (côté serveur) avec route API
- Template professionnel avec logo NikahScore
- Graphiques inclus

**Temps estimé** : 4-6 heures

---

#### C. Système de Badges et Achievements
**Idée** : Gamification
- 🏆 "Premier Test" : Complété votre premier questionnaire
- 💑 "Couple Engagé" : 3 questionnaires complétés
- ⭐ "Premium Member" : Abonnement actif
- 🎯 "Perfectionniste" : Score > 90% sur un test

**Temps estimé** : 2-3 heures

---

## 📋 Priorisation Recommandée

### Phase 1 : Fondations (Semaine 1) - **CRITIQUE**
1. ✅ Hook `useUserStats` avec données réelles (2-3h)
2. ✅ Historique des questionnaires (1-2h)
3. ✅ Calcul de complétude du profil (1h)
4. ✅ Adapter UserDashboard pour utiliser les vraies données (2h)

**Total** : ~6-8 heures
**Impact** : ⭐⭐⭐⭐⭐

---

### Phase 2 : Fonctionnalités Essentielles (Semaine 2) - **IMPORTANT**
1. ✅ Page Profil `/profile` (4-5h)
2. ✅ Système de notifications réel (3-4h)
3. ✅ Amélioration page Résultats (3-4h)

**Total** : ~10-13 heures
**Impact** : ⭐⭐⭐⭐

---

### Phase 3 : Polish & UX (Semaine 3) - **UTILE**
1. ✅ Onboarding guidé (2-3h)
2. ✅ Dashboard mobile optimisé (2-3h)
3. ✅ Export PDF (4-6h)

**Total** : ~8-12 heures
**Impact** : ⭐⭐⭐

---

### Phase 4 : Bonus (Semaine 4+) - **NICE TO HAVE**
1. ✅ Comparaison de couples (3-4h)
2. ✅ Système de badges (2-3h)
3. ✅ Analytics avancés (3-4h)

**Total** : ~8-11 heures
**Impact** : ⭐⭐

---

## 🛠️ Stack Technique Requis

### Nouveaux packages à installer
```bash
npm install @react-pdf/renderer          # Pour export PDF
npm install react-joyride                # Pour onboarding tour
npm install recharts-to-png              # Graphiques → Images pour PDF
npm install date-fns                     # Manipulation dates (déjà installé ?)
```

### Nouvelles tables Supabase (si nécessaire)
```sql
-- Table notifications (vérifier si existe)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'info', 'success', 'warning', 'couple_invite', etc.
  read BOOLEAN DEFAULT FALSE,
  link TEXT, -- Lien vers l'action (optionnel)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table user_achievements (optionnel)
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id VARCHAR(50) NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);
```

---

## 📊 Métriques de Succès

Après implémentation, mesurer :
- ✅ Taux de complétion du profil (objectif : >70%)
- ✅ Taux de retour sur le dashboard (objectif : >40%)
- ✅ Nombre de questionnaires complétés par utilisateur (objectif : 2+)
- ✅ Taux de conversion Gratuit → Premium (objectif : >5%)
- ✅ Temps passé sur le dashboard (objectif : >2 min)

---

## 🚀 Commencer par quoi ?

### Recommandation : **Phase 1 - Données Réelles**

**Pourquoi ?**
- Impact immédiat sur l'expérience utilisateur
- Révèle les vraies statistiques (pas du faux)
- Base pour toutes les autres améliorations
- Relativement rapide à implémenter

**Prochaine étape concrète** :
1. Créer `src/hooks/useUserStats.ts`
2. Requêter la table `pairs` pour récupérer les questionnaires de l'utilisateur
3. Calculer les stats réelles
4. Remplacer les valeurs hardcodées dans `UserDashboard.tsx`

---

## 💡 Idées Supplémentaires (Brainstorm)

- 🔔 Notifications push (PWA)
- 📱 App mobile React Native (futur)
- 🤖 Chatbot d'aide (conseils compatibilité)
- 📊 Rapport mensuel par email
- 🎨 Thèmes personnalisables (light/dark)
- 🌍 Internationalisation (FR/EN/AR)
- 💬 Messagerie intégrée entre couples
- 📹 Appels vidéo pour Conseil (Big feature)

---

**Voulez-vous que je commence par implémenter la Phase 1 (Données Réelles) ?** 🚀
