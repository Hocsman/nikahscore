-- Migration : Aligner les prix avec ceux affichés sur le site
-- Date : 2025-11-10
-- Description : Appliquer les prix 6.67€/mois et 41.67€/mois

-- Mettre à jour le plan Premium : 79€/an (6.67€/mois)
UPDATE subscription_plans 
SET 
  price_monthly = 6.67,
  price_yearly = 79.00,
  description = 'Pour une analyse approfondie de votre compatibilité'
WHERE name = 'premium';

-- Mettre à jour le plan Conseil : 499€/an (41.67€/mois)
UPDATE subscription_plans 
SET 
  price_monthly = 41.67,
  price_yearly = 499.00,
  description = 'Avec accompagnement personnel par un coach matrimonial'
WHERE name = 'conseil';

-- Vérifier les prix finaux
SELECT 
  name, 
  display_name, 
  price_monthly,
  price_yearly,
  ROUND((price_yearly / 12), 2) as monthly_equivalent,
  ROUND((1 - (price_yearly / (price_monthly * 12))) * 100, 0) as discount_percent
FROM subscription_plans 
WHERE name IN ('premium', 'conseil')
ORDER BY sort_order;
