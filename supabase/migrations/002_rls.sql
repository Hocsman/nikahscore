-- Migration RLS et sécurité
-- Créé le : 2025-01-01

-- Activer RLS sur toutes les tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;

-- Extension pour le chiffrement
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Politiques RLS pour users
CREATE POLICY "Les utilisateurs peuvent voir leur propre profil" ON users
    FOR SELECT USING (email_hash = current_setting('app.current_user_hash', true));

CREATE POLICY "Les utilisateurs peuvent créer leur profil" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Les utilisateurs peuvent mettre à jour leur profil" ON users
    FOR UPDATE USING (email_hash = current_setting('app.current_user_hash', true));

-- Politiques RLS pour pairs
CREATE POLICY "Les utilisateurs peuvent voir leurs propres paires" ON pairs
    FOR SELECT USING (
        user_a_hash = current_setting('app.current_user_hash', true) OR 
        user_b_hash = current_setting('app.current_user_hash', true)
    );

CREATE POLICY "Tout le monde peut créer une paire" ON pairs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Les utilisateurs peuvent mettre à jour leurs paires" ON pairs
    FOR UPDATE USING (
        user_a_hash = current_setting('app.current_user_hash', true) OR 
        user_b_hash = current_setting('app.current_user_hash', true)
    );

-- Politiques RLS pour questions (lecture seule pour tous)
CREATE POLICY "Tout le monde peut lire les questions" ON questions
    FOR SELECT USING (true);

-- Politiques RLS pour answers
CREATE POLICY "Les utilisateurs peuvent voir les réponses de leur paire" ON answers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM pairs 
            WHERE pairs.id = answers.pair_id 
            AND (pairs.user_a_hash = current_setting('app.current_user_hash', true) 
                 OR pairs.user_b_hash = current_setting('app.current_user_hash', true))
        )
    );

CREATE POLICY "Les utilisateurs peuvent créer leurs réponses" ON answers
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM pairs 
            WHERE pairs.id = answers.pair_id 
            AND (
                (pairs.user_a_hash = current_setting('app.current_user_hash', true) AND answers.respondent = 'A') 
                OR (pairs.user_b_hash = current_setting('app.current_user_hash', true) AND answers.respondent = 'B')
            )
        )
    );

CREATE POLICY "Les utilisateurs peuvent mettre à jour leurs réponses" ON answers
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM pairs 
            WHERE pairs.id = answers.pair_id 
            AND (
                (pairs.user_a_hash = current_setting('app.current_user_hash', true) AND answers.respondent = 'A') 
                OR (pairs.user_b_hash = current_setting('app.current_user_hash', true) AND answers.respondent = 'B')
            )
        )
    );

-- Politiques RLS pour matches
CREATE POLICY "Les utilisateurs peuvent voir les résultats de leur paire" ON matches
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM pairs 
            WHERE pairs.id = matches.pair_id 
            AND (pairs.user_a_hash = current_setting('app.current_user_hash', true) 
                 OR pairs.user_b_hash = current_setting('app.current_user_hash', true))
        )
    );

CREATE POLICY "Le système peut créer des résultats" ON matches
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Le système peut mettre à jour des résultats" ON matches
    FOR UPDATE USING (true);

-- Politiques RLS pour feedbacks
CREATE POLICY "Les utilisateurs peuvent voir les feedbacks de leur paire" ON feedbacks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM pairs 
            WHERE pairs.id = feedbacks.pair_id 
            AND (pairs.user_a_hash = current_setting('app.current_user_hash', true) 
                 OR pairs.user_b_hash = current_setting('app.current_user_hash', true))
        )
    );

CREATE POLICY "Les utilisateurs peuvent créer leur feedback" ON feedbacks
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM pairs 
            WHERE pairs.id = feedbacks.pair_id 
            AND (
                (pairs.user_a_hash = current_setting('app.current_user_hash', true) AND feedbacks.respondent = 'A') 
                OR (pairs.user_b_hash = current_setting('app.current_user_hash', true) AND feedbacks.respondent = 'B')
            )
        )
    );

-- Politiques RLS pour blocks
CREATE POLICY "Les utilisateurs peuvent voir les blocages de leur paire" ON blocks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM pairs 
            WHERE pairs.id = blocks.pair_id 
            AND (pairs.user_a_hash = current_setting('app.current_user_hash', true) 
                 OR pairs.user_b_hash = current_setting('app.current_user_hash', true))
        )
    );

CREATE POLICY "Les utilisateurs peuvent créer un blocage" ON blocks
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM pairs 
            WHERE pairs.id = blocks.pair_id 
            AND (
                (pairs.user_a_hash = current_setting('app.current_user_hash', true) AND blocks.reported_by = 'A') 
                OR (pairs.user_b_hash = current_setting('app.current_user_hash', true) AND blocks.reported_by = 'B')
            )
        )
    );

-- Fonction pour hasher les emails de manière sécurisée
CREATE OR REPLACE FUNCTION hash_email(email_text TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN encode(digest(lower(trim(email_text)), 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour valider un token d'invitation
CREATE OR REPLACE FUNCTION validate_invite_token(token_value TEXT)
RETURNS UUID AS $$
DECLARE
    pair_id_result UUID;
BEGIN
    SELECT id INTO pair_id_result 
    FROM pairs 
    WHERE invite_token = token_value 
    AND expires_at > NOW() 
    AND status != 'expired';
    
    RETURN pair_id_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour générer un token d'invitation sécurisé
CREATE OR REPLACE FUNCTION generate_invite_token()
RETURNS TEXT AS $$
BEGIN
    RETURN encode(gen_random_bytes(32), 'base64url');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Vue pour les statistiques anonymes (pour les admins)
CREATE VIEW stats_anonymous AS
SELECT 
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as total_pairs,
    COUNT(CASE WHEN status = 'both_completed' THEN 1 END) as completed_pairs,
    AVG(CASE WHEN m.overall_score IS NOT NULL THEN m.overall_score END) as avg_score
FROM pairs p
LEFT JOIN matches m ON p.id = m.pair_id
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;
