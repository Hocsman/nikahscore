-- Migration CORRECTIVE pour intégration Stripe
-- Cette migration corrige la table de référence de 'users' vers 'profiles'
-- Et ajoute uniquement ce qui manque

-- 1. D'abord, supprimer les anciennes politiques s'il y en a
DROP POLICY IF EXISTS "Users can view their own stripe customer data" ON stripe_customers;
DROP POLICY IF EXISTS "Users can insert their own stripe customer data" ON stripe_customers;
DROP POLICY IF EXISTS "Users can view their own stripe sessions" ON stripe_sessions;
DROP POLICY IF EXISTS "Users can insert their own stripe sessions" ON stripe_sessions;
DROP POLICY IF EXISTS "Users can view their own transactions" ON transactions;
DROP POLICY IF EXISTS "Service role can manage all transactions" ON transactions;

-- 2. Supprimer les anciennes tables pour les recréer avec les bonnes références
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS stripe_sessions CASCADE;
DROP TABLE IF EXISTS stripe_customers CASCADE;

-- 3. Recréer les tables avec les bonnes références vers 'profiles'
-- Table pour les clients Stripe
CREATE TABLE IF NOT EXISTS stripe_customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les sessions Stripe
CREATE TABLE IF NOT EXISTS stripe_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan TEXT NOT NULL,
  billing TEXT NOT NULL, -- 'monthly' ou 'annual'
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les transactions
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_session_id TEXT,
  stripe_customer_id TEXT,
  plan TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'eur',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Ajout des colonnes manquantes à la table profiles si elles n'existent pas
DO $$ 
BEGIN
  -- Colonnes pour l'abonnement
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'subscription_plan') THEN
    ALTER TABLE profiles ADD COLUMN subscription_plan TEXT DEFAULT 'gratuit';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'subscription_status') THEN
    ALTER TABLE profiles ADD COLUMN subscription_status TEXT DEFAULT 'inactive';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'subscription_start') THEN
    ALTER TABLE profiles ADD COLUMN subscription_start TIMESTAMP WITH TIME ZONE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'subscription_end') THEN
    ALTER TABLE profiles ADD COLUMN subscription_end TIMESTAMP WITH TIME ZONE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'stripe_customer_id') THEN
    ALTER TABLE profiles ADD COLUMN stripe_customer_id TEXT;
  END IF;
END $$;

-- 5. Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_stripe_customers_user_id ON stripe_customers(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_customers_stripe_id ON stripe_customers(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_stripe_sessions_user_id ON stripe_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_sessions_session_id ON stripe_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription ON profiles(subscription_plan, subscription_status);

-- 6. Politiques RLS (Row Level Security)
-- Stripe customers
ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own stripe customer data" ON stripe_customers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stripe customer data" ON stripe_customers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Stripe sessions
ALTER TABLE stripe_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own stripe sessions" ON stripe_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stripe sessions" ON stripe_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all transactions" ON transactions
  FOR ALL USING (auth.role() = 'service_role');

-- 7. Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. Triggers pour updated_at
CREATE TRIGGER update_stripe_customers_updated_at
  BEFORE UPDATE ON stripe_customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stripe_sessions_updated_at
  BEFORE UPDATE ON stripe_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 9. Commentaires pour documentation
COMMENT ON TABLE stripe_customers IS 'Mapping entre utilisateurs NikahScore et customers Stripe';
COMMENT ON TABLE stripe_sessions IS 'Sessions de checkout Stripe pour tracking';
COMMENT ON TABLE transactions IS 'Historique des transactions et paiements';

COMMENT ON COLUMN profiles.subscription_plan IS 'Plan actuel: gratuit, premium, conseil';
COMMENT ON COLUMN profiles.subscription_status IS 'Statut: inactive, active, cancelled, past_due';
COMMENT ON COLUMN profiles.subscription_start IS 'Date de début de l abonnement';
COMMENT ON COLUMN profiles.subscription_end IS 'Date de fin de l abonnement';
COMMENT ON COLUMN profiles.stripe_customer_id IS 'ID du customer Stripe associé';
