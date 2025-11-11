-- ============================================
-- NETTOYAGE COMPLET AVANT MIGRATION
-- ============================================

-- Supprimer les tables existantes (dans l'ordre inverse des dépendances)
DROP TABLE IF EXISTS feature_usage CASCADE;
DROP TABLE IF EXISTS plan_features CASCADE;
DROP TABLE IF EXISTS user_subscriptions CASCADE;
DROP TABLE IF EXISTS features CASCADE;
DROP TABLE IF EXISTS subscription_plans CASCADE;

-- Supprimer la fonction si elle existe
DROP FUNCTION IF EXISTS check_feature_access(UUID, VARCHAR);

-- ============================================
-- PHASE 5 : SYSTÈME D'ABONNEMENTS PREMIUM
-- Version corrigée - 10 novembre 2025
-- ============================================

-- 1️⃣ Table des plans d'abonnement
CREATE TABLE subscription_plans (
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
CREATE TABLE user_subscriptions (
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
CREATE TABLE features (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4️⃣ Table de liaison plan-features
CREATE TABLE plan_features (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_name VARCHAR(50) NOT NULL,
  feature_code VARCHAR(50) NOT NULL REFERENCES features(code) ON DELETE CASCADE,
  is_unlimited BOOLEAN DEFAULT false,
  usage_limit INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(plan_name, feature_code)
);

-- 5️⃣ Table d'utilisation des features
CREATE TABLE feature_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_code VARCHAR(50) NOT NULL REFERENCES features(code) ON DELETE CASCADE,
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
CREATE POLICY "Plans publics" ON subscription_plans FOR SELECT TO authenticated USING (true);

-- user_subscriptions : Chaque user voit son abonnement
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users voient leur abonnement" ON user_subscriptions 
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- features : Lecture publique
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Features publiques" ON features FOR SELECT TO authenticated USING (true);

-- plan_features : Lecture publique
ALTER TABLE plan_features ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Plan features publiques" ON plan_features FOR SELECT TO authenticated USING (true);

-- feature_usage : Chaque user voit son usage
ALTER TABLE feature_usage ENABLE ROW LEVEL SECURITY;
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
  ('conseil', 'Conseil Premium', 'Accompagnement personnalisé + toutes les fonctionnalités', 49.99, 499.00, 3);

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
  ('leaderboard', 'Classement', 'Voir les meilleurs scores', 'free');

-- Liaison Plan-Features : FREE
INSERT INTO plan_features (plan_name, feature_code, is_unlimited, usage_limit) VALUES
  ('free', 'basic_questionnaire', true, NULL),
  ('free', 'unlimited_questionnaires', false, 1),
  ('free', 'leaderboard', true, NULL);

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
  ('premium', 'leaderboard', true, NULL);

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
  ('conseil', 'leaderboard', true, NULL);

-- ============================================
-- FONCTION : Vérifier l'accès à une feature
-- ============================================

CREATE FUNCTION check_feature_access(
  p_user_id UUID,
  p_feature_code VARCHAR
)
RETURNS TABLE (
  allowed BOOLEAN,
  reason VARCHAR,
  remaining INTEGER
) 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
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
$$;

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
WHERE id NOT IN (SELECT user_id FROM user_subscriptions);

-- ============================================
-- FIN DE LA MIGRATION
-- ============================================

SELECT 
  '✅ Migration Phase 5 terminée avec succès !' as message,
  (SELECT COUNT(*) FROM subscription_plans) as plans_count,
  (SELECT COUNT(*) FROM features) as features_count,
  (SELECT COUNT(*) FROM plan_features) as plan_features_count,
  (SELECT COUNT(*) FROM user_subscriptions) as users_with_subscription;
