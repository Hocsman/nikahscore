-- Migration : Ajout des Price IDs Stripe dans les plans
-- Date : 2025-11-10
-- Description : Lier les produits Stripe aux plans Supabase

-- ⚠️ IMPORTANT : Remplacez les Price IDs par vos vrais IDs depuis Stripe Dashboard

-- Mettre à jour le plan Premium avec les Price IDs Stripe
UPDATE subscription_plans 
SET 
  stripe_price_id_monthly = 'price_1SQxavEOiMGm6qlDldkN0PL7',
  stripe_price_id_yearly = 'price_1SQxavEOiMGm6qlD79PRxb4t',
  price_monthly = 9.99,
  price_yearly = 79.00
WHERE name = 'premium';

-- Mettre à jour le plan Conseil avec les Price IDs Stripe
UPDATE subscription_plans 
SET 
  stripe_price_id_monthly = 'price_1SQxbfEOiMGm6qlDwOpwYYEg',
  stripe_price_id_yearly = 'price_1SQxcJEOiMGm6qlDp91uLFxm',
  price_monthly = 49.99,
  price_yearly = 499.00
WHERE name = 'conseil';

-- Vérifier les résultats
SELECT 
  name, 
  display_name, 
  price_monthly, 
  price_yearly,
  stripe_price_id_monthly,
  stripe_price_id_yearly
FROM subscription_plans 
WHERE name IN ('premium', 'conseil')
ORDER BY sort_order;

-- Ce que vous devriez voir après l'UPDATE:
-- premium | Premium         | 6.67  | 79.00  | price_xxxxx | price_yyyyy
-- conseil | Conseil Premium | 41.67 | 499.00 | price_zzzzz | price_wwwww
