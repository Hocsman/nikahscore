-- 💕 Système de Questionnaire Couple - NikahScore
-- Déployement simple à copier-coller dans Supabase SQL Editor

-- 1. Table principale des questionnaires couple
CREATE TABLE couple_questionnaires (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    couple_code VARCHAR(10) NOT NULL UNIQUE,
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    partner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'waiting_partner',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    partner_joined_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

-- 2. Table des réponses couple
CREATE TABLE couple_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    couple_code VARCHAR(10) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    responses JSONB NOT NULL,
    role VARCHAR(10) NOT NULL,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(couple_code, user_id)
);

-- 3. Index pour les performances
CREATE INDEX idx_couple_questionnaires_code ON couple_questionnaires(couple_code);
CREATE INDEX idx_couple_questionnaires_creator ON couple_questionnaires(creator_id);
CREATE INDEX idx_couple_responses_code ON couple_responses(couple_code);

-- 4. Activer RLS
ALTER TABLE couple_questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE couple_responses ENABLE ROW LEVEL SECURITY;

-- 5. Politiques de sécurité
CREATE POLICY "Public can read couple info" ON couple_questionnaires FOR SELECT USING (true);
CREATE POLICY "Users can create couples" ON couple_questionnaires FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Users can update couples" ON couple_questionnaires FOR UPDATE USING (auth.uid() = creator_id OR auth.uid() = partner_id);

CREATE POLICY "Users can read couple responses" ON couple_responses FOR SELECT USING (
    EXISTS (SELECT 1 FROM couple_questionnaires cq WHERE cq.couple_code = couple_responses.couple_code AND (cq.creator_id = auth.uid() OR cq.partner_id = auth.uid()))
);
CREATE POLICY "Users can insert responses" ON couple_responses FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. Fonction génération code unique
CREATE OR REPLACE FUNCTION generate_couple_code() RETURNS TEXT AS $$
DECLARE
    code TEXT;
    attempts INT := 0;
BEGIN
    WHILE attempts < 50 LOOP
        code := upper(substring(md5(random()::text), 1, 6));
        IF NOT EXISTS(SELECT 1 FROM couple_questionnaires WHERE couple_code = code) THEN
            RETURN code;
        END IF;
        attempts := attempts + 1;
    END LOOP;
    RAISE EXCEPTION 'Unable to generate unique code';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Permissions fonction
GRANT EXECUTE ON FUNCTION generate_couple_code() TO authenticated;
