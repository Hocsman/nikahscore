-- Migration : Correction IDEMPOTENTE pour structure Gratuit / Premium / Conseil
-- Date : 2025-11-10
-- Description : Aligner avec la stratégie Stripe existante (peut être exécutée plusieurs fois)

-- Cette migration est IDEMPOTENTE : elle peut être exécutée plusieurs fois sans erreur

-- 1. Supprimer temporairement le plan "conseil" s'il existe déjà
DELETE FROM plan_features WHERE plan_id = (SELECT id FROM subscription_plans WHERE name = 'conseil');
DELETE FROM subscription_plans WHERE name = 'conseil';

-- 2. Supprimer temporairement le plan "premium" s'il existe (pour pouvoir renommer essential)
-- IMPORTANT : Sauvegarder les abonnements utilisateurs avant de supprimer
CREATE TEMP TABLE IF NOT EXISTS temp_premium_users AS
SELECT user_id FROM user_subscriptions WHERE plan_id = (SELECT id FROM subscription_plans WHERE name = 'premium');

DELETE FROM plan_features WHERE plan_id = (SELECT id FROM subscription_plans WHERE name = 'premium');
DELETE FROM user_subscriptions WHERE plan_id = (SELECT id FROM subscription_plans WHERE name = 'premium');
DELETE FROM subscription_plans WHERE name = 'premium';

-- 3. Créer le nouveau plan "premium" (ex-essential) avec les bons prix
INSERT INTO subscription_plans (name, display_name, description, price_monthly, price_yearly, sort_order)
VALUES (
  'premium',
  'Premium',
  'Pour une analyse approfondie de votre compatibilité',
  6.67,
  79.00,
  2
)
ON CONFLICT (name) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  price_monthly = EXCLUDED.price_monthly,
  price_yearly = EXCLUDED.price_yearly,
  sort_order = EXCLUDED.sort_order;

-- 4. Créer le plan "conseil" avec les bons prix
INSERT INTO subscription_plans (name, display_name, description, price_monthly, price_yearly, sort_order)
VALUES (
  'conseil',
  'Conseil Premium',
  'Avec accompagnement personnel par un coach matrimonial',
  41.67,
  499.00,
  3
)
ON CONFLICT (name) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  price_monthly = EXCLUDED.price_monthly,
  price_yearly = EXCLUDED.price_yearly,
  sort_order = EXCLUDED.sort_order;

-- 5. Supprimer l'ancien plan "essential" s'il existe encore
DELETE FROM plan_features WHERE plan_id = (SELECT id FROM subscription_plans WHERE name = 'essential');
DELETE FROM user_subscriptions WHERE plan_id = (SELECT id FROM subscription_plans WHERE name = 'essential');
DELETE FROM subscription_plans WHERE name = 'essential';

-- 6. Restaurer les abonnements des anciens utilisateurs premium vers le nouveau premium
INSERT INTO user_subscriptions (user_id, plan_id, status)
SELECT 
  user_id,
  (SELECT id FROM subscription_plans WHERE name = 'premium'),
  'active'
FROM temp_premium_users
ON CONFLICT (user_id) DO UPDATE SET
  plan_id = (SELECT id FROM subscription_plans WHERE name = 'premium'),
  status = 'active';

-- 7. Ajouter des features exclusives pour le plan Conseil
INSERT INTO features (code, name, description, category) VALUES
  ('personal_coaching', 'Coach personnel', 'Accompagnement par un coach matrimonial certifié', 'support'),
  ('monthly_sessions', 'Sessions mensuelles', 'Sessions de conseil 1-on-1 chaque mois', 'support'),
  ('couple_mediation', 'Médiation de couple', 'Médiation professionnelle en cas de conflit', 'couple'),
  ('priority_matching', 'Matching prioritaire', 'Mise en avant de votre profil', 'profile')
ON CONFLICT (code) DO NOTHING;

-- 8. Mapper les features au plan Premium (14 features)
INSERT INTO plan_features (plan_id, feature_code, limit_value) VALUES
  -- Plan Premium (ex-essential)
  ((SELECT id FROM subscription_plans WHERE name = 'premium'), 'basic_questionnaire', 5),
  ((SELECT id FROM subscription_plans WHERE name = 'premium'), 'unlimited_questionnaires', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'premium'), 'advanced_questions', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'premium'), 'basic_results', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'premium'), 'detailed_analysis', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'premium'), 'ai_recommendations', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'premium'), 'pdf_export', 10),
  ((SELECT id FROM subscription_plans WHERE name = 'premium'), 'share_results', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'premium'), 'basic_achievements', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'premium'), 'all_achievements', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'premium'), 'couple_mode', 3),
  ((SELECT id FROM subscription_plans WHERE name = 'premium'), 'couple_insights', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'premium'), 'priority_support', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'premium'), 'email_support', NULL)
ON CONFLICT (plan_id, feature_code) DO NOTHING;

-- 9. Mapper TOUTES les features au plan Conseil (21 features = 17 de base + 4 exclusives)
INSERT INTO plan_features (plan_id, feature_code, limit_value) VALUES
  -- Toutes les features Premium
  ((SELECT id FROM subscription_plans WHERE name = 'conseil'), 'basic_questionnaire', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'conseil'), 'unlimited_questionnaires', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'conseil'), 'advanced_questions', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'conseil'), 'basic_results', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'conseil'), 'detailed_analysis', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'conseil'), 'ai_recommendations', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'conseil'), 'compatibility_trends', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'conseil'), 'pdf_export', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'conseil'), 'share_results', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'conseil'), 'custom_branding', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'conseil'), 'basic_achievements', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'conseil'), 'all_achievements', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'conseil'), 'leaderboard', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'conseil'), 'couple_mode', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'conseil'), 'couple_insights', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'conseil'), 'compatibility_tracking', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'conseil'), 'email_support', NULL),
  -- Features exclusives Conseil
  ((SELECT id FROM subscription_plans WHERE name = 'conseil'), 'personal_coaching', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'conseil'), 'monthly_sessions', 2),
  ((SELECT id FROM subscription_plans WHERE name = 'conseil'), 'couple_mediation', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'conseil'), 'priority_matching', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'conseil'), 'dedicated_support', NULL)
ON CONFLICT (plan_id, feature_code) DO NOTHING;

-- 10. Vérifier la structure finale
SELECT 
  name, 
  display_name, 
  price_monthly, 
  price_yearly,
  sort_order,
  (SELECT COUNT(*) FROM plan_features WHERE plan_id = subscription_plans.id) as features_count
FROM subscription_plans 
ORDER BY sort_order;
