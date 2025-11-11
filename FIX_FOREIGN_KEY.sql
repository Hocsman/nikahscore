-- ============================================
-- FIX : Ajouter Foreign Key manquante
-- ============================================

-- Ajouter la colonne plan_id si elle n'existe pas
ALTER TABLE user_subscriptions 
ADD COLUMN IF NOT EXISTS plan_id UUID REFERENCES subscription_plans(id);

-- Remplir plan_id basé sur plan_code
UPDATE user_subscriptions us
SET plan_id = sp.id
FROM subscription_plans sp
WHERE us.plan_code = sp.name
AND us.plan_id IS NULL;

-- Vérifier que tout est OK
SELECT 
  us.user_id,
  us.plan_code,
  us.plan_id,
  sp.name as plan_name,
  sp.display_name
FROM user_subscriptions us
LEFT JOIN subscription_plans sp ON us.plan_id = sp.id
LIMIT 10;
