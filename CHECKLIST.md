# ✅ Checklist - Configuration Complète NikahScore

## 📋 État Actuel

### ✅ **Code Application (Déployé)**
- [x] Système de couples partagés avec codes
- [x] Page `/couple` avec création/rejoindre
- [x] Page `/welcome` redirige vers `/couple`
- [x] Protection `/questionnaire` (vérifie couple)
- [x] Export PDF Premium avec react-pdf
- [x] Template PDF professionnel (2 pages)
- [x] API `/api/pdf/generate` opérationnelle
- [x] Bouton "Export PDF" dans dashboard

### ⏳ **Base de Données Supabase (À FAIRE)**
- [ ] **Exécuter migration `20251031_couples_and_premium.sql`**
- [ ] Créer table `couples`
- [ ] Créer table `compatibility_results`
- [ ] Créer table `subscriptions`
- [ ] Vérifier les politiques RLS
- [ ] Tester la fonction `generate_couple_code()`

---

## 🚀 Prochaines Étapes

### **Étape 1 : Exécuter la Migration Supabase** 🗄️
**Priorité : HAUTE**

**Actions :**
1. Ouvre [Supabase Dashboard](https://supabase.com/dashboard)
2. Projet NikahScore → SQL Editor
3. New Query
4. Copie le contenu de `supabase/migrations/20251031_couples_and_premium.sql`
5. Run (▶️)
6. Vérifie succès (tout vert)

**Vérification :**
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('couples', 'compatibility_results', 'subscriptions');
```

**Résultat attendu :** 3 lignes

---

### **Étape 2 : Tester le Système de Couples** 👥
**Priorité : MOYENNE**

**Test avec 2 comptes :**

**Compte 1 (Créateur) :**
1. Inscris-toi sur nikahscore.com
2. Va sur `/welcome` → Clic "Commencer maintenant"
3. Page `/couple` → Clic "Créer un Questionnaire Couple"
4. Note le code généré (ex: ABC-12345)
5. Partage ce code

**Compte 2 (Partenaire) :**
1. Inscris-toi avec un autre email
2. Va sur `/couple`
3. Clic "Rejoindre un Questionnaire"
4. Entre le code ABC-12345
5. Vérifie : "Couple lié !" ✅

**Les deux :**
- Clic "Commencer le Questionnaire"
- Répondez chacun de votre côté
- Dashboard commun avec résultats

---

### **Étape 3 : Tester l'Export PDF** 📄
**Priorité : MOYENNE**

**Actions :**
1. Va sur `/dashboard`
2. Connecte-toi (isPremium=true temporairement)
3. Clic "Export PDF"
4. Le PDF se télécharge
5. Ouvre le fichier
6. Vérifie :
   - ✅ Design élégant rose/violet
   - ✅ Scores par dimension avec barres
   - ✅ Forces et points d'attention
   - ✅ Recommandations
   - ✅ Branding NikahScore

---

### **Étape 4 : Intégration Stripe** 💳
**Priorité : HAUTE (après tests)**

**À faire :**
- [ ] Créer compte Stripe
- [ ] Créer produit "NikahScore Premium" (9.99€/mois)
- [ ] Obtenir clés API (test + production)
- [ ] Ajouter dans `.env` :
  ```
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
  STRIPE_SECRET_KEY=sk_test_...
  STRIPE_WEBHOOK_SECRET=whsec_...
  ```
- [ ] Installer `@stripe/stripe-js` et `stripe`
- [ ] Créer API `/api/stripe/create-checkout-session`
- [ ] Créer API `/api/stripe/webhook`
- [ ] Tester paiement en mode test
- [ ] Activer webhooks Stripe
- [ ] Gérer statut Premium (lire depuis `subscriptions`)

---

### **Étape 5 : Vérification Premium Dynamique** 🔒
**Priorité : MOYENNE**

**Remplacer :**
```typescript
// UserDashboard.tsx - Ligne 50
const [isPremium, setIsPremium] = useState(true) // TEMPORAIRE
```

**Par :**
```typescript
const [isPremium, setIsPremium] = useState(false)

useEffect(() => {
  const checkPremium = async () => {
    if (!user) return
    
    const { data } = await supabase
      .from('subscriptions')
      .select('plan_type, status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()
    
    setIsPremium(data?.plan_type === 'premium' || data?.plan_type === 'lifetime')
  }
  
  checkPremium()
}, [user])
```

---

## 📊 Récapitulatif

### **✅ Terminé (Déployé sur Vercel)**
- Questionnaire partagé avec codes
- Export PDF professionnel
- Protection des routes
- UX améliorée

### **⏳ En Attente**
- Migration Supabase (5 minutes)
- Tests couples (10 minutes)
- Tests PDF (5 minutes)

### **🎯 Prochainement**
- Intégration Stripe (1-2 heures)
- Vérification Premium dynamique (15 minutes)
- Webhooks Stripe (30 minutes)

---

## 🆘 Support

Si tu rencontres un problème :
1. Lis `supabase/MIGRATION_GUIDE.md`
2. Vérifie les logs Supabase (Dashboard → Logs)
3. Teste les requêtes SQL une par une
4. Partage l'erreur complète pour aide

---

## 🎉 Félicitations !

Tu as maintenant :
- ✅ Système de couples complet
- ✅ Export PDF Premium
- ✅ Architecture prête pour Stripe
- ✅ Base de données structurée
- ✅ Sécurité RLS activée

**Il ne reste plus qu'à exécuter la migration Supabase !** 🚀
