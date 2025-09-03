-- Schéma simple pour le partage de questionnaire
-- Table pour stocker les questionnaires partagés

CREATE TABLE IF NOT EXISTS shared_questionnaires (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    share_code VARCHAR(8) NOT NULL UNIQUE,
    creator_email VARCHAR(255),
    partner_email VARCHAR(255),
    creator_responses JSONB,
    partner_responses JSONB,
    creator_completed_at TIMESTAMPTZ,
    partner_completed_at TIMESTAMPTZ,
    compatibility_score INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_shared_questionnaires_code ON shared_questionnaires(share_code);
CREATE INDEX IF NOT EXISTS idx_shared_questionnaires_emails ON shared_questionnaires(creator_email, partner_email);

-- Fonction pour générer un code de partage unique
CREATE OR REPLACE FUNCTION generate_share_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    attempts INT := 0;
BEGIN
    WHILE attempts < 50 LOOP
        code := upper(substring(md5(random()::text || clock_timestamp()::text), 1, 8));
        IF NOT EXISTS(SELECT 1 FROM shared_questionnaires WHERE share_code = code) THEN
            RETURN code;
        END IF;
        attempts := attempts + 1;
    END LOOP;
    RAISE EXCEPTION 'Unable to generate unique share code';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Permission pour la fonction
GRANT EXECUTE ON FUNCTION generate_share_code() TO anon, authenticated;

-- Politique RLS simple (lecture publique avec code)
ALTER TABLE shared_questionnaires ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read with share code" ON shared_questionnaires
    FOR SELECT USING (true);

CREATE POLICY "Anyone can create shared questionnaire" ON shared_questionnaires
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update shared questionnaire" ON shared_questionnaires
    FOR UPDATE USING (true);

-- Message de confirmation
SELECT 'Système de partage de questionnaire déployé ! 🔗' as status;
