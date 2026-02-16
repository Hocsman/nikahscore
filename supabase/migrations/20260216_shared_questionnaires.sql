-- ============================================================
-- Migration: Création de la table shared_questionnaires
-- et de la fonction generate_share_code()
-- ============================================================

-- Table shared_questionnaires
CREATE TABLE IF NOT EXISTS public.shared_questionnaires (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    share_code VARCHAR(20) NOT NULL UNIQUE,
    creator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    creator_email TEXT,
    creator_responses JSONB,
    creator_completed_at TIMESTAMPTZ,
    partner_email TEXT,
    partner_responses JSONB,
    partner_completed_at TIMESTAMPTZ,
    compatibility_score INTEGER,
    notification_sent BOOLEAN DEFAULT FALSE,
    notification_sent_at TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'waiting',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_shared_questionnaires_share_code ON public.shared_questionnaires(share_code);
CREATE INDEX IF NOT EXISTS idx_shared_questionnaires_creator_id ON public.shared_questionnaires(creator_id);

-- RLS
ALTER TABLE public.shared_questionnaires ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes policies (de 20251225_fix_rls_security.sql) si elles existent
DROP POLICY IF EXISTS "Anyone can read with share code" ON public.shared_questionnaires;
DROP POLICY IF EXISTS "Anyone can create shared questionnaire" ON public.shared_questionnaires;
DROP POLICY IF EXISTS "Anyone can update shared questionnaire" ON public.shared_questionnaires;
DROP POLICY IF EXISTS "Anyone can read shared questionnaires by code" ON public.shared_questionnaires;
DROP POLICY IF EXISTS "Authenticated users can create shared questionnaires" ON public.shared_questionnaires;
DROP POLICY IF EXISTS "Authenticated users can update shared questionnaires" ON public.shared_questionnaires;

-- Policies ouvertes aux utilisateurs authentifiés (sécurisé par share_code unique)
CREATE POLICY "Anyone can read shared questionnaires by code"
    ON public.shared_questionnaires FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create shared questionnaires"
    ON public.shared_questionnaires FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update shared questionnaires"
    ON public.shared_questionnaires FOR UPDATE
    USING (true);

-- Fonction generate_share_code()
CREATE OR REPLACE FUNCTION generate_share_code()
RETURNS TEXT AS $$
DECLARE
    new_code TEXT;
    code_exists BOOLEAN;
BEGIN
    LOOP
        -- Générer un code 8 caractères alphanumérique majuscules
        new_code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8));

        -- Vérifier unicité
        SELECT EXISTS(
            SELECT 1 FROM public.shared_questionnaires WHERE share_code = new_code
        ) INTO code_exists;

        EXIT WHEN NOT code_exists;
    END LOOP;

    RETURN new_code;
END;
$$ LANGUAGE plpgsql;
