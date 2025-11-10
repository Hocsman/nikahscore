-- Migration FINALE : Mise à jour des prix uniquement
-- Date : 2025-11-10
-- Description : Corriger les prix pour correspondre au site web

-- Mettre à jour le plan Premium : 6.67€/mois et 79€/an
UPDATE subscription_plans 
SET 
  price_monthly = 6.67,
  price_yearly = 79.00,
  description = 'Pour une analyse approfondie de votre compatibilité'
WHERE name = 'premium';

-- Mettre à jour le plan Conseil : 41.67€/mois et 499€/an
UPDATE subscription_plans 
SET 
  price_monthly = 41.67,
  price_yearly = 499.00,
  description = 'Avec accompagnement personnel par un coach matrimonial'
WHERE name = 'conseil';

-- Vérifier les résultats
SELECT 
  name, 
  display_name, 
  price_monthly, 
  price_yearly,
  sort_order
FROM subscription_plans 
ORDER BY sort_order;
