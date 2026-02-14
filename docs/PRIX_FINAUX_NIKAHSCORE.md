# 💰 Prix Finaux NikahScore - Alignés avec le Site Web

## ✅ Structure de Prix Validée

### Plan 1 : Gratuit 🆓
**Prix** : 0€/mois  
**Positionnement** : Découverte gratuite

### Plan 2 : Premium ⭐
**Prix mensuel** : 6,67€/mois  
**Prix annuel** : 79€/an  
**Économie** : 33% (vs 12 x 6,67€ = 80,04€)  
**Positionnement** : Pour une analyse approfondie

### Plan 3 : Conseil Premium 👑
**Prix mensuel** : 41,67€/mois  
**Prix annuel** : 499€/an  
**Économie** : 17% (vs 12 x 41,67€ = 500,04€)  
**Positionnement** : Avec accompagnement personnel

---

## 📊 Tableau Comparatif Final

| Plan | Prix Mensuel | Prix Annuel | Économie | Stripe Product |
|------|--------------|-------------|----------|----------------|
| **Gratuit** | 0€ | 0€ | - | - |
| **Premium** | 6,67€ | 79€ | **33%** | À configurer |
| **Conseil** | 41,67€ | 499€ | 17% | À créer |

---

## 🎯 Avantages de Cette Stratégie

### 1. Prix Premium très attractif (6,67€)
✅ **Accessible** : Entrée de gamme à moins de 7€/mois  
✅ **Économie forte** : 33% de réduction incite à prendre l'annuel  
✅ **Psychologie** : 79€/an < 80€ (sous la barre psychologique)  
✅ **Compétitif** : Moins cher que Muzz, Salams, etc.

### 2. Prix Conseil toujours premium (41,67€)
✅ **Exclusif** : x6 le prix Premium justifié par le coaching  
✅ **Margin** : 499€/an = bon revenu par utilisateur  
✅ **Perception** : Sous les 500€/an = accessible pour du coaching  
✅ **Différenciation** : Service unique sur le marché musulman

### 3. Cohérence avec le site
✅ **Aucun changement** à faire sur le front-end  
✅ **Confiance** : Prix déjà communiqués aux visiteurs  
✅ **SEO/Marketing** : Contenus déjà optimisés avec ces prix

---

## 💳 Configuration Stripe Requise

### Produit 1 : Premium
**À configurer dans Stripe Dashboard :**

1. Créer/Modifier le produit "NikahScore Premium"
2. Ajouter 2 prix :
   - **Prix mensuel** : 6,67€ (récurrent/mois)
   - **Prix annuel** : 79€ (récurrent/an)
3. Récupérer les Price IDs :
   - `price_xxxxx` (monthly)
   - `price_yyyyy` (yearly)

### Produit 2 : Conseil Premium
**À créer dans Stripe Dashboard :**

1. Créer le produit "NikahScore Conseil Premium"
2. Ajouter 2 prix :
   - **Prix mensuel** : 41,67€ (récurrent/mois)
   - **Prix annuel** : 499€ (récurrent/an)
3. Récupérer les Price IDs :
   - `price_zzzzz` (monthly)
   - `price_wwwww` (yearly)

### Mise à jour Supabase avec les Price IDs

Une fois les produits créés sur Stripe, exécutez :

```sql
-- Mettre à jour avec les vrais Price IDs de Stripe
UPDATE subscription_plans 
SET 
  stripe_price_id_monthly = 'price_VOTRE_ID_MENSUEL_PREMIUM',
  stripe_price_id_yearly = 'price_VOTRE_ID_ANNUEL_PREMIUM'
WHERE name = 'premium';

UPDATE subscription_plans 
SET 
  stripe_price_id_monthly = 'price_VOTRE_ID_MENSUEL_CONSEIL',
  stripe_price_id_yearly = 'price_VOTRE_ID_ANNUEL_CONSEIL'
WHERE name = 'conseil';
```

---

## 🔄 Migration SQL à Exécuter

**Fichier** : `supabase/migrations/20251110_fix_to_conseil_plan.sql` (MIS À JOUR)

Cette migration va maintenant :
1. ✅ Renommer les plans (premium → conseil, essential → premium)
2. ✅ Appliquer les bons prix (6,67€ et 41,67€)
3. ✅ Ajouter les 4 features exclusives Conseil
4. ✅ Mapper les features aux plans

### Vérification après migration :

```sql
SELECT 
  name, 
  display_name, 
  price_monthly,
  price_yearly,
  ROUND((price_yearly / 12), 2) as monthly_equivalent,
  ROUND((1 - (price_yearly / (price_monthly * 12))) * 100, 0) as discount_percent
FROM subscription_plans 
ORDER BY sort_order;
```

**Résultat attendu** :
```
name    | display_name     | price_monthly | price_yearly | monthly_equivalent | discount_percent
--------|------------------|---------------|--------------|-------------------|------------------
free    | Gratuit          | 0.00          | 0.00         | 0.00              | 0
premium | Premium          | 6.67          | 79.00        | 6.58              | 33
conseil | Conseil Premium  | 41.67         | 499.00       | 41.58             | 17
```

---

## 📈 Projection de Revenus

### Scénario conservateur (sur 100 utilisateurs actifs)

**Répartition estimée** :
- 60% Gratuit = 60 utilisateurs → 0€
- 35% Premium = 35 utilisateurs → 35 x 79€ = **2 765€/an**
- 5% Conseil = 5 utilisateurs → 5 x 499€ = **2 495€/an**

**Total** : **5 260€/an** pour 100 utilisateurs actifs  
**ARPU** (Average Revenue Per User) : **52,60€/an**

### Avec 1000 utilisateurs actifs :
- 350 Premium = **27 650€/an**
- 50 Conseil = **24 950€/an**
- **Total** : **52 600€/an**

---

## ✅ Checklist de Validation

### Avant de passer à l'intégration Stripe :

- [ ] Migration SQL exécutée sur Supabase
- [ ] 3 plans visibles avec bons prix (0€, 6.67€, 41.67€)
- [ ] 24 features au total (20 base + 4 Conseil)
- [ ] Dashboard affiche le bon badge
- [ ] Build Vercel réussi

### Configuration Stripe :

- [ ] Produit Premium créé (6,67€ et 79€)
- [ ] Produit Conseil créé (41,67€ et 499€)
- [ ] Price IDs récupérés
- [ ] Price IDs ajoutés dans Supabase
- [ ] Webhook URL configurée
- [ ] Variables d'environnement Stripe en place

---

## 🚀 Prochaines Étapes

1. **Exécuter la migration** : `20251110_fix_to_conseil_plan.sql`
2. **Créer les produits Stripe** avec les prix corrects
3. **Implémenter le checkout flow** (Task 2)
4. **Ajouter les feature gates** (Task 3)
5. **Finaliser la page /pricing** (Task 4)

---

## 💡 Notes Importantes

- Prix **alignés avec le site** = cohérence marketing ✅
- Économie de **33% sur Premium** = fort incentive pour l'annuel 💰
- Prix **Conseil sous 500€/an** = psychologie du pricing 🧠
- Ratio **x6** entre Premium et Conseil = justifié par le coaching 👔

**Conseil** : Mettez en avant l'économie de 33% sur le plan Premium dans tous vos tunnels de conversion !
