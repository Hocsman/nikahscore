-- ============================================
-- PHASE 6 : Questionnaire Partageable (VERSION SIMPLIFIÉE)
-- Exécuter UNIQUEMENT cette version
-- ============================================

-- 1️⃣ Table pour stocker les questionnaires partagés
CREATE TABLE IF NOT EXISTS shared_questionnaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_code VARCHAR(12) UNIQUE NOT NULL,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  creator_questionnaire_id UUID,
  partner_name VARCHAR(100),
  partner_email VARCHAR(255),
  partner_questionnaire_id UUID,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2️⃣ Index
CREATE INDEX IF NOT EXISTS idx_shared_questionnaires_share_code ON shared_questionnaires(share_code);
CREATE INDEX IF NOT EXISTS idx_shared_questionnaires_creator_id ON shared_questionnaires(creator_id);

-- 3️⃣ Trigger
CREATE OR REPLACE FUNCTION update_shared_questionnaires_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_shared_questionnaires_updated_at
BEFORE UPDATE ON shared_questionnaires
FOR EACH ROW
EXECUTE FUNCTION update_shared_questionnaires_updated_at();

-- 4️⃣ Fonction génération code
CREATE OR REPLACE FUNCTION generate_share_code()
RETURNS VARCHAR(12) AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result VARCHAR(12) := '';
  i INTEGER;
BEGIN
  FOR i IN 1..12 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 5️⃣ Feature
INSERT INTO features (code, name, description, created_at)
VALUES (
  'questionnaire_shareable',
  'Questionnaire Partageable',
  'Partager un code unique pour que votre partenaire réponde et comparer vos résultats',
  NOW()
)
ON CONFLICT (code) DO NOTHING;

-- 6️⃣ Plans
INSERT INTO plan_features (plan_name, feature_code, is_unlimited, usage_limit)
VALUES 
  ('premium', 'questionnaire_shareable', true, NULL),
  ('conseil', 'questionnaire_shareable', true, NULL)
ON CONFLICT (plan_name, feature_code) DO NOTHING;
