-- Migration : Correction pour structure Gratuit / Premium / Conseil
-- Date : 2025-11-10
-- Description : Aligner avec la stratégie Stripe existante

-- 1. Renommer et ajuster le plan "essential" en "premium" 
UPDATE subscription_plans 
SET 
  name = 'premium',
  display_name = 'Premium',
  description = 'Accès complet aux fonctionnalités pour trouver votre âme sœur',
  price_monthly = 9.99,
  price_yearly = 99.99,
  sort_order = 2
WHERE name = 'essential';

-- 2. Renommer l'ancien "premium" en "conseil"
UPDATE subscription_plans 
SET 
  name = 'conseil',
  display_name = 'Conseil Premium',
  description = 'Accompagnement personnalisé avec un coach matrimonial dédié',
  price_monthly = 49.99,
  price_yearly = 499.99,
  sort_order = 3
WHERE name = 'premium' AND price_monthly = 19.99;

-- 3. Ajouter des features exclusives pour le plan Conseil
INSERT INTO features (code, name, description, category) VALUES
  ('personal_coaching', 'Coach personnel', 'Accompagnement par un coach matrimonial certifié', 'support'),
  ('monthly_sessions', 'Sessions mensuelles', 'Sessions de conseil 1-on-1 chaque mois', 'support'),
  ('couple_mediation', 'Médiation de couple', 'Médiation professionnelle en cas de conflit', 'couple'),
  ('priority_matching', 'Matching prioritaire', 'Mise en avant de votre profil', 'profile')
ON CONFLICT (code) DO NOTHING;

-- 4. Mapper ces features exclusives au plan Conseil
INSERT INTO plan_features (plan_id, feature_code, limit_value) VALUES
  ((SELECT id FROM subscription_plans WHERE name = 'conseil'), 'personal_coaching', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'conseil'), 'monthly_sessions', 2),
  ((SELECT id FROM subscription_plans WHERE name = 'conseil'), 'couple_mediation', NULL),
  ((SELECT id FROM subscription_plans WHERE name = 'conseil'), 'priority_matching', NULL)
ON CONFLICT (plan_id, feature_code) DO NOTHING;

-- 5. Vérifier la structure finale
SELECT 
  name, 
  display_name, 
  price_monthly, 
  price_yearly,
  sort_order,
  (SELECT COUNT(*) FROM plan_features WHERE plan_id = subscription_plans.id) as features_count
FROM subscription_plans 
ORDER BY sort_order;
