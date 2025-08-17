-- Migration: Ajout des tables pour modèle économique et système d'invitation
-- Tables: couples, subscriptions, payments, responses

-- Table des couples (paires de questionnaires)
CREATE TABLE couples (
    id BIGSERIAL PRIMARY KEY,
    pair_id UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    invite_token UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    
    -- Informations des participants
    initiator_email VARCHAR(255) NOT NULL,
    partner_email VARCHAR(255) NOT NULL,
    initiator_name VARCHAR(100),
    partner_name VARCHAR(100),
    
    -- État du processus
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'both_completed', 'expired')),
    initiator_completed BOOLEAN DEFAULT FALSE,
    partner_completed BOOLEAN DEFAULT FALSE,
    
    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '7 days',
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Résultats
    compatibility_score INTEGER,
    report_generated BOOLEAN DEFAULT FALSE,
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'expired'))
);

-- Table des réponses aux questionnaires
CREATE TABLE responses (
    id BIGSERIAL PRIMARY KEY,
    pair_id UUID REFERENCES couples(pair_id) ON DELETE CASCADE,
    question_id BIGINT REFERENCES questions(id) ON DELETE CASCADE,
    
    -- Qui répond (initiator ou partner)
    respondent VARCHAR(20) NOT NULL CHECK (respondent IN ('initiator', 'partner')),
    
    -- Réponse
    answer_value INTEGER, -- Pour les échelles (1-5)
    answer_boolean BOOLEAN, -- Pour les bool
    
    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(pair_id, question_id, respondent)
);

-- Table des abonnements
CREATE TABLE subscriptions (
    id BIGSERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    
    -- Type d'abonnement
    plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('free', 'premium', 'unlimited')),
    
    -- État
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
    
    -- Limites et utilisation
    tests_included INTEGER DEFAULT 1, -- Nombre de tests inclus
    tests_used INTEGER DEFAULT 0, -- Nombre de tests utilisés
    
    -- Dates
    starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ends_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Stripe
    stripe_subscription_id VARCHAR(255),
    stripe_customer_id VARCHAR(255)
);

-- Table des paiements
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    couple_id BIGINT REFERENCES couples(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    
    -- Montant
    amount_cents INTEGER NOT NULL, -- En centimes (999 = 9.99€)
    currency VARCHAR(3) DEFAULT 'EUR',
    
    -- État du paiement
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    
    -- Stripe
    stripe_payment_intent_id VARCHAR(255),
    stripe_session_id VARCHAR(255),
    
    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Index pour les performances
CREATE INDEX idx_couples_pair_id ON couples(pair_id);
CREATE INDEX idx_couples_emails ON couples(initiator_email, partner_email);
CREATE INDEX idx_responses_pair_respondent ON responses(pair_id, respondent);
CREATE INDEX idx_subscriptions_email ON subscriptions(user_email);
CREATE INDEX idx_payments_couple_id ON payments(couple_id);

-- Row Level Security (RLS)
ALTER TABLE couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Politiques RLS basiques (à affiner selon besoins)
CREATE POLICY "Users can view their couples" ON couples
    FOR SELECT USING (
        initiator_email = current_setting('request.jwt.claims', true)::json->>'email' OR
        partner_email = current_setting('request.jwt.claims', true)::json->>'email'
    );

CREATE POLICY "Users can insert couples" ON couples
    FOR INSERT WITH CHECK (true); -- Permettre création libre pour invitations

CREATE POLICY "Users can view their responses" ON responses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM couples c 
            WHERE c.pair_id = responses.pair_id 
            AND (c.initiator_email = current_setting('request.jwt.claims', true)::json->>'email' OR
                 c.partner_email = current_setting('request.jwt.claims', true)::json->>'email')
        )
    );

-- Fonctions utilitaires

-- Fonction pour vérifier si un couple a terminé les deux questionnaires
CREATE OR REPLACE FUNCTION check_couple_completion()
RETURNS TRIGGER AS $$
BEGIN
    -- Compter les réponses de chaque participant
    UPDATE couples 
    SET 
        initiator_completed = (
            SELECT COUNT(*) = (SELECT COUNT(*) FROM questions)
            FROM responses r 
            WHERE r.pair_id = NEW.pair_id AND r.respondent = 'initiator'
        ),
        partner_completed = (
            SELECT COUNT(*) = (SELECT COUNT(*) FROM questions)
            FROM responses r 
            WHERE r.pair_id = NEW.pair_id AND r.respondent = 'partner'
        )
    WHERE pair_id = NEW.pair_id;
    
    -- Marquer comme terminé si les deux ont fini
    UPDATE couples 
    SET 
        status = 'both_completed',
        completed_at = NOW()
    WHERE pair_id = NEW.pair_id 
    AND initiator_completed = TRUE 
    AND partner_completed = TRUE 
    AND status = 'pending';
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour vérifier automatiquement la complétion
CREATE TRIGGER trigger_check_completion
    AFTER INSERT OR UPDATE ON responses
    FOR EACH ROW
    EXECUTE FUNCTION check_couple_completion();

-- Fonction pour calculer le score de compatibilité (basique)
CREATE OR REPLACE FUNCTION calculate_compatibility_score(couple_pair_id UUID)
RETURNS INTEGER AS $$
DECLARE
    total_questions INTEGER;
    matching_answers INTEGER;
    dealbreaker_conflicts INTEGER;
    base_score INTEGER;
    final_score INTEGER;
BEGIN
    -- Compter le total de questions
    SELECT COUNT(*) INTO total_questions FROM questions;
    
    -- Compter les réponses identiques (même question, même valeur)
    SELECT COUNT(*) INTO matching_answers
    FROM responses r1
    JOIN responses r2 ON r1.question_id = r2.question_id
    JOIN questions q ON r1.question_id = q.id
    WHERE r1.pair_id = couple_pair_id 
    AND r2.pair_id = couple_pair_id
    AND r1.respondent = 'initiator'
    AND r2.respondent = 'partner'
    AND (
        (r1.answer_value = r2.answer_value AND q.category = 'scale') OR
        (r1.answer_boolean = r2.answer_boolean AND q.category = 'bool')
    );
    
    -- Compter les conflits sur les deal-breakers
    SELECT COUNT(*) INTO dealbreaker_conflicts
    FROM responses r1
    JOIN responses r2 ON r1.question_id = r2.question_id
    JOIN questions q ON r1.question_id = q.id
    WHERE r1.pair_id = couple_pair_id 
    AND r2.pair_id = couple_pair_id
    AND r1.respondent = 'initiator'
    AND r2.respondent = 'partner'
    AND q.is_dealbreaker = TRUE
    AND (
        (r1.answer_value != r2.answer_value AND q.category = 'scale') OR
        (r1.answer_boolean != r2.answer_boolean AND q.category = 'bool')
    );
    
    -- Calcul du score de base (pourcentage de compatibilité)
    base_score := ROUND((matching_answers::FLOAT / total_questions::FLOAT) * 100);
    
    -- Pénalité pour chaque deal-breaker en conflit (-10 points)
    final_score := base_score - (dealbreaker_conflicts * 10);
    
    -- Limiter entre 0 et 100
    final_score := GREATEST(0, LEAST(100, final_score));
    
    -- Mettre à jour le score dans la table couples
    UPDATE couples 
    SET compatibility_score = final_score 
    WHERE pair_id = couple_pair_id;
    
    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE couples IS 'Paires de personnes effectuant le test de compatibilité';
COMMENT ON TABLE responses IS 'Réponses aux questions du questionnaire';
COMMENT ON TABLE subscriptions IS 'Abonnements et limites utilisateur';
COMMENT ON TABLE payments IS 'Historique des paiements Stripe';
