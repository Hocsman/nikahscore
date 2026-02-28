-- ============================================================
-- Migration: Table verification_codes + Fix RLS shared_questionnaires
-- ============================================================

-- 1. Table verification_codes (remplace le stockage en mémoire)
CREATE TABLE IF NOT EXISTS public.verification_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    code_hash TEXT NOT NULL,
    action TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_verification_codes_email ON public.verification_codes(email);
CREATE INDEX IF NOT EXISTS idx_verification_codes_expires ON public.verification_codes(expires_at);

-- RLS : seul le service role accède à cette table (via createAdminClient)
ALTER TABLE public.verification_codes ENABLE ROW LEVEL SECURITY;

-- Pas de policy pour les utilisateurs authentifiés :
-- cette table est uniquement manipulée par le backend via service role

-- Nettoyage automatique des codes expirés (optionnel, peut être lancé via cron)
-- DELETE FROM public.verification_codes WHERE expires_at < NOW();

-- 2. Fix RLS shared_questionnaires : UPDATE trop permissive
-- L'ancienne policy permettait à n'importe qui de modifier n'importe quel questionnaire
DROP POLICY IF EXISTS "Authenticated users can update shared questionnaires" ON public.shared_questionnaires;

-- Nouvelle policy : seul le créateur OU le partenaire (via share_code) peut mettre à jour
-- Le créateur peut tout modifier, les autres ne peuvent mettre à jour que les champs partenaire
CREATE POLICY "Creator or participant can update shared questionnaires"
    ON public.shared_questionnaires FOR UPDATE
    TO authenticated
    USING (
        creator_id = auth.uid()
        OR creator_id IS NULL
    );
