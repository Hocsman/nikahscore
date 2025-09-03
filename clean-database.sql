-- Script de nettoyage de la base de données NikahScore
-- ⚠️ ATTENTION: Ce script supprime TOUTES les données de test !

-- 1. Supprimer les événements analytics
DELETE FROM analytics_events;

-- 2. Supprimer les abonnements de test
DELETE FROM user_subscriptions;

-- 3. Supprimer les customers Stripe de test
DELETE FROM stripe_customers;

-- 4. Supprimer les profils utilisateurs
DELETE FROM profiles;

-- 5. OPTIONNEL: Supprimer les utilisateurs Auth (à faire manuellement dans l'interface)
-- Les utilisateurs dans auth.users doivent être supprimés via l'interface Supabase
-- ou avec les permissions admin appropriées

-- Vérification du nettoyage
SELECT 'Profiles restants:' as info, COUNT(*) as count FROM profiles
UNION ALL
SELECT 'Events analytics restants:' as info, COUNT(*) as count FROM analytics_events
UNION ALL
SELECT 'Subscriptions restantes:' as info, COUNT(*) as count FROM user_subscriptions
UNION ALL
SELECT 'Stripe customers restants:' as info, COUNT(*) as count FROM stripe_customers;

-- Message de confirmation
SELECT '🧹 Base de données nettoyée avec succès !' as status;
