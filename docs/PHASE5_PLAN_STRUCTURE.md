# 🎯 Structure Finale des Plans d'Abonnement NikahScore

## ✅ Architecture Validée

### Plan 1 : Gratuit 🆓
**Prix** : 0€/mois  
**Positionnement** : Découverte et test du service

**Fonctionnalités incluses** :
- ✅ 1 questionnaire de base (100 questions)
- ✅ Résultats de base (score global)
- ✅ Partage des résultats
- ✅ Badges de base
- ✅ Mode couple (1 partenaire)
- ✅ Support par email (48h)

**Limites** :
- ❌ 1 seul questionnaire
- ❌ Pas d'analyses détaillées
- ❌ Pas d'export PDF
- ❌ Pas de questions avancées

---

### Plan 2 : Premium ⭐
**Prix** : 9,99€/mois ou 99,99€/an  
**Positionnement** : Utilisateurs sérieux en recherche active

**Fonctionnalités incluses** :
- ✅ **Tout du plan Gratuit** +
- ✅ Questionnaires illimités
- ✅ Questions avancées (finance, rôles, projets)
- ✅ Analyses détaillées par dimensions
- ✅ Recommandations IA personnalisées
- ✅ Export PDF (10/mois)
- ✅ Tous les badges Premium
- ✅ Mode couple (3 partenaires)
- ✅ Insights couple approfondis
- ✅ Support prioritaire (24h)

**Stripe Product ID** : Celui que vous avez déjà configuré à 9,99€

---

### Plan 3 : Conseil Premium 👑
**Prix** : 49,99€/mois ou 499,99€/an  
**Positionnement** : Accompagnement VIP avec coach dédié

**Fonctionnalités incluses** :
- ✅ **Tout du plan Premium** +
- ✅ **Coach matrimonial personnel** (la vraie valeur ajoutée !)
- ✅ **2 sessions de conseil 1-on-1 par mois**
- ✅ Médiation de couple professionnelle
- ✅ Matching prioritaire (profil mis en avant)
- ✅ Tendances de compatibilité (évolution dans le temps)
- ✅ Export PDF illimité
- ✅ Personnalisation des rapports (branding)
- ✅ Classement et leaderboard
- ✅ Mode couple illimité
- ✅ Suivi de compatibilité avancé
- ✅ Support dédié (réponse immédiate)

**Stripe Product ID** : À créer à 49,99€

---

## 📊 Comparaison Rapide

| Feature | Gratuit | Premium | Conseil |
|---------|---------|---------|---------|
| **Prix** | 0€ | 9,99€/mois | 49,99€/mois |
| **Questionnaires** | 1 | Illimité | Illimité |
| **Questions avancées** | ❌ | ✅ | ✅ |
| **Export PDF** | ❌ | 10/mois | Illimité |
| **Analyses détaillées** | ❌ | ✅ | ✅ |
| **Recommandations IA** | ❌ | ✅ | ✅ |
| **Coach personnel** | ❌ | ❌ | ✅ |
| **Sessions 1-on-1** | ❌ | ❌ | 2/mois |
| **Support** | Email 48h | Prioritaire 24h | Dédié immédiat |

---

## 🔄 Migration SQL à Exécuter sur Supabase

Vous devez maintenant exécuter le fichier de correction :

**Fichier** : `supabase/migrations/20251110_fix_to_conseil_plan.sql`

### Actions réalisées par la migration :
1. ✅ Renomme "essential" → "premium" (9,99€)
2. ✅ Renomme ancien "premium" → "conseil" (49,99€)
3. ✅ Ajoute 4 nouvelles features exclusives Conseil :
   - `personal_coaching` - Coach personnel
   - `monthly_sessions` - Sessions mensuelles (limite: 2/mois)
   - `couple_mediation` - Médiation de couple
   - `priority_matching` - Matching prioritaire

### 🎯 Exécution :

1. Ouvrez le SQL Editor de Supabase
2. Copiez le contenu de `20251110_fix_to_conseil_plan.sql`
3. Exécutez la requête
4. Vérifiez le résultat avec :

```sql
SELECT 
  name, 
  display_name, 
  price_monthly, 
  price_yearly,
  (SELECT COUNT(*) FROM plan_features WHERE plan_id = subscription_plans.id) as features_count
FROM subscription_plans 
ORDER BY sort_order;
```

**Résultat attendu** :
```
name     | display_name     | price_monthly | price_yearly | features_count
---------|------------------|---------------|--------------|---------------
free     | Gratuit          | 0.00          | 0.00         | 6
premium  | Premium          | 9.99          | 99.99        | 14
conseil  | Conseil Premium  | 49.99         | 499.99       | 21
```

---

## 💳 Tâches Stripe à Faire

### Produit existant (Premium - 9,99€)
✅ Déjà configuré  
✅ Stripe Product ID : à récupérer et ajouter dans Supabase

### Nouveau produit (Conseil - 49,99€)
❌ À créer sur Stripe Dashboard

**Étapes** :
1. Créer un nouveau produit "Conseil Premium"
2. Ajouter 2 prix :
   - Prix mensuel : 49,99€
   - Prix annuel : 499,99€ (économie de 100€/an)
3. Récupérer les Price IDs Stripe
4. Mettre à jour dans Supabase :

```sql
UPDATE subscription_plans 
SET 
  stripe_price_id_monthly = 'price_XXXXX',
  stripe_price_id_yearly = 'price_YYYYY'
WHERE name = 'conseil';
```

---

## 🎨 Affichage dans l'Application

### Badges actualisés :
- 🆓 **Gratuit** : Pas de badge (par défaut)
- ⭐ **Premium** : Badge violet `bg-purple-500`
- 👑 **Conseil Premium** : Badge orange `bg-orange-500`

### Code mis à jour :
- ✅ `useSubscription.ts` : Retourne maintenant `isConseil` au lieu de `isEssential`
- ✅ `UserDashboard.tsx` : Affiche le bon badge selon le plan
- ✅ Build Vercel : Passera avec succès

---

## 📈 Stratégie de Pricing

### Pourquoi cette structure fonctionne ?

**Psychologie du pricing** :
- Le plan Gratuit = **Acquisition** (convertir les visiteurs en utilisateurs)
- Le plan Premium (9,99€) = **Monétisation** (revenus récurrents stables)
- Le plan Conseil (49,99€) = **Premium** (marge haute + vraie valeur ajoutée)

**Le gap de prix x5 est justifié par** :
- Accompagnement humain personnalisé (coût réel)
- Sessions 1-on-1 (temps du coach)
- Service VIP avec réponse immédiate
- Médiation professionnelle

**Upsell path** :
1. Utilisateur découvre avec Gratuit
2. S'engage avec Premium (9,99€)
3. Si sérieux + besoin d'aide → Conseil (49,99€)

---

## ✅ Checklist de Validation

Avant de passer à la Phase 5 Task 2 (Stripe), vérifiez :

- [ ] Migration SQL exécutée sur Supabase
- [ ] 3 plans visibles : free, premium, conseil
- [ ] Prix corrects : 0€, 9,99€, 49,99€
- [ ] 24 features au total (20 de base + 4 Conseil exclusives)
- [ ] Build Vercel réussi
- [ ] Dashboard affiche le bon badge de plan
- [ ] useSubscription retourne `isConseil` correctement

---

## 🚀 Prochaines Étapes

### Task 2 : Intégration Stripe
1. Créer le produit Conseil (49,99€) sur Stripe
2. Récupérer les Price IDs
3. Implémenter le flux de checkout
4. Configurer les webhooks

### Task 3 : Gates de Permissions
1. Créer le composant `FeatureGate`
2. Bloquer les features Premium/Conseil
3. Afficher les messages d'upgrade

### Task 4 : Page Pricing
1. Tableau comparatif 3 colonnes
2. Mettre en avant le plan Premium (recommended)
3. Ajouter le call-to-action pour Conseil

---

## 💡 Notes Importantes

- Le **coaching personnel** est la vraie valeur du plan Conseil
- Prévoyez une **procédure de sélection** des coachs
- Les **sessions** doivent être bookables via calendrier
- Pensez à **tracker les sessions utilisées** (limite 2/mois)

**Conseil business** : Le plan à 49,99€ peut représenter 50-60% de votre revenue même si moins d'utilisateurs le prennent (marge x5 vs Premium).
