-- ============================================
-- FIX URGENT : Fonction check_feature_access
-- ============================================
-- Cette fonction corrige le problème de PDF export pour le plan "conseil"
-- Elle utilise la nouvelle structure avec plan_id (UUID) au lieu de plan_code/plan_name

-- ÉTAPE 1 : Vérifier la structure actuelle de vos tables
SELECT 
  'Checking database structure...' as step;

-- Vérifier la table users
SELECT 
  'users table columns:' as info,
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND column_name IN ('subscription_plan', 'subscription_status', 'subscription_start', 'subscription_end')
ORDER BY column_name;

-- Vérifier les plans
SELECT 
  'subscription_plans:' as info,
  id, 
  name, 
  display_name 
FROM subscription_plans 
ORDER BY sort_order;

-- Vérifier les features du plan conseil
SELECT 
  'plan_features for conseil:' as info,
  pf.plan_name,
  pf.feature_code,
  pf.is_unlimited,
  pf.usage_limit
FROM plan_features pf
WHERE pf.plan_name = 'conseil'
ORDER BY pf.feature_code;

-- Vérifier votre utilisateur
SELECT 
  'your user:' as info,
  id,
  email,
  subscription_plan,
  subscription_status,
  subscription_start,
  subscription_end
FROM users 
WHERE email = 'hocsman92@gmail.com';

-- ============================================
-- ÉTAPE 2 : Créer/Recréer la fonction correcte
-- ============================================

-- Supprimer l'ancienne version si elle existe
DROP FUNCTION IF EXISTS check_feature_access(UUID, VARCHAR);

-- NOUVELLE VERSION qui utilise la colonne subscription_plan de la table users
CREATE OR REPLACE FUNCTION check_feature_access(
  p_user_id UUID,
  p_feature_code VARCHAR
)
RETURNS TABLE (
  has_access BOOLEAN,
  limit_value INTEGER,
  current_usage INTEGER,
  remaining INTEGER
) AS $$
DECLARE
  v_subscription_plan VARCHAR;
  v_subscription_status VARCHAR;
  v_is_unlimited BOOLEAN;
  v_usage_limit INTEGER;
  v_current_usage INTEGER;
BEGIN
  -- IMPORTANT : Récupérer le plan directement depuis la table users
  -- (pas depuis user_subscriptions qui peut ne pas exister)
  SELECT 
    COALESCE(subscription_plan, 'free'),
    COALESCE(subscription_status, 'inactive')
  INTO 
    v_subscription_plan,
    v_subscription_status
  FROM users
  WHERE id = p_user_id;
  
  -- Si utilisateur non trouvé, retourner accès refusé
  IF v_subscription_plan IS NULL THEN
    RETURN QUERY SELECT false, NULL::INTEGER, 0, NULL::INTEGER;
    RETURN;
  END IF;

  -- Si le plan n'est pas actif, considérer comme gratuit
  IF v_subscription_status != 'active' THEN
    v_subscription_plan := 'free';
  END IF;

  -- Vérifier si la feature est disponible pour ce plan
  -- IMPORTANT: utiliser plan_name au lieu de plan_id
  SELECT 
    COALESCE(is_unlimited, false),
    usage_limit
  INTO 
    v_is_unlimited,
    v_usage_limit
  FROM plan_features
  WHERE plan_name = v_subscription_plan 
    AND feature_code = p_feature_code;
  
  -- Si la feature n'est pas trouvée pour ce plan = accès refusé
  IF v_is_unlimited IS NULL THEN
    RETURN QUERY SELECT false, NULL::INTEGER, 0, NULL::INTEGER;
    RETURN;
  END IF;
  
  -- Si la feature est illimitée = accès autorisé sans limite
  IF v_is_unlimited OR v_usage_limit IS NULL THEN
    RETURN QUERY SELECT true, NULL::INTEGER, 0, NULL::INTEGER;
    RETURN;
  END IF;
  
  -- Récupérer l'usage actuel de cette feature
  SELECT COALESCE(SUM(usage_count), 0)
  INTO v_current_usage
  FROM feature_usage
  WHERE user_id = p_user_id 
    AND feature_code = p_feature_code
    AND created_at >= DATE_TRUNC('month', CURRENT_TIMESTAMP);
  
  -- Comparer avec la limite
  IF v_current_usage < v_usage_limit THEN
    RETURN QUERY SELECT 
      true, 
      v_usage_limit, 
      v_current_usage::INTEGER, 
      (v_usage_limit - v_current_usage)::INTEGER;
  ELSE
    RETURN QUERY SELECT 
      false, 
      v_usage_limit, 
      v_current_usage::INTEGER, 
      0;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ÉTAPE 3 : Tester la fonction
-- ============================================

-- Tester pour votre utilisateur avec le feature pdf_export
SELECT 
  'Test check_feature_access for pdf_export:' as test,
  *
FROM check_feature_access(
  (SELECT id FROM users WHERE email = 'hocsman92@gmail.com'),
  'pdf_export'
);

-- Tester avec d'autres features
SELECT 
  'Test check_feature_access for ai_coach:' as test,
  *
FROM check_feature_access(
  (SELECT id FROM users WHERE email = 'hocsman92@gmail.com'),
  'ai_coach'
);

-- ============================================
-- ÉTAPE 4 : Vérifier que tout fonctionne
-- ============================================

SELECT 
  '✅ Migration terminée!' as status,
  'La fonction check_feature_access utilise maintenant users.subscription_plan' as info;

-- Afficher un résumé
SELECT 
  u.email,
  u.subscription_plan,
  u.subscription_status,
  (SELECT has_access FROM check_feature_access(u.id, 'pdf_export')) as can_export_pdf,
  (SELECT has_access FROM check_feature_access(u.id, 'ai_coach')) as can_use_ai_coach
FROM users u
WHERE u.email = 'hocsman92@gmail.com';
