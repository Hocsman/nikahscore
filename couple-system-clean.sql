-- Extension du schéma analytics pour le système de questionnaire couple
-- À ajouter au script update-analytics.sql

-- Table pour les questionnaires de couple
CREATE TABLE IF NOT EXISTS couple_questionnaires (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    couple_code VARCHAR(10) NOT NULL UNIQUE,
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    partner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'waiting_partner' CHECK (status IN ('waiting_partner', 'active', 'completed', 'expired')),
    compatibility_score INTEGER,
    analysis_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    partner_joined_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table pour stocker les réponses liées au couple
CREATE TABLE IF NOT EXISTS couple_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    couple_code VARCHAR(10) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    responses JSONB NOT NULL,
    role VARCHAR(10) NOT NULL CHECK (role IN ('creator', 'partner')),
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Contrainte pour éviter les doublons
    UNIQUE(couple_code, user_id)
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_couple_questionnaires_code ON couple_questionnaires(couple_code);       
CREATE INDEX IF NOT EXISTS idx_couple_questionnaires_creator ON couple_questionnaires(creator_id);     
CREATE INDEX IF NOT EXISTS idx_couple_questionnaires_partner ON couple_questionnaires(partner_id);
CREATE INDEX IF NOT EXISTS idx_couple_questionnaires_status ON couple_questionnaires(status);
CREATE INDEX IF NOT EXISTS idx_couple_responses_code ON couple_responses(couple_code);
CREATE INDEX IF NOT EXISTS idx_couple_responses_user ON couple_responses(user_id);

-- RLS pour les questionnaires couple
ALTER TABLE couple_questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE couple_responses ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour couple_questionnaires
DROP POLICY IF EXISTS "Users can read their own couple questionnaires" ON couple_questionnaires;
CREATE POLICY "Users can read their own couple questionnaires" ON couple_questionnaires
    FOR SELECT USING (auth.uid() = creator_id OR auth.uid() = partner_id);

DROP POLICY IF EXISTS "Users can create couple questionnaires" ON couple_questionnaires;
CREATE POLICY "Users can create couple questionnaires" ON couple_questionnaires
    FOR INSERT WITH CHECK (auth.uid() = creator_id);

DROP POLICY IF EXISTS "Users can update their couple questionnaires" ON couple_questionnaires;
CREATE POLICY "Users can update their couple questionnaires" ON couple_questionnaires
    FOR UPDATE USING (auth.uid() = creator_id OR auth.uid() = partner_id);

-- Politique pour permettre la lecture publique pour rejoindre un couple
DROP POLICY IF EXISTS "Public can read couple basic info for joining" ON couple_questionnaires;
CREATE POLICY "Public can read couple basic info for joining" ON couple_questionnaires
    FOR SELECT USING (true);

-- Politiques RLS pour couple_responses
DROP POLICY IF EXISTS "Users can read couple responses" ON couple_responses;
CREATE POLICY "Users can read couple responses" ON couple_responses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM couple_questionnaires cq
            WHERE cq.couple_code = couple_responses.couple_code
            AND (cq.creator_id = auth.uid() OR cq.partner_id = auth.uid())
        )
    );

DROP POLICY IF EXISTS "Users can insert their couple responses" ON couple_responses;
CREATE POLICY "Users can insert their couple responses" ON couple_responses
    FOR INSERT WITH CHECK (
        auth.uid() = user_id 
        AND EXISTS (
            SELECT 1 FROM couple_questionnaires cq
            WHERE cq.couple_code = couple_responses.couple_code
            AND (cq.creator_id = auth.uid() OR cq.partner_id = auth.uid())
        )
    );

-- Fonction pour générer un code couple unique
CREATE OR REPLACE FUNCTION generate_couple_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    attempts INT := 0;
    code_exists BOOLEAN := TRUE;
BEGIN
    WHILE code_exists AND attempts < 100 LOOP
        -- Générer un code de 6 caractères alphanumériques
        code := upper(substring(md5(random()::text || clock_timestamp()::text), 1, 6));
        
        -- Vérifier s'il existe déjà
        SELECT EXISTS(SELECT 1 FROM couple_questionnaires WHERE couple_code = code) INTO code_exists;
        
        attempts := attempts + 1;
    END LOOP;

    IF attempts >= 100 THEN
        RAISE EXCEPTION 'Unable to generate unique couple code after 100 attempts';
    END IF;

    RETURN code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour mettre à jour le statut du couple
CREATE OR REPLACE FUNCTION update_couple_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Si les deux partenaires ont soumis leurs réponses, marquer comme terminé
    IF (SELECT COUNT(*) FROM couple_responses WHERE couple_code = NEW.couple_code) = 2 THEN
        UPDATE couple_questionnaires 
        SET status = 'completed', completed_at = NOW()
        WHERE couple_code = NEW.couple_code;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour automatiquement le statut
DROP TRIGGER IF EXISTS trigger_update_couple_status ON couple_responses;
CREATE TRIGGER trigger_update_couple_status
    AFTER INSERT ON couple_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_couple_status();

-- Vue pour les statistiques couple
CREATE OR REPLACE VIEW couple_stats AS
SELECT
    DATE(created_at) as date,
    COUNT(*) as couples_created,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as couples_completed,
    COUNT(CASE WHEN partner_id IS NOT NULL THEN 1 END) as couples_with_partner,
    AVG(CASE WHEN compatibility_score IS NOT NULL THEN compatibility_score END) as avg_compatibility
FROM couple_questionnaires
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Grant permissions pour la fonction
GRANT EXECUTE ON FUNCTION generate_couple_code() TO authenticated;

-- Message de confirmation
SELECT 'Couple questionnaire system deployed successfully! 💕' as status;
