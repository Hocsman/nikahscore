-- ==========================================
-- TABLE RESPONSES (Réponses individuelles)
-- ==========================================
-- Table pour stocker les réponses de chaque utilisateur au questionnaire
-- Permet de sauvegarder progressivement et de calculer la compatibilité

CREATE TABLE IF NOT EXISTS responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Réponses (JSON avec toutes les réponses)
    answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Métadonnées
    is_completed BOOLEAN DEFAULT FALSE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Contrainte: un utilisateur ne peut avoir qu'une seule réponse par couple
    UNIQUE(couple_id, user_id)
);

-- INDEX
CREATE INDEX idx_responses_couple ON responses(couple_id);
CREATE INDEX idx_responses_user ON responses(user_id);
CREATE INDEX idx_responses_completed ON responses(is_completed);

-- ROW LEVEL SECURITY
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- Politique: Les utilisateurs peuvent voir leurs propres réponses
CREATE POLICY "Users can view their own responses"
    ON responses
    FOR SELECT
    USING (auth.uid() = user_id);

-- Politique: Les utilisateurs peuvent insérer leurs propres réponses
CREATE POLICY "Users can insert their own responses"
    ON responses
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Politique: Les utilisateurs peuvent mettre à jour leurs propres réponses
CREATE POLICY "Users can update their own responses"
    ON responses
    FOR UPDATE
    USING (auth.uid() = user_id);

-- COMMENTAIRES
COMMENT ON TABLE responses IS 'Réponses individuelles des utilisateurs au questionnaire';
COMMENT ON COLUMN responses.answers IS 'Objet JSON contenant toutes les réponses (format: {question_id: answer_value})';
COMMENT ON COLUMN responses.is_completed IS 'Indique si l''utilisateur a terminé le questionnaire';

-- VÉRIFICATION
SELECT 
    'Table responses créée avec succès' as status,
    count(*) as nombre_colonnes
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'responses';
