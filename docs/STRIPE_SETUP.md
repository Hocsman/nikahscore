# Guide Configuration Stripe - NikahScore

## 🎯 Variables d'environnement à ajouter à Vercel

### 1. Variables Stripe (obligatoires)
```bash
STRIPE_PUBLISHABLE_KEY=pk_live_... ou pk_test_...
STRIPE_SECRET_KEY=sk_live_... ou sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# IDs des produits Stripe à créer
STRIPE_PREMIUM_PRICE_ID=price_...
STRIPE_CONSEIL_PRICE_ID=price_...
```

## 🏪 Configuration produits Stripe

### 1. Créer les produits dans Stripe Dashboard

**Produit Premium :**
- Nom: "NikahScore Premium"
- Prix: 9,99€/mois
- Récurrent: mensuel
- Métadonnées: `plan: premium`

**Produit Conseil :**
- Nom: "NikahScore Conseil"  
- Prix: 49,99€/mois
- Récurrent: mensuel
- Métadonnées: `plan: conseil`

### 2. Webhook Stripe
URL: `https://nikahscore-platform.vercel.app/api/stripe/webhook`
Événements:
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

## 🗄️ Migration Supabase

Exécuter le fichier de migration :
```sql
-- Le fichier supabase/migrations/20240916_stripe_integration.sql
-- Ajoute les tables stripe_customers, stripe_sessions, transactions
-- Et les colonnes subscription_* à la table users
```

## 🧪 Test en local

1. Installer Stripe CLI
2. Configurer webhook local:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
3. Ajouter STRIPE_WEBHOOK_SECRET à .env.local
4. Tester avec cartes de test Stripe

## 📊 Vérifications

✅ Variables Stripe configurées
✅ Produits créés dans Stripe Dashboard  
✅ Webhook configuré et testé
✅ Migration Supabase exécutée
✅ Tests de paiement fonctionnels

## 🚀 Déploiement

1. Ajouter toutes les variables à Vercel
2. Redéployer l'application
3. Configurer webhook production
4. Tester un paiement en production

---

💡 **Conseil** : Commencer par configurer en mode test (pk_test_*, sk_test_*) 
puis basculer en production une fois tous les tests validés !
