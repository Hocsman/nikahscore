-- ============================================
-- PHASE 5 : TRIGGER AUTO-SUBSCRIPTION
-- Crée automatiquement un abonnement FREE
-- pour chaque nouvel utilisateur inscrit
-- ============================================

-- 1️⃣ Créer la fonction qui sera appelée par le trigger
CREATE OR REPLACE FUNCTION auto_create_free_subscription()
RETURNS TRIGGER AS $$
BEGIN
  -- Insérer un abonnement gratuit pour le nouvel utilisateur
  INSERT INTO user_subscriptions (user_id, plan_code, status)
  VALUES (
    NEW.id,
    'free',
    'active'
  )
  ON CONFLICT (user_id) DO NOTHING; -- Si déjà existant, ne rien faire
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2️⃣ Supprimer l'ancien trigger s'il existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 3️⃣ Créer le trigger qui s'exécute APRÈS l'insertion d'un user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_free_subscription();

-- ============================================
-- VÉRIFICATION
-- ============================================

-- Tester que le trigger existe bien
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
