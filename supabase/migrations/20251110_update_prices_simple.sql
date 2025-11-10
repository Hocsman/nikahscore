-- Migration SIMPLIFIÉE : Mise à jour des prix uniquement
-- Date : 2025-11-10
-- Description : Mettre à jour les prix sans toucher aux relations

-- Cette migration met SEULEMENT à jour les prix et descriptions
-- Elle ne touche PAS aux abonnements utilisateurs existants

-- 1. Mettre à jour le plan "free" (au cas où)
UPDATE subscription_plans 
SET 
  display_name = 'Gratuit',
  description = 'Découvrez NikahScore avec les fonctionnalités de base',
  price_monthly = 0.00,
  price_yearly = 0.00,
  sort_order = 1
WHERE name = 'free';

-- 2. Mettre à jour le plan "premium" (peut être "essential" dans votre BDD)
-- On met à jour celui qui existe
UPDATE subscription_plans 
SET 
  name = 'premium',
  display_name = 'Premium',
  description = 'Pour une analyse approfondie de votre compatibilité',
  price_monthly = 6.67,
  price_yearly = 79.00,
  sort_order = 2
WHERE name = 'essential' OR name = 'premium';

-- 3. Si le plan "conseil" existe déjà, le mettre à jour
UPDATE subscription_plans 
SET 
  display_name = 'Conseil Premium',
  description = 'Avec accompagnement personnel par un coach matrimonial',
  price_monthly = 41.67,
  price_yearly = 499.00,
  sort_order = 3
WHERE name = 'conseil';

-- 4. Si le plan "conseil" n'existe pas, le créer
INSERT INTO subscription_plans (name, display_name, description, price_monthly, price_yearly, sort_order)
SELECT 
  'conseil',
  'Conseil Premium',
  'Avec accompagnement personnel par un coach matrimonial',
  41.67,
  499.00,
  3
WHERE NOT EXISTS (SELECT 1 FROM subscription_plans WHERE name = 'conseil');

-- 5. Ajouter des features exclusives pour le plan Conseil (si pas déjà là)
INSERT INTO features (code, name, description, category) VALUES
  ('personal_coaching', 'Coach personnel', 'Accompagnement par un coach matrimonial certifié', 'support'),
  ('monthly_sessions', 'Sessions mensuelles', 'Sessions de conseil 1-on-1 chaque mois', 'support'),
  ('couple_mediation', 'Médiation de couple', 'Médiation professionnelle en cas de conflit', 'couple'),
  ('priority_matching', 'Matching prioritaire', 'Mise en avant de votre profil', 'profile')
ON CONFLICT (code) DO NOTHING;

-- 6. Mapper les features au plan Conseil (si elles existent)
INSERT INTO plan_features (plan_id, feature_code, limit_value)
SELECT 
  sp.id,
  f.code,
  CASE 
    WHEN f.code = 'monthly_sessions' THEN 2
    ELSE NULL
  END
FROM subscription_plans sp
CROSS JOIN (
  VALUES 
    ('personal_coaching'),
    ('monthly_sessions'),
    ('couple_mediation'),
    ('priority_matching'),
    ('unlimited_questionnaires'),
    ('advanced_questions'),
    ('detailed_analysis'),
    ('ai_recommendations'),
    ('compatibility_trends'),
    ('pdf_export'),
    ('share_results'),
    ('custom_branding'),
    ('all_achievements'),
    ('leaderboard'),
    ('couple_mode'),
    ('couple_insights'),
    ('compatibility_tracking'),
    ('dedicated_support')
) AS feature_codes(code)
JOIN features f ON f.code = feature_codes.code
WHERE sp.name = 'conseil'
ON CONFLICT (plan_id, feature_code) DO NOTHING;

-- 7. Vérifier les résultats
SELECT 
  name, 
  display_name, 
  price_monthly, 
  price_yearly,
  sort_order,
  (SELECT COUNT(*) FROM plan_features WHERE plan_id = subscription_plans.id) as features_count
FROM subscription_plans 
ORDER BY sort_order;
