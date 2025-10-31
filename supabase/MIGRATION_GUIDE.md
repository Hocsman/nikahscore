# 🗄️ Migration Supabase - Système Couples + Premium

## 📋 Tables à créer

Cette migration crée 3 tables essentielles pour NikahScore :

### 1. **`couples`** - Système de questionnaire partagé
- Gère les codes de couple (format: ABC-12345)
- Lie 2 utilisateurs (creator + partner)
- Statuts: waiting_partner, active, completed, expired

### 2. **`compatibility_results`** - Résultats de compatibilité
- Scores par dimension (spiritualité, famille, communication, etc.)
- Score global (0-100)
- Insights et recommandations (JSON)

### 3. **`subscriptions`** - Abonnements Premium
- Types: free, premium, lifetime
- Intégration Stripe (customer_id, subscription_id)
- Gestion des périodes et renouvellements

---

## 🚀 Comment exécuter la migration ?

### **Option 1 : Via Supabase Dashboard (RECOMMANDÉ)** ✅

1. Va sur **https://supabase.com/dashboard**
2. Sélectionne ton projet **NikahScore**
3. Menu latéral → **SQL Editor**
4. Clic sur **New Query**
5. Copie-colle tout le contenu de `20251031_couples_and_premium.sql`
6. Clic sur **Run** (▶️)
7. ✅ Vérifie que tout est vert (pas d'erreurs)

### **Option 2 : Via Supabase CLI** (Avancé)

```bash
# Si tu as Supabase CLI installé
npx supabase migration up

# Ou manuellement
npx supabase db push
```

---

## ✅ Vérification après migration

### **1. Vérifier que les tables existent**

Dans le SQL Editor, exécute :

```sql
-- Liste des tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('couples', 'compatibility_results', 'subscriptions');
```

Tu devrais voir 3 lignes :
- couples
- compatibility_results
- subscriptions

### **2. Vérifier les politiques RLS**

```sql
-- Politiques de sécurité
SELECT tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('couples', 'compatibility_results', 'subscriptions');
```

Tu devrais voir au moins 9 politiques.

### **3. Tester la génération de code couple**

```sql
-- Tester la fonction
SELECT generate_couple_code();
```

Tu devrais voir un code au format : `ABC-12345`

---

## 🔧 Si tu as des erreurs

### **Erreur : "relation already exists"**

Si les tables existent déjà, supprime-les d'abord :

```sql
-- ⚠️ ATTENTION : Ceci supprime les données !
DROP TABLE IF EXISTS compatibility_results CASCADE;
DROP TABLE IF EXISTS couples CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;

-- Puis réexécute la migration
```

### **Erreur : "constraint violation"**

Si tu as des données existantes incompatibles, nettoie d'abord :

```sql
-- Nettoyer les anciennes données
TRUNCATE TABLE couples CASCADE;
TRUNCATE TABLE compatibility_results CASCADE;
TRUNCATE TABLE subscriptions CASCADE;
```

---

## 📊 Structure des données

### **Table `couples`**

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | ID unique du couple |
| `couple_code` | VARCHAR(10) | Code partageable (ex: ABC-12345) |
| `creator_id` | UUID | Utilisateur créateur |
| `partner_id` | UUID | Partenaire qui rejoint |
| `status` | VARCHAR | waiting_partner, active, completed |
| `created_at` | TIMESTAMP | Date de création |

### **Table `compatibility_results`**

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | ID unique du résultat |
| `couple_id` | UUID | Référence au couple |
| `overall_score` | INTEGER | Score global (0-100) |
| `spirituality_score` | INTEGER | Score spiritualité |
| `family_score` | INTEGER | Score famille |
| `communication_score` | INTEGER | Score communication |
| `values_score` | INTEGER | Score valeurs |
| `finance_score` | INTEGER | Score finances |
| `intimacy_score` | INTEGER | Score intimité |
| `strengths` | JSONB | Forces du couple |
| `improvements` | JSONB | Points à améliorer |
| `recommendations` | JSONB | Recommandations |

### **Table `subscriptions`**

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | ID unique |
| `user_id` | UUID | Utilisateur |
| `plan_type` | VARCHAR | free, premium, lifetime |
| `status` | VARCHAR | active, cancelled, expired |
| `stripe_customer_id` | VARCHAR | ID client Stripe |
| `stripe_subscription_id` | VARCHAR | ID abonnement Stripe |
| `current_period_end` | TIMESTAMP | Fin de période |

---

## 🎯 Après la migration

Une fois la migration exécutée avec succès :

1. ✅ **Test Couple** : Crée un compte sur nikahscore.com et teste le flux /couple
2. ✅ **Test PDF** : Va sur /dashboard et clique sur "Export PDF"
3. ✅ **Prêt pour Stripe** : Tu peux maintenant intégrer les paiements

---

## 📝 Notes importantes

- ⚠️ **RLS activé** : Les données sont protégées par utilisateur
- 🔒 **Sécurité** : Chaque user voit uniquement ses couples
- 🔄 **Auto-génération** : Les codes couples sont générés automatiquement
- 📅 **Expiration** : Les couples expirent après 30 jours par défaut

---

## 🆘 Besoin d'aide ?

Si tu rencontres un problème :
1. Copie l'erreur complète
2. Vérifie les logs Supabase (Dashboard → Logs)
3. Teste les requêtes une par une dans SQL Editor
