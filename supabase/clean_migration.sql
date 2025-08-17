-- Migration complète NikahScore - Version clean
-- ATTENTION: Ce script supprime et recrée toutes les tables

-- Supprimer toutes les tables dans le bon ordre (dépendances)
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS answers CASCADE;
DROP TABLE IF EXISTS pairs CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Table des utilisateurs
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    email_hash TEXT UNIQUE NOT NULL,
    age INTEGER,
    city TEXT,
    practice_level TEXT CHECK (practice_level IN ('debutant', 'pratiquant', 'tres_pratiquant')),
    marriage_intention TEXT CHECK (marriage_intention IN ('dans_annee', 'dans_2_ans', 'pas_presse')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table des questions
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    text TEXT NOT NULL,
    category TEXT NOT NULL,
    axis TEXT NOT NULL,
    is_dealbreaker BOOLEAN DEFAULT FALSE,
    order_index INTEGER NOT NULL,
    weight DECIMAL DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Table des paires (couples qui passent le test)
CREATE TABLE pairs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_a_email TEXT NOT NULL,
    user_b_email TEXT,
    user_a_hash TEXT NOT NULL,
    user_b_hash TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'both_completed', 'expired')),
    invite_token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Table des réponses
CREATE TABLE answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pair_id UUID REFERENCES pairs(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    respondent CHAR(1) CHECK (respondent IN ('A', 'B')),
    value INTEGER NOT NULL CHECK (value >= 1 AND value <= 5),
    importance INTEGER NOT NULL CHECK (importance >= 1 AND importance <= 3),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(pair_id, question_id, respondent)
);

-- 5. Table des résultats de compatibilité
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pair_id UUID UNIQUE REFERENCES pairs(id) ON DELETE CASCADE,
    overall_score DECIMAL NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
    axis_scores JSONB NOT NULL,
    dealbreaker_conflicts INTEGER DEFAULT 0,
    strengths TEXT[] DEFAULT '{}',
    frictions TEXT[] DEFAULT '{}',
    recommendations TEXT[] DEFAULT '{}',
    computed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS sur toutes les tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les utilisateurs
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (email = auth.jwt() ->> 'email');

CREATE POLICY "Users can insert own data" ON users
    FOR INSERT WITH CHECK (email = auth.jwt() ->> 'email');

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (email = auth.jwt() ->> 'email');

-- Politiques pour les questions (lecture publique)
CREATE POLICY "Questions are viewable by everyone" ON questions
    FOR SELECT TO authenticated USING (true);

-- Politiques pour les paires
CREATE POLICY "Users can view their pairs" ON pairs
    FOR SELECT USING (
        user_a_email = auth.jwt() ->> 'email' OR 
        user_b_email = auth.jwt() ->> 'email'
    );

CREATE POLICY "Users can create pairs" ON pairs
    FOR INSERT WITH CHECK (user_a_email = auth.jwt() ->> 'email');

CREATE POLICY "Users can update their pairs" ON pairs
    FOR UPDATE USING (
        user_a_email = auth.jwt() ->> 'email' OR 
        user_b_email = auth.jwt() ->> 'email'
    );

-- Politiques pour les réponses
CREATE POLICY "Users can view answers for their pairs" ON answers
    FOR SELECT USING (
        pair_id IN (
            SELECT id FROM pairs 
            WHERE user_a_email = auth.jwt() ->> 'email' 
               OR user_b_email = auth.jwt() ->> 'email'
        )
    );

CREATE POLICY "Users can insert answers for their pairs" ON answers
    FOR INSERT WITH CHECK (
        pair_id IN (
            SELECT id FROM pairs 
            WHERE user_a_email = auth.jwt() ->> 'email' 
               OR user_b_email = auth.jwt() ->> 'email'
        )
    );

-- Politiques pour les matches
CREATE POLICY "Users can view matches for their pairs" ON matches
    FOR SELECT USING (
        pair_id IN (
            SELECT id FROM pairs 
            WHERE user_a_email = auth.jwt() ->> 'email' 
               OR user_b_email = auth.jwt() ->> 'email'
        )
    );

CREATE POLICY "Users can insert matches for their pairs" ON matches
    FOR INSERT WITH CHECK (
        pair_id IN (
            SELECT id FROM pairs 
            WHERE user_a_email = auth.jwt() ->> 'email' 
               OR user_b_email = auth.jwt() ->> 'email'
        )
    );

-- Index pour optimiser les performances
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_email_hash ON users(email_hash);
CREATE INDEX idx_pairs_tokens ON pairs(invite_token);
CREATE INDEX idx_pairs_status ON pairs(status);
CREATE INDEX idx_answers_pair_question ON answers(pair_id, question_id);
CREATE INDEX idx_questions_category ON questions(category);
CREATE INDEX idx_questions_order ON questions(order_index);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE OR REPLACE TRIGGER update_pairs_updated_at BEFORE UPDATE ON pairs FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Confirmation
SELECT 'Migration terminée avec succès!' as status;
SELECT 'Tables créées:' as info;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
