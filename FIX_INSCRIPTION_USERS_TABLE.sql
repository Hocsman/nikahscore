-- ============================================
-- FIX INSCRIPTION : Ajouter first_name et last_name
-- Ces colonnes sont nécessaires pour l'API register
-- ============================================

-- 1️⃣ Ajouter les colonnes first_name et last_name à la table users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS first_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);

-- 2️⃣ Vérifier que les colonnes ont été ajoutées
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'users' 
AND column_name IN ('first_name', 'last_name', 'email', 'email_hash')
ORDER BY ordinal_position;

-- 3️⃣ Optionnel : Remplir les noms manquants depuis auth.users.raw_user_meta_data
UPDATE users u
SET 
  first_name = (u2.raw_user_meta_data->>'first_name'),
  last_name = (u2.raw_user_meta_data->>'last_name')
FROM auth.users u2
WHERE u.id = u2.id
AND u.first_name IS NULL;

-- 4️⃣ Vérifier quelques utilisateurs
SELECT id, email, first_name, last_name, created_at
FROM users
ORDER BY created_at DESC
LIMIT 5;
