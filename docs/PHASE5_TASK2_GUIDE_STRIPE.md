# 🎯 PHASE 5 - TASK 2 : Configuration Stripe

## 📋 Vue d'ensemble

Cette task consiste à :
1. Créer les produits Stripe avec les bons prix
2. Récupérer les Price IDs
3. Les ajouter dans Supabase
4. Mettre à jour les variables d'environnement
5. Adapter les routes API existantes

---

## 💳 ÉTAPE 1 : Créer les Produits dans Stripe Dashboard

### Accès à Stripe

1. Allez sur https://dashboard.stripe.com
2. Connectez-vous à votre compte
3. **⚠️ Vérifiez que vous êtes en mode TEST** (pour commencer)

### Produit 1 : NikahScore Premium

#### Créer le produit
1. Cliquez sur **"Products"** dans le menu de gauche
2. Cliquez sur **"+ Add product"**
3. Remplissez :
   - **Name** : `NikahScore Premium`
   - **Description** : `Pour une analyse approfondie de votre compatibilité`
   - **Statement descriptor** : `NIKAHSCORE PRE` (apparaît sur le relevé bancaire)

#### Ajouter les prix

**Prix Mensuel** :
- Cliquez sur **"Add another price"** (ou créez le premier)
- **Price** : `6.67` EUR
- **Billing period** : `Monthly`
- **Payment type** : `Recurring`
- Cliquez sur **"Save"**
- ✅ **Copiez le Price ID** : `price_xxxxx` → Notez-le quelque part !

**Prix Annuel** :
- Cliquez sur **"Add another price"**
- **Price** : `79` EUR
- **Billing period** : `Yearly`
- **Payment type** : `Recurring`
- Cliquez sur **"Save"**
- ✅ **Copiez le Price ID** : `price_yyyyy` → Notez-le quelque part !

---

### Produit 2 : NikahScore Conseil Premium

#### Créer le produit
1. Cliquez sur **"+ Add product"**
2. Remplissez :
   - **Name** : `NikahScore Conseil Premium`
   - **Description** : `Avec accompagnement personnel par un coach matrimonial`
   - **Statement descriptor** : `NIKAHSCORE CONSEIL`

#### Ajouter les prix

**Prix Mensuel** :
- **Price** : `41.67` EUR
- **Billing period** : `Monthly`
- **Payment type** : `Recurring`
- Cliquez sur **"Save"**
- ✅ **Copiez le Price ID** : `price_zzzzz` → Notez-le !

**Prix Annuel** :
- **Price** : `499` EUR
- **Billing period** : `Yearly`
- **Payment type** : `Recurring`
- Cliquez sur **"Save"**
- ✅ **Copiez le Price ID** : `price_wwwww` → Notez-le !

---

## 📝 ÉTAPE 2 : Noter les Price IDs

Vous devriez maintenant avoir **4 Price IDs** :

```
Premium Mensuel   : price_1xxxxx
Premium Annuel    : price_2yyyyy
Conseil Mensuel   : price_3zzzzz
Conseil Annuel    : price_4wwwww
```

✅ **Notez-les dans un fichier temporaire** avant de continuer !

---

## 🗄️ ÉTAPE 3 : Ajouter les Price IDs dans Supabase

### Ouvrir Supabase SQL Editor

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez le projet **nikahscore**
3. Cliquez sur **SQL Editor**
4. **"+ New query"**

### Exécuter cette requête

```sql
-- Mettre à jour le plan Premium avec les Price IDs Stripe
UPDATE subscription_plans 
SET 
  stripe_price_id_monthly = 'price_1xxxxx',  -- Remplacez par votre vrai Price ID
  stripe_price_id_yearly = 'price_2yyyyy'    -- Remplacez par votre vrai Price ID
WHERE name = 'premium';

-- Mettre à jour le plan Conseil avec les Price IDs Stripe
UPDATE subscription_plans 
SET 
  stripe_price_id_monthly = 'price_3zzzzz',  -- Remplacez par votre vrai Price ID
  stripe_price_id_yearly = 'price_4wwwww'    -- Remplacez par votre vrai Price ID
WHERE name = 'conseil';

-- Vérifier les résultats
SELECT 
  name, 
  display_name, 
  price_monthly, 
  price_yearly,
  stripe_price_id_monthly,
  stripe_price_id_yearly
FROM subscription_plans 
WHERE name IN ('premium', 'conseil')
ORDER BY sort_order;
```

✅ **Vérifiez que les Price IDs sont bien enregistrés**

---

## 🔐 ÉTAPE 4 : Mettre à Jour les Variables d'Environnement

### Fichier `.env.local` (local)

Créez ou mettez à jour votre fichier `.env.local` :

```bash
# Stripe Keys (TEST pour commencer)
STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique_test
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete_test
STRIPE_WEBHOOK_SECRET=whsec_votre_webhook_secret_test

# Price IDs - Premium
STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_1xxxxx
STRIPE_PREMIUM_ANNUAL_PRICE_ID=price_2yyyyy

# Price IDs - Conseil
STRIPE_CONSEIL_MONTHLY_PRICE_ID=price_3zzzzz
STRIPE_CONSEIL_ANNUAL_PRICE_ID=price_4wwwww

# Supabase (gardez vos valeurs existantes)
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key

# Resend (gardez votre valeur existante)
RESEND_API_KEY=votre_resend_key
```

### Fichier `.env.local.example` (documentation)

Mettez à jour l'exemple pour les autres développeurs :

```bash
# Variables Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique_ici
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete_ici
STRIPE_WEBHOOK_SECRET=whsec_votre_webhook_secret_ici

# Price IDs Stripe - Premium (6.67€/mois, 79€/an)
STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_votre_premium_monthly_id
STRIPE_PREMIUM_ANNUAL_PRICE_ID=price_votre_premium_annual_id

# Price IDs Stripe - Conseil (41.67€/mois, 499€/an)
STRIPE_CONSEIL_MONTHLY_PRICE_ID=price_votre_conseil_monthly_id
STRIPE_CONSEIL_ANNUAL_PRICE_ID=price_votre_conseil_annual_id

# Supabase
NEXT_PUBLIC_SUPABASE_URL=votre_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key

# Email
RESEND_API_KEY=votre_resend_key
```

---

## 🔧 ÉTAPE 5 : Mettre à Jour la Route API

Votre fichier `src/app/api/stripe/create-checkout/route.ts` est déjà bien structuré !

Il faut juste vérifier qu'il utilise les bonnes variables d'environnement.

### Vérification du Code

Le code actuel utilise :
```typescript
const PRICE_IDS = {
  'premium-monthly': process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID!,
  'premium-annual': process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID!,
  'conseil-monthly': process.env.STRIPE_CONSEIL_MONTHLY_PRICE_ID!,
  'conseil-annual': process.env.STRIPE_CONSEIL_ANNUAL_PRICE_ID!,
}
```

✅ **C'est déjà bon !** Les noms de variables correspondent.

---

## 🎯 ÉTAPE 6 : Configurer Vercel

### Ajouter les Variables dans Vercel Dashboard

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet **nikahscore**
3. Allez dans **Settings** → **Environment Variables**
4. Ajoutez **TOUTES** ces variables :

```
STRIPE_PUBLISHABLE_KEY = pk_test_... (pour commencer en TEST)
STRIPE_SECRET_KEY = sk_test_...
STRIPE_WEBHOOK_SECRET = whsec_... (on le créera après)
STRIPE_PREMIUM_MONTHLY_PRICE_ID = price_1xxxxx
STRIPE_PREMIUM_ANNUAL_PRICE_ID = price_2yyyyy
STRIPE_CONSEIL_MONTHLY_PRICE_ID = price_3zzzzz
STRIPE_CONSEIL_ANNUAL_PRICE_ID = price_4wwwww
SUPABASE_SERVICE_ROLE_KEY = votre_service_role_key (pour les webhooks)
```

⚠️ **Attention** : Les autres variables (NEXT_PUBLIC_*) sont déjà configurées.

5. Cliquez sur **"Save"**
6. **Redéployez** l'application (Vercel le fera automatiquement)

---

## 🔔 ÉTAPE 7 : Configurer le Webhook Stripe

### Créer le Webhook Endpoint

1. Dans Stripe Dashboard, allez dans **Developers** → **Webhooks**
2. Cliquez sur **"+ Add endpoint"**
3. **Endpoint URL** : `https://votredomaine.com/api/stripe/webhook`
   - En TEST : `https://votre-app.vercel.app/api/stripe/webhook`
4. Cliquez sur **"Select events"**
5. Cochez ces événements :
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
6. Cliquez sur **"Add endpoint"**
7. ✅ **Copiez le Signing Secret** : `whsec_xxxxx`
8. Ajoutez-le dans `.env.local` ET dans Vercel :
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

---

## ✅ ÉTAPE 8 : Tester le Flux de Paiement

### Test en Local

1. **Démarrez le serveur** :
   ```bash
   npm run dev
   ```

2. **Allez sur la page pricing** : http://localhost:3000/pricing

3. **Cliquez sur "Choisir Premium"**

4. **Vous devriez être redirigé** vers Stripe Checkout

5. **Utilisez une carte de test** :
   - Numéro : `4242 4242 4242 4242`
   - Date : N'importe quelle date future
   - CVC : N'importe quel 3 chiffres
   - Code postal : N'importe lequel

6. **Complétez le paiement**

7. **Vérifiez dans Supabase** :
   ```sql
   SELECT * FROM user_subscriptions WHERE user_id = 'votre_user_id';
   ```

### Test avec Stripe CLI (Optionnel)

Pour tester les webhooks en local :

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copiez le webhook secret affiché et ajoutez-le dans `.env.local`.

---

## 📊 ÉTAPE 9 : Vérification Finale

### Checklist de Validation

- [ ] 2 produits créés dans Stripe (Premium + Conseil)
- [ ] 4 prix créés (2 par produit : mensuel + annuel)
- [ ] 4 Price IDs notés et sauvegardés
- [ ] Price IDs ajoutés dans Supabase (table subscription_plans)
- [ ] Variables d'environnement à jour dans `.env.local`
- [ ] Variables d'environnement à jour dans Vercel
- [ ] Webhook configuré dans Stripe
- [ ] Webhook secret ajouté dans les variables
- [ ] Test de paiement réussi
- [ ] Abonnement créé dans Supabase

---

## 🚀 ÉTAPE 10 : Passage en Production

### Quand vous êtes prêt pour le LIVE :

1. **Activez votre compte Stripe** (vérification identité)
2. **Créez les mêmes produits en mode LIVE** (pas TEST)
3. **Récupérez les nouveaux Price IDs** (ceux de production)
4. **Mettez à jour Vercel** avec les clés LIVE :
   ```
   STRIPE_PUBLISHABLE_KEY = pk_live_...
   STRIPE_SECRET_KEY = sk_live_...
   STRIPE_PREMIUM_MONTHLY_PRICE_ID = price_live_1xxxxx
   STRIPE_PREMIUM_ANNUAL_PRICE_ID = price_live_2yyyyy
   STRIPE_CONSEIL_MONTHLY_PRICE_ID = price_live_3zzzzz
   STRIPE_CONSEIL_ANNUAL_PRICE_ID = price_live_4wwwww
   ```
5. **Reconfigurez le webhook** avec l'URL de production
6. **Redéployez** l'application

---

## 💡 Notes Importantes

### Prix Affichés vs Prix Stripe

- **Site web** : Affiche 6,67€/mois et 41,67€/mois
- **Stripe** : Facture 79€/an et 499€/an
- **Correspondance** : 79€/12 = 6,58€/mois ≈ 6,67€ affiché

C'est normal ! L'affichage marketing peut arrondir légèrement.

### Gestion des Devises

Tous les prix sont en **EUR (Euro)**. Stripe gère automatiquement les conversions.

### Mode Test vs Live

- **Mode TEST** : Utilisez des cartes de test, aucun vrai argent
- **Mode LIVE** : Vrais paiements, vraies cartes bancaires

⚠️ **Commencez TOUJOURS en TEST** !

---

## 🆘 Dépannage

### Erreur : "Price ID not found"
➡️ Vérifiez que les Price IDs dans `.env.local` correspondent à ceux de Stripe

### Erreur : "No such customer"
➡️ Vérifiez que l'email utilisateur est valide

### Webhook non reçu
➡️ Vérifiez que l'URL du webhook est correcte  
➡️ Vérifiez que le Signing Secret est correct

### Abonnement pas créé dans Supabase
➡️ Vérifiez les logs du webhook  
➡️ Vérifiez que SUPABASE_SERVICE_ROLE_KEY est configuré

---

## 📞 Support

- **Stripe Docs** : https://stripe.com/docs/checkout
- **Stripe Dashboard** : https://dashboard.stripe.com
- **Supabase Docs** : https://supabase.com/docs

---

## ✅ Tâche Complétée Quand :

- [ ] Produits Stripe créés avec les bons prix
- [ ] Price IDs enregistrés dans Supabase
- [ ] Variables d'environnement configurées (local + Vercel)
- [ ] Webhook configuré et testé
- [ ] Test de paiement réussi
- [ ] Abonnement créé et visible dans Supabase

**Une fois tout validé, passez à la Task 3 : Feature Gates !** 🎯
