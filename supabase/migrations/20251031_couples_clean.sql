-- ==========================================
-- ÉTAPE 1: NETTOYER LES ANCIENNES TABLES
-- ==========================================
-- ⚠️ ATTENTION : Ceci supprime les données existantes !
-- Si tu as des données importantes, fais un backup d'abord

DROP TABLE IF EXISTS compatibility_results CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS responses CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS couples CASCADE;

-- ==========================================
-- ÉTAPE 2: CRÉER LES NOUVELLES TABLES
-- ==========================================

-- Migration: Système de couples partagés avec codes + Résultats de compatibilité
-- Date: 31 octobre 2025
-- Tables: couples (nouveau schéma), compatibility_results

-- TABLE COUPLES (avec codes et auth.users)
CREATE TABLE couples (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    couple_code VARCHAR(10) UNIQUE NOT NULL,
    
    -- Utilisateurs (références vers auth.users)
    creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    partner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Statuts
    status VARCHAR(30) DEFAULT 'waiting_partner' CHECK (
        status IN ('waiting_partner', 'active', 'completed', 'expired')
    ),
    
    -- Dates
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    partner_joined_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '30 days',
    
    -- Métadonnées
    creator_completed BOOLEAN DEFAULT FALSE,
    partner_completed BOOLEAN DEFAULT FALSE
);

-- TABLE COMPATIBILITY_RESULTS
CREATE TABLE compatibility_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
    
    -- Score global
    overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
    
    -- Scores par dimension (0-100)
    spirituality_score INTEGER CHECK (spirituality_score >= 0 AND spirituality_score <= 100),
    family_score INTEGER CHECK (family_score >= 0 AND family_score <= 100),
    communication_score INTEGER CHECK (communication_score >= 0 AND communication_score <= 100),
    values_score INTEGER CHECK (values_score >= 0 AND values_score <= 100),
    finance_score INTEGER CHECK (finance_score >= 0 AND finance_score <= 100),
    intimacy_score INTEGER CHECK (intimacy_score >= 0 AND intimacy_score <= 100),
    
    -- Insights et recommandations (JSON)
    strengths JSONB DEFAULT '[]'::jsonb,
    improvements JSONB DEFAULT '[]'::jsonb,
    recommendations JSONB DEFAULT '[]'::jsonb,
    
    -- Métadonnées
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE SUBSCRIPTIONS (pour Premium)
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Type et statut
    plan_type VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (
        plan_type IN ('free', 'premium', 'lifetime')
    ),
    status VARCHAR(20) DEFAULT 'active' CHECK (
        status IN ('active', 'cancelled', 'expired', 'past_due')
    ),
    
    -- Stripe
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    stripe_price_id VARCHAR(255),
    
    -- Dates
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    
    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- INDEX POUR PERFORMANCES
-- ==========================================
CREATE INDEX idx_couples_creator ON couples(creator_id);
CREATE INDEX idx_couples_partner ON couples(partner_id);
CREATE INDEX idx_couples_code ON couples(couple_code);
CREATE INDEX idx_couples_status ON couples(status);
CREATE INDEX idx_compatibility_couple ON compatibility_results(couple_id);
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_stripe_subscription ON subscriptions(stripe_subscription_id);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================
ALTER TABLE couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE compatibility_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Politique: Les utilisateurs peuvent voir les couples dont ils font partie
CREATE POLICY "Users can view their own couples"
    ON couples
    FOR SELECT
    USING (
        auth.uid() = creator_id OR 
        auth.uid() = partner_id
    );

-- Politique: Les utilisateurs peuvent créer des couples
CREATE POLICY "Users can create couples"
    ON couples
    FOR INSERT
    WITH CHECK (auth.uid() = creator_id);

-- Politique: Les créateurs et partenaires peuvent mettre à jour leurs couples
CREATE POLICY "Users can update their couples"
    ON couples
    FOR UPDATE
    USING (
        auth.uid() = creator_id OR 
        auth.uid() = partner_id
    );

-- Politique: Les utilisateurs peuvent voir les résultats de leurs couples
CREATE POLICY "Users can view their compatibility results"
    ON compatibility_results
    FOR SELECT
    USING (
        couple_id IN (
            SELECT id FROM couples 
            WHERE auth.uid() = creator_id OR auth.uid() = partner_id
        )
    );

-- Politique: Permettre l'insertion de résultats (API backend)
CREATE POLICY "Allow insert compatibility results"
    ON compatibility_results
    FOR INSERT
    WITH CHECK (
        couple_id IN (
            SELECT id FROM couples 
            WHERE auth.uid() = creator_id OR auth.uid() = partner_id
        )
    );

-- Politique: Voir son propre abonnement
CREATE POLICY "Users can view their own subscription"
    ON subscriptions
    FOR SELECT
    USING (auth.uid() = user_id);

-- Politique: Insérer son propre abonnement
CREATE POLICY "Users can insert their own subscription"
    ON subscriptions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Politique: Mettre à jour son propre abonnement
CREATE POLICY "Users can update their own subscription"
    ON subscriptions
    FOR UPDATE
    USING (auth.uid() = user_id);

-- ==========================================
-- FONCTION: Générer code couple unique
-- ==========================================
CREATE OR REPLACE FUNCTION generate_couple_code() 
RETURNS VARCHAR(10) AS $$
DECLARE
    code VARCHAR(10);
    exists BOOLEAN;
BEGIN
    LOOP
        -- Générer code aléatoire (format: ABC-12345)
        code := upper(substring(md5(random()::text) from 1 for 3)) || '-' || 
                lpad(floor(random() * 100000)::text, 5, '0');
        
        -- Vérifier si le code existe déjà
        SELECT COUNT(*) > 0 INTO exists FROM couples WHERE couple_code = code;
        
        -- Si le code est unique, le retourner
        EXIT WHEN NOT exists;
    END LOOP;
    
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- TRIGGER: Auto-générer couple_code
-- ==========================================
CREATE OR REPLACE FUNCTION set_couple_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.couple_code IS NULL OR NEW.couple_code = '' THEN
        NEW.couple_code := generate_couple_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_couple_code
    BEFORE INSERT ON couples
    FOR EACH ROW
    EXECUTE FUNCTION set_couple_code();

-- ==========================================
-- COMMENTAIRES
-- ==========================================
COMMENT ON TABLE couples IS 'Table des couples pour les questionnaires partagés';
COMMENT ON TABLE compatibility_results IS 'Résultats de compatibilité par couple';
COMMENT ON TABLE subscriptions IS 'Abonnements Premium des utilisateurs';
COMMENT ON COLUMN couples.couple_code IS 'Code unique pour rejoindre le questionnaire couple (format: ABC-12345)';
COMMENT ON COLUMN couples.creator_id IS 'Utilisateur qui a créé le questionnaire couple';
COMMENT ON COLUMN couples.partner_id IS 'Partenaire qui a rejoint avec le code';
COMMENT ON COLUMN subscriptions.plan_type IS 'Type d''abonnement: free, premium, lifetime';
COMMENT ON COLUMN subscriptions.stripe_customer_id IS 'ID client Stripe pour facturation';

-- ==========================================
-- VÉRIFICATION
-- ==========================================
-- Afficher les tables créées
SELECT 
    'Tables créées avec succès:' as status,
    table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('couples', 'compatibility_results', 'subscriptions')
ORDER BY table_name;

-- Test de génération de code
SELECT 
    'Test génération code couple:' as test,
    generate_couple_code() as code_exemple;
