# Configuration Production pour NikahScore
# Guide de vérification avant déploiement

## ✅ VARIABLES D'ENVIRONNEMENT REQUISES

### 🔑 Supabase (OBLIGATOIRE)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://vhwdgjzjxrcglbmnjzot.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 🌐 Base URLs (OBLIGATOIRE)
```bash
NEXT_PUBLIC_BASE_URL=https://nikahscore.com
NEXT_PUBLIC_SITE_URL=https://nikahscore.com
```

### 📧 Email Service (OBLIGATOIRE)
```bash
RESEND_API_KEY=re_KNYV9TD1_28XG4Jy6EHkoeNqDUJoxQbsq
```

### 💳 Stripe (OBLIGATOIRE)
```bash
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 🔐 Security (OBLIGATOIRE)
```bash
JWT_SECRET=your_secure_jwt_secret_here
NODE_ENV=production
```

## ✅ CONFIGURATION SUPABASE

### Tables nécessaires :
- ✅ `profiles` (utilisateurs)
- ✅ `couples` (couples)
- ✅ `questionnaire_responses` (réponses)
- ✅ `analytics_events` (analytics)

### Politiques RLS :
- ✅ Les utilisateurs peuvent lire/écrire leurs propres profils
- ✅ Les couples peuvent partager questionnaires entre eux
- ✅ Analytics accessible en lecture seule

## ✅ CONFIGURATION STRIPE

### Produits requis :
1. **NikahScore Premium** (€9.99/mois)
   - Prix ID: `price_...`
   
2. **NikahScore Conseil** (€29.99)
   - Prix ID: `price_...`

### Webhook configuré :
- URL: `https://nikahscore.com/api/stripe/webhook`
- Événements: `checkout.session.completed`, `invoice.payment_succeeded`

## ✅ FONCTIONNALITÉS À TESTER EN PROD

### Authentification :
- [ ] Inscription utilisateur
- [ ] Connexion utilisateur  
- [ ] Redirection après login
- [ ] Email de confirmation
- [ ] Déconnexion

### Questionnaires :
- [ ] Création questionnaire
- [ ] Questionnaire partagé  
- [ ] Sauvegarde réponses
- [ ] Génération résultats

### Paiements :
- [ ] Page pricing
- [ ] Checkout Stripe
- [ ] Webhook traitement
- [ ] Accès premium

### Performance :
- [ ] Temps de chargement < 3s
- [ ] Images optimisées
- [ ] SEO meta tags
- [ ] Mobile responsive

## ✅ DÉPLOIEMENT VERCEL

### Variables d'environnement à configurer :
1. Copier toutes les variables depuis `.env.local`
2. Modifier les URLs pour la production
3. Utiliser les clés Stripe LIVE
4. Configurer le webhook Stripe avec la vraie URL

### Commandes :
```bash
# Build de production
npm run build

# Déploiement
vercel --prod
```

## ✅ DNS CONFIGURATION (OVH)

### Enregistrements à créer :
```
A     @     76.76.19.61      (IP Vercel)
CNAME www   nikahscore.com
```

## ✅ POST-DÉPLOIEMENT

### Tests critiques :
1. [ ] Page d'accueil accessible
2. [ ] Inscription/connexion fonctionnelle
3. [ ] Questionnaire complet testable
4. [ ] Paiement test en live
5. [ ] Emails envoyés correctement

### Monitoring :
- [ ] Supabase Dashboard : vérifier les logs
- [ ] Vercel Analytics : vérifier le trafic
- [ ] Stripe Dashboard : vérifier les paiements
- [ ] Resend Dashboard : vérifier les emails

---

**🚀 PRÊT POUR LE LANCEMENT OCTOBRE 2025 !**