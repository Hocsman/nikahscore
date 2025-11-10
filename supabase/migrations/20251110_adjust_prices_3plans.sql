-- Migration : Alternative - Ajuster les prix pour 3 plans
-- Date : 2025-11-10
-- Description : Si vous voulez garder 3 plans mais avec des prix ajustés

-- OPTION B : Garder 3 plans avec cette répartition de prix

-- Plan Gratuit : 0€ (inchangé)
-- Plan Essentiel : 4.99€/mois ou 49.99€/an (nouveau plan d'entrée)
-- Plan Premium : 9.99€/mois ou 99.99€/an (aligné avec votre Stripe existant)

UPDATE subscription_plans 
SET 
  price_monthly = 4.99,
  price_yearly = 49.99,
  description = 'Idéal pour débuter avec les fonctionnalités essentielles'
WHERE name = 'essential';

UPDATE subscription_plans 
SET 
  price_monthly = 9.99,
  price_yearly = 99.99,
  description = 'Accès complet à toutes les fonctionnalités Premium de NikahScore'
WHERE name = 'premium';

-- Vérification
SELECT name, display_name, price_monthly, price_yearly FROM subscription_plans ORDER BY sort_order;
