# 🚀 CHECKLIST DÉPLOIEMENT - PHASE 5

## 📅 Date : 10 novembre 2025

---

## ✅ PRÉ-DÉPLOIEMENT

### 1. Vérifications Supabase ✅
- [x] Migration subscription_system.sql exécutée
- [x] Migration UPDATE_PRICES_FINAL.sql exécutée
- [x] Migration add_stripe_price_ids.sql exécutée
- [x] 3 plans configurés avec bons prix
- [x] 4 Price IDs Stripe ajoutés
- [x] RLS policies actives
- [x] Triggers fonctionnels

**Vérification** :
```sql
SELECT name, price_monthly, price_yearly, stripe_price_id_monthly, stripe_price_id_yearly 
FROM subscription_plans 
ORDER BY sort_order;
```

**Résultat attendu** :
```
free    | 0.00  | 0.00   | NULL                              | NULL
premium | 9.99  | 79.00  | price_1SQxavEOiMGm6qlDldkN0PL7    | price_1SQxavEOiMGm6qlD79PRxb4t
conseil | 49.99 | 499.00 | price_1SQxbfEOiMGm6qlDwOpwYYEg    | price_1SQxcJEOiMGm6qlDp91uLFxm
```

---

### 2. Variables d'environnement Vercel ✅
- [x] STRIPE_PREMIUM_MONTHLY_PRICE_ID
- [x] STRIPE_PREMIUM_ANNUAL_PRICE_ID
- [x] STRIPE_CONSEIL_MONTHLY_PRICE_ID
- [x] STRIPE_CONSEIL_ANNUAL_PRICE_ID
- [x] STRIPE_PUBLISHABLE_KEY
- [x] STRIPE_SECRET_KEY
- [x] STRIPE_WEBHOOK_SECRET
- [x] SUPABASE_SERVICE_ROLE_KEY

**Vérifier dans Vercel** : Settings → Environment Variables → Production

---

### 3. Fichiers modifiés (à commiter) ✅

**Nouveaux fichiers** :
- `src/components/premium/FeatureGate.tsx`
- `src/components/premium/UpgradePrompt.tsx`
- `supabase/migrations/20251110_subscription_system.sql`
- `supabase/migrations/20251110_UPDATE_PRICES_FINAL.sql`
- `supabase/migrations/20251110_add_stripe_price_ids.sql`
- `FEATURE_GATES_GUIDE.md`
- `FEATURE_GATES_EXAMPLES.tsx`
- `PHASE5_TASK3_COMPLETE.md`
- `PHASE5_INTEGRATION_COMPLETE.md`
- `PHASE5_SUMMARY.md`
- `DEPLOY_CHECKLIST.md` (ce fichier)

**Fichiers modifiés** :
- `src/components/dashboard/UserDashboard.tsx`
- `src/app/results/[pairId]/enhanced-page.tsx`
- `.env.local.example` (si modifié)

---

## 🚀 DÉPLOIEMENT

### Étape 1 : Commit et Push

```bash
# 1. Vérifier les changements
git status

# 2. Ajouter tous les nouveaux fichiers
git add src/components/premium/
git add supabase/migrations/
git add *.md
git add src/components/dashboard/UserDashboard.tsx
git add src/app/results/[pairId]/enhanced-page.tsx

# 3. Commit avec message descriptif
git commit -m "feat: Phase 5 - Feature Gates & Premium Protection

- Add FeatureGate and UpgradePrompt components
- Protect PDF export in Dashboard and Results pages
- Add 3 SQL migrations for subscription system
- Configure Stripe integration with 4 Price IDs
- Add comprehensive documentation

Features:
- 5 new database tables (subscription_plans, user_subscriptions, features, plan_features, feature_usage)
- 3 subscription plans (Free, Premium 9.99€, Conseil 49.99€)
- 24 premium features defined
- Smart gating system with upgrade prompts
- Dark mode support, responsive design

Breaking changes: None
Migration required: Yes (3 SQL files in supabase/migrations/)
"

# 4. Push vers GitHub
git push origin main
```

---

### Étape 2 : Vérifier le Build Vercel

1. **Aller sur Vercel Dashboard** : https://vercel.com/dashboard
2. **Sélectionner le projet** : nikahscore
3. **Onglet Deployments** : Vérifier que le nouveau déploiement se lance
4. **Attendre le build** : ~2-3 minutes
5. **Vérifier le statut** : ✅ Ready ou ❌ Failed

**En cas d'erreur** :
- Cliquer sur le déploiement
- Onglet "Build Logs"
- Identifier l'erreur (TypeScript, imports, etc.)
- Corriger localement
- Re-commit et re-push

---

### Étape 3 : Tests Post-Déploiement

#### Test 1 : Vérifier les pages principales ✅
```bash
# Ouvrir ces URLs et vérifier qu'elles chargent :
https://nikahscore.com
https://nikahscore.com/dashboard
https://nikahscore.com/pricing
https://nikahscore.com/results/[un-pairId-existant]
```

#### Test 2 : Tester FeatureGate (user gratuit)
```bash
1. Se connecter avec compte gratuit
2. Aller sur Dashboard
3. ✅ Badge "🔒 Premium" visible sur Export PDF
4. ✅ Clic ouvre modal UpgradePrompt
5. ✅ Modal affiche "9,99€/mois"
6. ✅ CTA "Découvrir les offres" redirige vers /pricing
```

#### Test 3 : Vérifier Stripe Checkout
```bash
1. Aller sur /pricing
2. Cliquer sur "Passer en Premium"
3. ✅ Redirection vers Stripe Checkout
4. ✅ Prix correct affiché (9,99€ ou 79€)
5. NE PAS PAYER (sauf si test réel souhaité)
```

#### Test 4 : Vérifier Webhook Stripe
```bash
# Dans Stripe Dashboard :
1. Developers → Webhooks
2. Vérifier endpoint : https://nikahscore.com/api/stripe/webhook
3. ✅ Status "Enabled"
4. ✅ Events sélectionnés : checkout.session.completed, customer.subscription.*
```

---

## ⚠️ POINTS D'ATTENTION

### 1. Build Errors possibles

**Erreur : Cannot find module '@/components/premium/FeatureGate'**
- Cause : Import incorrect ou fichier non commité
- Solution : Vérifier que les fichiers sont bien pushés

**Erreur : Property 'loading' does not exist**
- Cause : Type FeaturePermission dans useFeaturePermission
- Solution : Cast explicite `as FeaturePermission & { loading: boolean }`

**Erreur : Module not found in enhanced-page.tsx**
- Cause : Import relatif incorrect
- Solution : Vérifier le chemin `@/components/premium/FeatureGate`

### 2. Runtime Errors possibles

**Modal ne s'affiche pas**
- Vérifier que UpgradePrompt.tsx est bien déployé
- Vérifier console browser pour erreurs

**Badge toujours visible même pour Premium**
- Vérifier que useSubscription retourne bien isPremium
- Vérifier que check_feature_access fonctionne

**PDF export toujours bloqué pour Premium**
- Vérifier Price IDs dans Supabase
- Vérifier que plan_features contient pdf_export pour premium

---

## 📊 VÉRIFICATIONS POST-DÉPLOIEMENT

### Checklist finale

- [ ] Build Vercel réussi (status Ready)
- [ ] Page d'accueil charge sans erreur
- [ ] Dashboard charge sans erreur
- [ ] Pricing page affiche les bons prix
- [ ] FeatureGate visible sur Dashboard (user gratuit)
- [ ] Modal UpgradePrompt s'ouvre au clic
- [ ] Modal affiche le bon pricing
- [ ] Redirection vers /pricing fonctionne
- [ ] Stripe Checkout accessible depuis /pricing
- [ ] Webhook endpoint actif dans Stripe
- [ ] Aucune erreur dans console browser
- [ ] Aucune erreur dans Vercel logs

---

## 🎯 TESTS OPTIONNELS (si temps)

### Test paiement complet (carte test)

```bash
1. Aller sur /pricing
2. Cliquer "Passer en Premium"
3. Entrer carte test : 4242 4242 4242 4242
4. Date : n'importe quelle date future
5. CVC : 123
6. Compléter le paiement
7. ✅ Redirection vers /success
8. ✅ Vérifier dans Supabase :
   SELECT * FROM user_subscriptions WHERE user_id = 'your_user_id';
9. ✅ Plan = 'premium', status = 'active'
10. ✅ Retourner sur Dashboard
11. ✅ Bouton Export PDF maintenant cliquable (pas de badge)
```

---

## 📝 DOCUMENTATION

### Pour l'équipe

**Nouveaux composants** :
- `FeatureGate` : Wrapper pour protéger features premium
- `UpgradePrompt` : Modal d'invitation à l'upgrade

**Nouveaux hooks** :
- `useFeatureGate(featureCode)` : Vérifier accès programmatiquement

**Documentation disponible** :
- `FEATURE_GATES_GUIDE.md` - Guide d'utilisation
- `FEATURE_GATES_EXAMPLES.tsx` - Exemples de code
- `PHASE5_SUMMARY.md` - Vue d'ensemble Phase 5

---

## 🎉 SUCCÈS !

Si toutes les vérifications sont ✅ :

**Phase 5 déployée avec succès !** 🚀

**Prochaines étapes** :
1. Monitorer les conversions
2. Implémenter questions avancées
3. Créer page gestion abonnement
4. Ajouter plus de features premium

---

## 📞 EN CAS DE PROBLÈME

### Rollback rapide

```bash
# Si problème critique en production :
git revert HEAD
git push origin main
# Vercel redéploiera automatiquement la version précédente
```

### Support

- Vercel logs : https://vercel.com/[project]/deployments
- Supabase logs : Dashboard → Logs
- Stripe logs : Dashboard → Developers → Events

---

**✅ Checklist complétée !**

_Dernière mise à jour : 10 novembre 2025_
