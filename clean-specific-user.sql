-- Script pour supprimer UN utilisateur spécifique
-- Remplacez 'EMAIL_A_SUPPRIMER' par l'email de l'utilisateur

-- 1. Trouver l'ID de l'utilisateur
SELECT id, email FROM profiles WHERE email = 'hocsman92@gmail.com';

-- 2. Supprimer les données liées (remplacez USER_ID par l'ID trouvé)
-- DELETE FROM analytics_events WHERE user_id = 'USER_ID';
-- DELETE FROM user_subscriptions WHERE user_id = 'USER_ID';
-- DELETE FROM stripe_customers WHERE user_id = 'USER_ID';
-- DELETE FROM profiles WHERE id = 'USER_ID';

-- OU plus simple : supprimer par email
DELETE FROM analytics_events WHERE user_id IN (
    SELECT id FROM profiles WHERE email = 'hocsman92@gmail.com'
);
DELETE FROM user_subscriptions WHERE user_id IN (
    SELECT id FROM profiles WHERE email = 'hocsman92@gmail.com'
);
DELETE FROM stripe_customers WHERE user_id IN (
    SELECT id FROM profiles WHERE email = 'hocsman92@gmail.com'
);
DELETE FROM profiles WHERE email = 'hocsman92@gmail.com';

-- ⚠️ IMPORTANT: Vous devez aussi supprimer l'utilisateur dans l'onglet "Authentication" de Supabase

SELECT '🗑️ Utilisateur supprimé de la base de données (pensez à le supprimer aussi dans Authentication)' as status;
