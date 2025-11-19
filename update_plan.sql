-- SQL à exécuter dans Supabase
UPDATE users 
SET 
  subscription_plan = 'conseil',
  subscription_status = 'active',
  subscription_start = NOW(),
  subscription_end = NOW() + INTERVAL '1 year'
WHERE email = 'hocsman92@gmail.com';
