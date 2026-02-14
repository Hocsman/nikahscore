# 🚨 FIX URGENT - Base de données Production

## 📊 DIAGNOSTIC

**Date** : 10 novembre 2025  
**Problème** : Tables Premium (Phase 5) manquantes en production  
**Impact** : FeatureGate ne peut pas fonctionner

### Erreurs constatées :
```
❌ Could not find a relationship between 'user_subscriptions' and 'subscription_plans'
❌ column couples.user_a_id does not exist
❌ Cannot coerce the result to a single JSON object (profiles)
```

---

## 🎯 SOLUTION EN 3 ÉTAPES

### ÉTAPE 1 : Ouvrir Supabase SQL Editor

1. **Allez sur** : https://supabase.com/dashboard
2. **Sélectionnez** votre projet NikahScore
3. **Cliquez** sur "SQL Editor" dans le menu latéral

---

### ÉTAPE 2 : Exécuter la migration principale

**Copiez ce SQL complet** et exécutez-le :

```sql
-- ============================================
-- PHASE 5 : SYSTÈME D'ABONNEMENTS PREMIUM
-- ============================================

-- 1️⃣ Table des plans d'abonnement
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_yearly DECIMAL(10,2),
  stripe_price_id_monthly VARCHAR(100),
  stripe_price_id_yearly VARCHAR(100),
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2️⃣ Table des abonnements utilisateurs
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_code VARCHAR(50) NOT NULL DEFAULT 'free',
  stripe_customer_id VARCHAR(100),
  stripe_subscription_id VARCHAR(100),
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  billing_cycle VARCHAR(20) DEFAULT 'monthly',
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 3️⃣ Table des features disponibles
CREATE TABLE IF NOT EXISTS features (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4️⃣ Table de liaison plan-features
CREATE TABLE IF NOT EXISTS plan_features (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_name VARCHAR(50) NOT NULL,
  feature_code VARCHAR(50) NOT NULL REFERENCES features(code),
  is_unlimited BOOLEAN DEFAULT false,
  usage_limit INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(plan_name, feature_code)
);

-- 5️⃣ Table d'utilisation des features
CREATE TABLE IF NOT EXISTS feature_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_code VARCHAR(50) NOT NULL REFERENCES features(code),
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE,
  reset_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, feature_code)
);

-- ============================================
-- RLS POLICIES
-- ============================================

-- subscription_plans : Lecture publique
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Plans publics" ON subscription_plans;
CREATE POLICY "Plans publics" ON subscription_plans FOR SELECT TO authenticated USING (true);

-- user_subscriptions : Chaque user voit son abonnement
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users voient leur abonnement" ON user_subscriptions;
CREATE POLICY "Users voient leur abonnement" ON user_subscriptions 
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- features : Lecture publique
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Features publiques" ON features;
CREATE POLICY "Features publiques" ON features FOR SELECT TO authenticated USING (true);

-- plan_features : Lecture publique
ALTER TABLE plan_features ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Plan features publiques" ON plan_features;
CREATE POLICY "Plan features publiques" ON plan_features FOR SELECT TO authenticated USING (true);

-- feature_usage : Chaque user voit son usage
ALTER TABLE feature_usage ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users voient leur usage" ON feature_usage;
CREATE POLICY "Users voient leur usage" ON feature_usage 
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- ============================================
-- INSERTION DES DONNÉES PAR DÉFAUT
-- ============================================

-- Plans d'abonnement
INSERT INTO subscription_plans (name, display_name, description, price_monthly, price_yearly, sort_order)
VALUES
  ('free', 'Gratuit', 'Plan gratuit avec fonctionnalités de base', 0.00, 0.00, 1),
  ('premium', 'Premium', 'Accès complet aux fonctionnalités avancées', 9.99, 79.00, 2),
  ('conseil', 'Conseil Premium', 'Accompagnement personnalisé + toutes les fonctionnalités', 49.99, 499.00, 3)
ON CONFLICT (name) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  price_monthly = EXCLUDED.price_monthly,
  price_yearly = EXCLUDED.price_yearly;

-- Features disponibles (24 features)
INSERT INTO features (code, name, description, category) VALUES
  ('basic_questionnaire', 'Questionnaire de base', 'Questionnaire de compatibilité standard', 'core'),
  ('unlimited_questionnaires', 'Questionnaires illimités', 'Créer un nombre illimité de tests', 'premium'),
  ('advanced_questions', 'Questions avancées', 'Accès aux questions approfondies', 'premium'),
  ('pdf_export', 'Export PDF', 'Télécharger les résultats en PDF', 'premium'),
  ('detailed_analysis', 'Analyse détaillée', 'Rapport complet de compatibilité', 'premium'),
  ('compatibility_trends', 'Tendances de compatibilité', 'Graphiques d''évolution', 'premium'),
  ('priority_support', 'Support prioritaire', 'Réponses en 24h', 'premium'),
  ('ai_recommendations', 'Recommandations IA', 'Suggestions personnalisées par IA', 'premium'),
  ('coach_access', 'Accès coach matrimonial', 'Séances avec un expert', 'conseil'),
  ('personalized_action_plan', 'Plan d''action personnalisé', 'Feuille de route sur mesure', 'conseil'),
  ('monthly_followup', 'Suivi mensuel', 'Points réguliers avec coach', 'conseil'),
  ('unlimited_revisions', 'Révisions illimitées', 'Modifications de profil sans limite', 'conseil'),
  ('custom_branding', 'Branding personnalisé', 'PDF aux couleurs du couple', 'conseil'),
  ('video_analysis', 'Analyse vidéo', 'Consultation vidéo de 30min', 'conseil'),
  ('comparison_feature', 'Comparaison avancée', 'Comparer plusieurs partenaires', 'premium'),
  ('relationship_goals', 'Objectifs de couple', 'Définir et suivre vos objectifs', 'premium'),
  ('communication_tips', 'Conseils communication', 'Améliorer votre dialogue', 'premium'),
  ('conflict_resolution', 'Gestion des conflits', 'Stratégies de résolution', 'conseil'),
  ('financial_planning', 'Planification financière', 'Gestion budget de couple', 'conseil'),
  ('family_integration', 'Intégration familiale', 'Conseils belle-famille', 'conseil'),
  ('cultural_compatibility', 'Compatibilité culturelle', 'Analyse approfondie des valeurs', 'conseil'),
  ('pre_marriage_workshop', 'Atelier pré-mariage', 'Formation en ligne', 'conseil'),
  ('anonymous_mode', 'Mode anonyme', 'Tests sans identification', 'premium'),
  ('leaderboard', 'Classement', 'Voir les meilleurs scores', 'free')
ON CONFLICT (code) DO NOTHING;

-- Liaison Plan-Features : FREE
INSERT INTO plan_features (plan_name, feature_code, is_unlimited, usage_limit) VALUES
  ('free', 'basic_questionnaire', true, NULL),
  ('free', 'unlimited_questionnaires', false, 1),
  ('free', 'leaderboard', true, NULL)
ON CONFLICT (plan_name, feature_code) DO NOTHING;

-- Liaison Plan-Features : PREMIUM
INSERT INTO plan_features (plan_name, feature_code, is_unlimited, usage_limit) VALUES
  ('premium', 'basic_questionnaire', true, NULL),
  ('premium', 'unlimited_questionnaires', true, NULL),
  ('premium', 'advanced_questions', true, NULL),
  ('premium', 'pdf_export', false, 10),
  ('premium', 'detailed_analysis', true, NULL),
  ('premium', 'compatibility_trends', true, NULL),
  ('premium', 'priority_support', true, NULL),
  ('premium', 'ai_recommendations', true, NULL),
  ('premium', 'comparison_feature', true, NULL),
  ('premium', 'relationship_goals', true, NULL),
  ('premium', 'communication_tips', true, NULL),
  ('premium', 'anonymous_mode', true, NULL),
  ('premium', 'leaderboard', true, NULL)
ON CONFLICT (plan_name, feature_code) DO NOTHING;

-- Liaison Plan-Features : CONSEIL
INSERT INTO plan_features (plan_name, feature_code, is_unlimited, usage_limit) VALUES
  ('conseil', 'basic_questionnaire', true, NULL),
  ('conseil', 'unlimited_questionnaires', true, NULL),
  ('conseil', 'advanced_questions', true, NULL),
  ('conseil', 'pdf_export', true, NULL),
  ('conseil', 'detailed_analysis', true, NULL),
  ('conseil', 'compatibility_trends', true, NULL),
  ('conseil', 'priority_support', true, NULL),
  ('conseil', 'ai_recommendations', true, NULL),
  ('conseil', 'coach_access', true, NULL),
  ('conseil', 'personalized_action_plan', true, NULL),
  ('conseil', 'monthly_followup', true, NULL),
  ('conseil', 'unlimited_revisions', true, NULL),
  ('conseil', 'custom_branding', true, NULL),
  ('conseil', 'video_analysis', true, NULL),
  ('conseil', 'comparison_feature', true, NULL),
  ('conseil', 'relationship_goals', true, NULL),
  ('conseil', 'communication_tips', true, NULL),
  ('conseil', 'conflict_resolution', true, NULL),
  ('conseil', 'financial_planning', true, NULL),
  ('conseil', 'family_integration', true, NULL),
  ('conseil', 'cultural_compatibility', true, NULL),
  ('conseil', 'pre_marriage_workshop', true, NULL),
  ('conseil', 'anonymous_mode', true, NULL),
  ('conseil', 'leaderboard', true, NULL)
ON CONFLICT (plan_name, feature_code) DO NOTHING;

-- ============================================
-- FONCTION : Vérifier l'accès à une feature
-- ============================================

CREATE OR REPLACE FUNCTION check_feature_access(
  p_user_id UUID,
  p_feature_code VARCHAR
)
RETURNS TABLE (
  allowed BOOLEAN,
  reason VARCHAR,
  remaining INTEGER
) AS $$
DECLARE
  v_plan_code VARCHAR;
  v_is_unlimited BOOLEAN;
  v_usage_limit INTEGER;
  v_current_usage INTEGER;
BEGIN
  -- Récupérer le plan de l'utilisateur
  SELECT COALESCE(plan_code, 'free')
  INTO v_plan_code
  FROM user_subscriptions
  WHERE user_id = p_user_id AND status = 'active'
  LIMIT 1;
  
  -- Si pas d'abonnement, considérer comme gratuit
  IF v_plan_code IS NULL THEN
    v_plan_code := 'free';
  END IF;
  
  -- Vérifier si la feature est disponible pour ce plan
  SELECT is_unlimited, usage_limit
  INTO v_is_unlimited, v_usage_limit
  FROM plan_features
  WHERE plan_name = v_plan_code AND feature_code = p_feature_code
  LIMIT 1;
  
  -- Si feature pas trouvée pour ce plan = bloqué
  IF v_is_unlimited IS NULL THEN
    RETURN QUERY SELECT false, 'feature_not_in_plan'::VARCHAR, 0;
    RETURN;
  END IF;
  
  -- Si illimité = autorisé
  IF v_is_unlimited THEN
    RETURN QUERY SELECT true, 'unlimited'::VARCHAR, -1;
    RETURN;
  END IF;
  
  -- Sinon, vérifier l'usage
  SELECT COALESCE(usage_count, 0)
  INTO v_current_usage
  FROM feature_usage
  WHERE user_id = p_user_id AND feature_code = p_feature_code;
  
  -- Comparer avec la limite
  IF v_current_usage < v_usage_limit THEN
    RETURN QUERY SELECT true, 'within_limit'::VARCHAR, (v_usage_limit - v_current_usage);
  ELSE
    RETURN QUERY SELECT false, 'limit_reached'::VARCHAR, 0;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- AJOUTER LES PRIX STRIPE
-- ============================================

UPDATE subscription_plans 
SET 
  stripe_price_id_monthly = 'price_1SQxavEOiMGm6qlDldkN0PL7',
  stripe_price_id_yearly = 'price_1SQxavEOiMGm6qlD79PRxb4t'
WHERE name = 'premium';

UPDATE subscription_plans 
SET 
  stripe_price_id_monthly = 'price_1SQxbfEOiMGm6qlDwOpwYYEg',
  stripe_price_id_yearly = 'price_1SQxcJEOiMGm6qlDp91uLFxm'
WHERE name = 'conseil';

-- ============================================
-- INITIALISER TOUS LES USERS EXISTANTS
-- ============================================

INSERT INTO user_subscriptions (user_id, plan_code, status)
SELECT id, 'free', 'active'
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_subscriptions)
ON CONFLICT (user_id) DO NOTHING;

-- ============================================
-- FIN DE LA MIGRATION
-- ============================================

SELECT 
  'Migration Phase 5 terminée !' as message,
  (SELECT COUNT(*) FROM subscription_plans) as plans_count,
  (SELECT COUNT(*) FROM features) as features_count,
  (SELECT COUNT(*) FROM plan_features) as plan_features_count,
  (SELECT COUNT(*) FROM user_subscriptions) as users_with_subscription;
```

---

### ÉTAPE 3 : Vérifier que tout fonctionne

Après avoir exécuté le SQL ci-dessus, **vérifiez** :

```sql
-- ✅ Vérifier les plans
SELECT name, price_monthly, price_yearly, stripe_price_id_monthly 
FROM subscription_plans 
ORDER BY sort_order;

-- ✅ Vérifier les features
SELECT COUNT(*) as total_features FROM features;

-- ✅ Vérifier votre abonnement
SELECT user_id, plan_code, status 
FROM user_subscriptions 
WHERE user_id = auth.uid();

-- ✅ Tester la fonction
SELECT * FROM check_feature_access(auth.uid(), 'pdf_export');
```

**Résultats attendus** :
- 3 plans (free, premium, conseil)
- 24 features
- Votre user_id avec plan_code='free' et status='active'
- Function retourne `allowed=false` et `reason='feature_not_in_plan'`

---

## 📊 RÉSULTAT ATTENDU

Après cette migration :

✅ Tables créées : 5 (subscription_plans, user_subscriptions, features, plan_features, feature_usage)  
✅ Plans insérés : 3 (free, premium, conseil)  
✅ Features insérées : 24  
✅ Plan-features : 40+ relations  
✅ RLS Policies : Actives  
✅ Fonction : check_feature_access() créée  
✅ Tous les users : Abonnés au plan gratuit

---

## 🔄 APRÈS LA MIGRATION

**Rechargez votre page Dashboard** (F5) et :

1. **La console devrait être propre** (0 erreurs 400)
2. **Le bouton "Export PDF" devrait apparaître**
3. **Le badge "🔒 Premium" devrait être visible**
4. **Le modal devrait s'ouvrir au clic**

---

## 🆘 SI ÇA NE MARCHE TOUJOURS PAS

1. **Vérifiez dans Supabase** → Table Editor → Cherchez `subscription_plans`
2. **Si la table n'existe pas** → Réexécutez le SQL ci-dessus
3. **Si erreur SQL** → Copiez l'erreur et contactez-moi
4. **Si tout est OK** → Redémarrez Vercel : Settings → Redeploy

---

**📞 Besoin d'aide ?** Dites-moi à quelle étape vous êtes bloqué !
