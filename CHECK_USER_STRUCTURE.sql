-- ============================================
-- DIAGNOSTIC : Quelle structure utilisez-vous ?
-- ============================================

-- Option 1 : Structure avec table users ayant subscription_plan
SELECT 
  '=== OPTION 1: users table avec subscription_plan ===' as check_type,
  id,
  email,
  subscription_plan,
  subscription_status,
  subscription_start,
  subscription_end
FROM users 
WHERE email = 'hocsman92@gmail.com';

-- Option 2 : Structure avec table user_subscriptions séparée
SELECT 
  '=== OPTION 2: user_subscriptions table séparée ===' as check_type,
  us.id,
  us.user_id,
  us.plan_code,
  us.status,
  u.email
FROM user_subscriptions us
JOIN auth.users u ON u.id = us.user_id
WHERE u.email = 'hocsman92@gmail.com';

-- Vérifier si la table user_subscriptions existe
SELECT 
  '=== TABLE user_subscriptions existe ? ===' as check_type,
  table_name,
  column_name,
  data_type
FROM information_schema.columns 
WHERE table_name = 'user_subscriptions'
ORDER BY ordinal_position;
