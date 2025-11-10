-- Migration : Correction des plans d'abonnement
-- Date : 2025-11-10
-- Description : Aligner les plans avec la configuration Stripe existante

-- Option A : Garder 2 plans (Gratuit + Premium à 9.99€)
-- Supprimer le plan "Essentiel" et ajuster les prix

-- 1. Supprimer les associations du plan "essential" 
DELETE FROM plan_features WHERE plan_id = (SELECT id FROM subscription_plans WHERE name = 'essential');

-- 2. Supprimer le plan "essential"
DELETE FROM subscription_plans WHERE name = 'essential';

-- 3. Mettre à jour le plan Premium avec le bon prix (9.99€ au lieu de 19.99€)
UPDATE subscription_plans 
SET 
  price_monthly = 9.99,
  price_yearly = 99.99,
  description = 'Accès complet à toutes les fonctionnalités Premium de NikahScore'
WHERE name = 'premium';

-- 4. Transférer toutes les features "essential" vers "premium"
-- (Puisqu'on garde un seul plan payant, il aura toutes les features)

-- Le plan Premium aura maintenant toutes les features importantes
-- Il n'y a rien à faire car les features Premium sont déjà là

-- Vérification : Voir les plans restants
SELECT name, display_name, price_monthly, price_yearly FROM subscription_plans ORDER BY sort_order;
