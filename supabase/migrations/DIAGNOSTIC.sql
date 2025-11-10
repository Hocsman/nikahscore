-- Script de diagnostic pour vérifier la structure actuelle
-- Exécutez ceci AVANT la migration pour comprendre votre structure

-- 1. Vérifier la structure de la table user_subscriptions
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'user_subscriptions'
ORDER BY ordinal_position;

-- 2. Voir les plans actuels
SELECT * FROM subscription_plans ORDER BY sort_order;

-- 3. Voir les abonnements actuels
SELECT * FROM user_subscriptions LIMIT 5;
