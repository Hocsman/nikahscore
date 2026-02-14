# 🚀 Guide d'exécution de la migration SQL sur Supabase

## 📋 Migrations à exécuter

Vous devez exécuter **2 migrations** dans l'ordre suivant :

### 1️⃣ Migration du système d'abonnements (PRIORITAIRE)
**Fichier** : `supabase/migrations/20251110_subscription_system.sql`

### 2️⃣ Migration du système d'achievements (OPTIONNEL)
**Fichier** : `supabase/migrations/20251110_achievements_system.sql`

---

## 🎯 Procédure d'exécution

### Étape 1 : Accéder au SQL Editor de Supabase

1. Ouvrez votre navigateur et allez sur : **https://supabase.com/dashboard**
2. Connectez-vous à votre compte
3. Sélectionnez le projet **nikahscore**
4. Dans le menu de gauche, cliquez sur **SQL Editor** (icône 📊)

### Étape 2 : Exécuter la migration du système d'abonnements

1. Dans le SQL Editor, cliquez sur **"+ New query"**
2. Copiez **TOUT le contenu** du fichier `supabase/migrations/20251110_subscription_system.sql`
3. Collez-le dans l'éditeur SQL
4. Cliquez sur **"Run"** (ou appuyez sur `Ctrl + Enter`)
5. ✅ Attendez le message de confirmation : **"Success. No rows returned"**

### Étape 3 : Vérifier que la migration a réussi

Exécutez ces requêtes pour vérifier :

```sql
-- Vérifier les plans créés (doit retourner 3 lignes)
SELECT name, display_name, price_monthly FROM subscription_plans;

-- Vérifier les features créées (doit retourner 20 lignes)
SELECT code, name, category FROM features;

-- Vérifier le mapping des features (doit retourner ~37 lignes)
SELECT 
  sp.name as plan_name, 
  pf.feature_code, 
  pf.limit_value 
FROM plan_features pf
JOIN subscription_plans sp ON pf.plan_id = sp.id
ORDER BY sp.sort_order, pf.feature_code;
```

### Étape 4 : Tester l'auto-assignation du plan gratuit

Si vous avez déjà un compte utilisateur, testez manuellement :

```sql
-- Vérifier votre abonnement actuel
SELECT 
  us.status,
  sp.name as plan_name,
  sp.display_name
FROM user_subscriptions us
JOIN subscription_plans sp ON us.plan_id = sp.id
WHERE us.user_id = auth.uid();
```

Si vous n'avez pas encore d'abonnement, le trigger devrait l'assigner automatiquement lors de votre prochaine connexion.

---

## 📊 Résultats attendus

### Plans créés :
- ✅ **Gratuit** : 0,00€/mois (6 features)
- ✅ **Essentiel** : 9,99€/mois ou 99,99€/an (14 features)
- ✅ **Premium** : 19,99€/mois ou 199,99€/an (17 features)

### Features créées par catégorie :
- 📝 **Questionnaires** : 3 features
- 📊 **Résultats** : 4 features
- 📤 **Export** : 3 features
- 💬 **Support** : 3 features
- 🏆 **Gamification** : 3 features
- 👫 **Couple** : 4 features

**Total : 20 features**

### Tables créées :
1. `subscription_plans` - Plans disponibles
2. `user_subscriptions` - Abonnements des utilisateurs
3. `features` - Features disponibles
4. `plan_features` - Mapping plan ↔ features
5. `feature_usage` - Tracking d'utilisation

### Fonctions créées :
- `assign_free_plan_to_new_user()` - Trigger automatique
- `check_feature_access(user_id, feature_code)` - Vérification d'accès

---

## ⚠️ En cas d'erreur

### Erreur : "relation already exists"
**Cause** : Les tables existent déjà (migration déjà exécutée)  
**Solution** : Aucune action requise, la migration utilise `CREATE TABLE IF NOT EXISTS`

### Erreur : "duplicate key value violates unique constraint"
**Cause** : Les données existent déjà  
**Solution** : Aucune action requise, la migration utilise `ON CONFLICT DO NOTHING`

### Erreur : "permission denied"
**Cause** : Problème de droits d'accès  
**Solution** : Vérifiez que vous êtes bien connecté en tant qu'admin du projet

### Erreur : "syntax error"
**Cause** : Copier-coller incomplet ou modifié  
**Solution** : Recopiez à nouveau le fichier SQL complet depuis VS Code

---

## ✅ Checklist de validation

Après l'exécution, vérifiez :

- [ ] 3 plans créés (free, essential, premium)
- [ ] 20 features créées
- [ ] ~37 mappings plan_features créés
- [ ] Trigger `on_user_created_assign_free_plan` actif
- [ ] RLS policies activées sur toutes les tables
- [ ] Fonction `check_feature_access()` créée

---

## 🔄 Migration optionnelle : Achievements (Phase 3)

Si vous voulez aussi activer les achievements (badges), exécutez ensuite :

**Fichier** : `supabase/migrations/20251110_achievements_system.sql`

Suivez la même procédure que pour la première migration.

---

## 📞 Besoin d'aide ?

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans le SQL Editor
2. Assurez-vous d'avoir copié **tout le contenu** du fichier
3. Vérifiez que vous êtes sur le bon projet Supabase
4. Contactez le support Supabase si l'erreur persiste

---

## 🎉 Prochaines étapes après la migration

Une fois la migration réussie :

1. ✅ **Redémarrer l'application locale** pour tester
2. ✅ **Tester la création d'un nouveau compte** (devrait avoir le plan gratuit)
3. ✅ **Vérifier le dashboard** (affichage du plan)
4. ✅ **Continuer Phase 5** :
   - Task 2 : Intégration Stripe
   - Task 3 : Gates de permissions
   - Task 4 : Pages de pricing

---

## 📝 Notes importantes

- ⚠️ Cette migration est **réversible** (vous pouvez supprimer les tables si besoin)
- 💾 Les données existantes ne seront **pas affectées**
- 🔒 Les RLS policies garantissent la **sécurité** des données
- 🚀 Le trigger assigne automatiquement le plan gratuit aux **nouveaux utilisateurs**
- 🔄 Les utilisateurs existants devront être migrés manuellement si nécessaire
