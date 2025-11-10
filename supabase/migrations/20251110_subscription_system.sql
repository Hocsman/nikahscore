-- Migration : Système d'abonnements Premium
-- Créé le : 2025-11-10
-- Description : Tables pour gestion des plans et abonnements

-- Table des plans d'abonnement disponibles
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

-- Table des abonnements utilisateurs
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  stripe_customer_id VARCHAR(100),
  stripe_subscription_id VARCHAR(100),
  status VARCHAR(20) NOT NULL DEFAULT 'inactive',
  -- Status: active, inactive, cancelled, past_due, trialing
  billing_cycle VARCHAR(20) NOT NULL DEFAULT 'monthly',
  -- Billing cycle: monthly, yearly
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

-- Table des features disponibles
CREATE TABLE IF NOT EXISTS features (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table de mapping : quels plans ont accès à quelles features
CREATE TABLE IF NOT EXISTS plan_features (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id) ON DELETE CASCADE,
  feature_code VARCHAR(50) NOT NULL REFERENCES features(code) ON DELETE CASCADE,
  limit_value INTEGER,
  -- Pour les features avec limite (ex: 10 questionnaires/mois)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(plan_id, feature_code)
);

-- Table de tracking d'utilisation des features
CREATE TABLE IF NOT EXISTS feature_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_code VARCHAR(50) NOT NULL,
  usage_count INTEGER DEFAULT 0,
  last_reset_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  period_type VARCHAR(20) DEFAULT 'monthly',
  -- monthly, yearly, lifetime
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, feature_code, period_type)
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe ON user_subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_plan_features_plan ON plan_features(plan_id);
CREATE INDEX IF NOT EXISTS idx_plan_features_feature ON plan_features(feature_code);
CREATE INDEX IF NOT EXISTS idx_feature_usage_user ON feature_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_feature_usage_feature ON feature_usage(feature_code);

-- RLS Policies
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_usage ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut voir les plans disponibles
CREATE POLICY "Plans are viewable by everyone" ON subscription_plans
  FOR SELECT USING (is_active = true);

-- Les utilisateurs peuvent voir leur propre abonnement
CREATE POLICY "Users can view their own subscription" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Tout le monde peut voir les features disponibles
CREATE POLICY "Features are viewable by everyone" ON features
  FOR SELECT USING (is_active = true);

-- Tout le monde peut voir les features des plans
CREATE POLICY "Plan features are viewable by everyone" ON plan_features
  FOR SELECT USING (true);

-- Les utilisateurs peuvent voir leur propre usage
CREATE POLICY "Users can view their own usage" ON feature_usage
  FOR SELECT USING (auth.uid() = user_id);

-- Seul le service peut gérer les abonnements et l'usage
CREATE POLICY "Service can manage subscriptions" ON user_subscriptions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service can manage usage" ON feature_usage
  FOR ALL USING (auth.role() = 'service_role');

-- Insérer les plans par défaut
INSERT INTO subscription_plans (name, display_name, description, price_monthly, price_yearly, sort_order) VALUES
  ('free', 'Gratuit', 'Découvrez NikahScore avec les fonctionnalités de base', 0.00, 0.00, 1),
  ('essential', 'Essentiel', 'Idéal pour les célibataires sérieux dans leur recherche', 9.99, 99.99, 2),
  ('premium', 'Premium', 'Accès complet pour maximiser vos chances de trouver le bon match', 19.99, 199.99, 3)
ON CONFLICT (name) DO NOTHING;

-- Insérer les features disponibles
INSERT INTO features (code, name, description, category) VALUES
  -- Questionnaires
  ('basic_questionnaire', 'Questionnaire de base', 'Accès au questionnaire de compatibilité (100 questions)', 'questionnaire'),
  ('unlimited_questionnaires', 'Questionnaires illimités', 'Créez autant de questionnaires que vous voulez', 'questionnaire'),
  ('advanced_questions', 'Questions avancées', 'Accès aux questions approfondies sur la finance, les rôles, etc.', 'questionnaire'),
  
  -- Résultats et analyses
  ('basic_results', 'Résultats de base', 'Voir le score global de compatibilité', 'results'),
  ('detailed_analysis', 'Analyse détaillée', 'Analyse complète par dimensions avec points forts et faibles', 'results'),
  ('ai_recommendations', 'Recommandations IA', 'Conseils personnalisés basés sur l''IA', 'results'),
  ('compatibility_trends', 'Tendances de compatibilité', 'Évolution de vos scores au fil du temps', 'results'),
  
  -- Export et partage
  ('pdf_export', 'Export PDF', 'Téléchargez vos rapports en PDF professionnel', 'export'),
  ('share_results', 'Partage de résultats', 'Partagez vos résultats par WhatsApp, Email, etc.', 'export'),
  ('custom_branding', 'Personnalisation', 'Personnalisez vos rapports avec votre branding', 'export'),
  
  -- Support et priorité
  ('email_support', 'Support par email', 'Support par email sous 48h', 'support'),
  ('priority_support', 'Support prioritaire', 'Réponse en moins de 24h', 'support'),
  ('dedicated_support', 'Support dédié', 'Coach matrimonial dédié', 'support'),
  
  -- Gamification
  ('basic_achievements', 'Badges de base', 'Débloquez des badges pour vos accomplissements', 'gamification'),
  ('all_achievements', 'Tous les badges', 'Accès à tous les badges exclusifs Premium', 'gamification'),
  ('leaderboard', 'Classement', 'Comparez-vous aux autres utilisateurs', 'gamification'),
  
  -- Partenaire
  ('couple_mode', 'Mode couple', 'Invitez votre partenaire à répondre au questionnaire', 'couple'),
  ('couple_insights', 'Insights couple', 'Analyses approfondies de votre relation', 'couple'),
  ('compatibility_tracking', 'Suivi de compatibilité', 'Suivez l''évolution de votre relation', 'couple')
ON CONFLICT (code) DO NOTHING;

-- Mapper les features aux plans
INSERT INTO plan_features (plan_id, feature_code, limit_value) VALUES
  -- Plan Gratuit
  ((SELECT id FROM subscription_plans WHERE name = 'free'), 'basic_questionnaire', 1),
  ((SELECT id FROM subscription_plans WHERE name = 'free'), 'basic_results', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'free'), 'share_results', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'free'), 'basic_achievements', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'free'), 'couple_mode', 1),
  ((SELECT id FROM subscription_plans WHERE name = 'free'), 'email_support', NULL),
  
  -- Plan Essentiel
  ((SELECT id FROM subscription_plans WHERE name = 'essential'), 'basic_questionnaire', 5),
  ((SELECT id FROM subscription_plans WHERE name = 'essential'), 'unlimited_questionnaires', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'essential'), 'advanced_questions', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'essential'), 'basic_results', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'essential'), 'detailed_analysis', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'essential'), 'ai_recommendations', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'essential'), 'pdf_export', 10),
  ((SELECT id FROM subscription_plans WHERE name = 'essential'), 'share_results', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'essential'), 'basic_achievements', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'essential'), 'all_achievements', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'essential'), 'couple_mode', 3),
  ((SELECT id FROM subscription_plans WHERE name = 'essential'), 'couple_insights', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'essential'), 'priority_support', NULL),
  
  -- Plan Premium
  ((SELECT id FROM subscription_plans WHERE name = 'premium'), 'basic_questionnaire', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'premium'), 'unlimited_questionnaires', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'premium'), 'advanced_questions', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'premium'), 'basic_results', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'premium'), 'detailed_analysis', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'premium'), 'ai_recommendations', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'premium'), 'compatibility_trends', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'premium'), 'pdf_export', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'premium'), 'share_results', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'premium'), 'custom_branding', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'premium'), 'basic_achievements', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'premium'), 'all_achievements', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'premium'), 'leaderboard', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'premium'), 'couple_mode', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'premium'), 'couple_insights', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'premium'), 'compatibility_tracking', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'premium'), 'dedicated_support', NULL)
ON CONFLICT (plan_id, feature_code) DO NOTHING;

-- Fonction pour attribuer automatiquement le plan gratuit aux nouveaux utilisateurs
CREATE OR REPLACE FUNCTION assign_free_plan_to_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_subscriptions (user_id, plan_id, status)
  VALUES (
    NEW.id,
    (SELECT id FROM subscription_plans WHERE name = 'free' LIMIT 1),
    'active'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour attribuer le plan gratuit automatiquement
DROP TRIGGER IF EXISTS on_user_created_assign_free_plan ON auth.users;
CREATE TRIGGER on_user_created_assign_free_plan
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION assign_free_plan_to_new_user();

-- Fonction pour vérifier si un utilisateur a accès à une feature
CREATE OR REPLACE FUNCTION check_feature_access(
  p_user_id UUID,
  p_feature_code VARCHAR
)
RETURNS TABLE(
  has_access BOOLEAN,
  limit_value INTEGER,
  current_usage INTEGER,
  remaining INTEGER
) AS $$
BEGIN
  RETURN QUERY
  WITH user_plan AS (
    SELECT us.plan_id
    FROM user_subscriptions us
    WHERE us.user_id = p_user_id
      AND us.status = 'active'
    LIMIT 1
  ),
  plan_feature AS (
    SELECT pf.limit_value
    FROM plan_features pf
    JOIN user_plan up ON pf.plan_id = up.plan_id
    WHERE pf.feature_code = p_feature_code
  ),
  current_usage AS (
    SELECT COALESCE(fu.usage_count, 0) as count
    FROM feature_usage fu
    WHERE fu.user_id = p_user_id
      AND fu.feature_code = p_feature_code
      AND fu.period_type = 'monthly'
  )
  SELECT
    CASE
      WHEN EXISTS (SELECT 1 FROM plan_feature) THEN
        CASE
          WHEN (SELECT limit_value FROM plan_feature) IS NULL THEN true
          WHEN (SELECT count FROM current_usage) < (SELECT limit_value FROM plan_feature) THEN true
          ELSE false
        END
      ELSE false
    END as has_access,
    (SELECT limit_value FROM plan_feature),
    (SELECT count FROM current_usage)::INTEGER,
    CASE
      WHEN (SELECT limit_value FROM plan_feature) IS NULL THEN NULL
      ELSE ((SELECT limit_value FROM plan_feature) - (SELECT count FROM current_usage))::INTEGER
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Commentaires
COMMENT ON TABLE subscription_plans IS 'Plans d''abonnement disponibles (Gratuit, Essentiel, Premium)';
COMMENT ON TABLE user_subscriptions IS 'Abonnements actifs des utilisateurs';
COMMENT ON TABLE features IS 'Features disponibles dans l''application';
COMMENT ON TABLE plan_features IS 'Mapping des features disponibles par plan';
COMMENT ON TABLE feature_usage IS 'Tracking de l''utilisation des features par utilisateur';
COMMENT ON COLUMN user_subscriptions.status IS 'Status: active, inactive, cancelled, past_due, trialing';
COMMENT ON COLUMN plan_features.limit_value IS 'Limite d''utilisation (NULL = illimité)';
