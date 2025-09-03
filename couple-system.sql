-- Extension du schéma analytics pour le système de questionnaire couple
-- À ajouter au script update-analytics.sql

-- Table pour les questionnaires de couple
CREATE TABLE IF NOT EXISTS couple_questionnaires (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    couple_code VARCHAR(10) NOT NULL UNIQUE,
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    partner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    creator_completed BOOLEAN DEFAULT FALSE,
    partner_completed BOOLEAN DEFAULT FALSE,
    compatibility_score INTEGER,
    analysis_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table pour stocker les réponses liées au couple
CREATE TABLE IF NOT EXISTS couple_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    couple_id UUID REFERENCES couple_questionnaires(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id VARCHAR(50) NOT NULL,
    response JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_couple_questionnaires_code ON couple_questionnaires(couple_code);
CREATE INDEX IF NOT EXISTS idx_couple_questionnaires_creator ON couple_questionnaires(creator_id);
CREATE INDEX IF NOT EXISTS idx_couple_questionnaires_partner ON couple_questionnaires(partner_id);
CREATE INDEX IF NOT EXISTS idx_couple_responses_couple ON couple_responses(couple_id);
CREATE INDEX IF NOT EXISTS idx_couple_responses_user ON couple_responses(user_id);

-- RLS pour les questionnaires couple
ALTER TABLE couple_questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE couple_responses ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour couple_questionnaires
CREATE POLICY "Users can read their own couple questionnaires" ON couple_questionnaires
    FOR SELECT USING (auth.uid() = creator_id OR auth.uid() = partner_id);

CREATE POLICY "Users can create couple questionnaires" ON couple_questionnaires
    FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their couple questionnaires" ON couple_questionnaires
    FOR UPDATE USING (auth.uid() = creator_id OR auth.uid() = partner_id);

-- Politiques RLS pour couple_responses
CREATE POLICY "Users can read couple responses" ON couple_responses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM couple_questionnaires cq 
            WHERE cq.id = couple_id 
            AND (cq.creator_id = auth.uid() OR cq.partner_id = auth.uid())
        )
    );

CREATE POLICY "Users can insert their couple responses" ON couple_responses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Fonction pour générer un code couple unique
CREATE OR REPLACE FUNCTION generate_couple_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    attempts INT := 0;
    exists BOOLEAN := TRUE;
BEGIN
    WHILE exists AND attempts < 100 LOOP
        -- Générer un code de 6 caractères alphanumériques
        code := upper(substring(md5(random()::text), 1, 6));
        
        -- Vérifier s'il existe déjà
        SELECT EXISTS(SELECT 1 FROM couple_questionnaires WHERE couple_code = code) INTO exists;
        
        attempts := attempts + 1;
    END LOOP;
    
    IF attempts >= 100 THEN
        RAISE EXCEPTION 'Unable to generate unique couple code after 100 attempts';
    END IF;
    
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Vue pour les statistiques couple
CREATE OR REPLACE VIEW couple_stats AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as couples_created,
    COUNT(CASE WHEN creator_completed AND partner_completed THEN 1 END) as couples_completed,
    AVG(CASE WHEN compatibility_score IS NOT NULL THEN compatibility_score END) as avg_compatibility
FROM couple_questionnaires
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Message de confirmation
SELECT 'Couple questionnaire system ready! 💑' as status;
