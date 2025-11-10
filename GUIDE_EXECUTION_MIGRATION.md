# 🚀 Guide d'Exécution - Migration Finale des Prix

## ✅ Étape 1 : Exécuter la Migration SQL

### Ouvrir Supabase SQL Editor

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez le projet **nikahscore**
3. Cliquez sur **SQL Editor** dans le menu de gauche
4. Cliquez sur **"+ New query"**

### Copier et Exécuter

Copiez **TOUT le contenu** du fichier suivant :
📁 `supabase/migrations/20251110_fix_to_conseil_plan.sql`

Puis cliquez sur **Run** (ou `Ctrl + Enter`)

---

## ✅ Étape 2 : Vérifier le Résultat

Après l'exécution, vous devriez voir une table de résultats en bas avec :

```
name    | display_name     | price_monthly | price_yearly | sort_order | features_count
--------|------------------|---------------|--------------|------------|----------------
free    | Gratuit          | 0.00          | 0.00         | 1          | 6
premium | Premium          | 6.67          | 79.00        | 2          | 14
conseil | Conseil Premium  | 41.67         | 499.00       | 3          | 21
```

### ✅ Checklist de Validation :

- [ ] 3 lignes retournées (free, premium, conseil)
- [ ] Premium à 6,67€/mois et 79€/an
- [ ] Conseil à 41,67€/mois et 499€/an
- [ ] 6 features pour free
- [ ] 14 features pour premium
- [ ] 21 features pour conseil (17 de base + 4 exclusives)

---

## ✅ Étape 3 : Vérifier Votre Abonnement Actuel

Si vous avez déjà un compte utilisateur, vérifiez votre abonnement :

```sql
SELECT 
  us.status,
  sp.name as plan_code,
  sp.display_name as plan_name,
  sp.price_monthly,
  sp.price_yearly
FROM user_subscriptions us
JOIN subscription_plans sp ON us.plan_id = sp.id
WHERE us.user_id = auth.uid();
```

**Résultat attendu** :
- Vous devriez avoir le plan **"free"** (Gratuit) assigné automatiquement
- Status : **"active"**

---

## ✅ Étape 4 : Tester la Création d'un Nouveau Compte

Pour vérifier que le trigger fonctionne :

1. Créez un nouveau compte test sur votre app
2. Retournez sur Supabase SQL Editor
3. Exécutez :

```sql
SELECT COUNT(*) as total_subscriptions FROM user_subscriptions;
```

Le nombre devrait avoir **augmenté de 1** (nouveau user = nouveau abonnement gratuit auto-assigné)

---

## 🎯 Prochaines Étapes

Une fois la migration réussie :

### 1. Configuration Stripe (IMMÉDIAT)

Vous devez maintenant créer/modifier les produits sur Stripe Dashboard :

#### Produit Premium (6,67€)
- [ ] Créer ou modifier le produit "NikahScore Premium"
- [ ] Prix mensuel : **6,67€**
- [ ] Prix annuel : **79€**
- [ ] Récupérer les Price IDs

#### Produit Conseil (41,67€)
- [ ] Créer le produit "NikahScore Conseil Premium"
- [ ] Prix mensuel : **41,67€**
- [ ] Prix annuel : **499€**
- [ ] Récupérer les Price IDs

### 2. Mettre à Jour les Price IDs dans Supabase

Une fois les produits créés sur Stripe, exécutez :

```sql
UPDATE subscription_plans 
SET 
  stripe_price_id_monthly = 'price_XXXXX',
  stripe_price_id_yearly = 'price_YYYYY'
WHERE name = 'premium';

UPDATE subscription_plans 
SET 
  stripe_price_id_monthly = 'price_ZZZZZ',
  stripe_price_id_yearly = 'price_WWWWW'
WHERE name = 'conseil';
```

### 3. Continuer Phase 5

- [ ] Task 2 : Implémenter le flux Stripe Checkout
- [ ] Task 3 : Ajouter les feature gates
- [ ] Task 4 : Finaliser la page /pricing

---

## 🐛 Résolution de Problèmes

### Erreur : "duplicate key value violates unique constraint"

✅ **Résolu** : La migration actuelle renomme les plans dans le bon ordre

### Erreur : "relation does not exist"

❌ Vous devez d'abord exécuter la migration principale :
📁 `supabase/migrations/20251110_subscription_system.sql`

### Erreur : "permission denied"

❌ Vérifiez que vous êtes connecté avec les droits admin sur Supabase

### Pas de résultats dans la requête de vérification

✅ Normal si vous n'avez pas encore de compte utilisateur créé

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans l'onglet "Logs" de Supabase
2. Relancez la migration (elle est idempotente)
3. Vérifiez que toutes les tables existent (`subscription_plans`, `features`, etc.)

---

## 🎉 Confirmation de Succès

Vous saurez que tout fonctionne quand :

✅ La requête de vérification retourne 3 plans avec les bons prix  
✅ Votre compte a un abonnement "free" actif  
✅ Les nouveaux comptes reçoivent automatiquement le plan gratuit  
✅ Le dashboard affiche correctement le badge de plan  
✅ Aucune erreur dans les logs Supabase

**Une fois validé, passez à la configuration Stripe !** 🚀
