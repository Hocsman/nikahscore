-- Migration initiale : tables principales
-- Créé le : 2025-01-01

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des utilisateurs (profils)
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  email_hash VARCHAR(64) UNIQUE NOT NULL, -- SHA-256 de l'email pour l'anonymisation
  age INTEGER CHECK (age >= 18 AND age <= 100),
  city VARCHAR(100),
  practice_level VARCHAR(20) CHECK (practice_level IN ('debutant', 'pratiquant', 'tres_pratiquant')),
  marriage_intention VARCHAR(30) CHECK (marriage_intention IN ('dans_annee', 'dans_2_ans', 'pas_presse')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des couples/paires
CREATE TABLE pairs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_a_email VARCHAR(255) NOT NULL,
  user_b_email VARCHAR(255),
  user_a_hash VARCHAR(64) NOT NULL, -- Hash de l'email A
  user_b_hash VARCHAR(64), -- Hash de l'email B
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'both_completed', 'expired')),
  invite_token VARCHAR(100) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des questions du questionnaire
CREATE TABLE questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  text TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('valeurs_religieuses', 'mode_de_vie', 'famille', 'finances', 'intimite', 'projets_avenir')),
  axis VARCHAR(50) NOT NULL CHECK (axis IN ('spiritualite', 'tradition', 'ouverture', 'ambition', 'stabilite', 'compatibilite')),
  is_dealbreaker BOOLEAN DEFAULT FALSE,
  order_index INTEGER NOT NULL,
  weight DECIMAL(3,2) DEFAULT 1.00 CHECK (weight >= 0.5 AND weight <= 2.0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des réponses
CREATE TABLE answers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  pair_id UUID NOT NULL REFERENCES pairs(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  respondent VARCHAR(1) NOT NULL CHECK (respondent IN ('A', 'B')),
  value INTEGER NOT NULL CHECK (value >= 1 AND value <= 5),
  importance INTEGER NOT NULL CHECK (importance >= 1 AND importance <= 3),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(pair_id, question_id, respondent)
);

-- Table des résultats de compatibilité
CREATE TABLE matches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  pair_id UUID NOT NULL REFERENCES pairs(id) ON DELETE CASCADE UNIQUE,
  overall_score DECIMAL(5,2) NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  axis_scores JSONB NOT NULL, -- Scores par axe : {"spiritualite": 85, "tradition": 92, ...}
  dealbreaker_conflicts INTEGER DEFAULT 0,
  strengths TEXT[], -- Points forts identifiés
  frictions TEXT[], -- Points de friction identifiés
  recommendations TEXT[], -- Conseils personnalisés
  computed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des feedbacks utilisateurs
CREATE TABLE feedbacks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  pair_id UUID NOT NULL REFERENCES pairs(id) ON DELETE CASCADE,
  respondent VARCHAR(1) NOT NULL CHECK (respondent IN ('A', 'B')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_accurate BOOLEAN,
  suggestions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des blocages/reports
CREATE TABLE blocks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  pair_id UUID NOT NULL REFERENCES pairs(id) ON DELETE CASCADE,
  reported_by VARCHAR(1) NOT NULL CHECK (reported_by IN ('A', 'B')),
  reason VARCHAR(100) NOT NULL,
  details TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX idx_pairs_status ON pairs(status);
CREATE INDEX idx_pairs_expires_at ON pairs(expires_at);
CREATE INDEX idx_answers_pair_id ON answers(pair_id);
CREATE INDEX idx_questions_category ON questions(category);
CREATE INDEX idx_questions_order ON questions(order_index);
CREATE INDEX idx_matches_pair_id ON matches(pair_id);

-- Fonction pour mise à jour automatique de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pairs_updated_at BEFORE UPDATE ON pairs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
