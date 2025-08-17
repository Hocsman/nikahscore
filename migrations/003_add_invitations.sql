-- Migration pour ajouter le support des invitations
-- À exécuter dans Supabase SQL Editor

-- Ajouter la colonne invite_token à la table pairs
ALTER TABLE pairs 
ADD COLUMN IF NOT EXISTS invite_token TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS invite_expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS invited_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- Index pour les recherches par token
CREATE INDEX IF NOT EXISTS idx_pairs_invite_token ON pairs(invite_token);

-- Fonction pour générer un token unique
CREATE OR REPLACE FUNCTION generate_invite_token()
RETURNS TEXT AS $$
BEGIN
    RETURN encode(gen_random_bytes(32), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Politique RLS pour les invitations
CREATE POLICY "Users can view pairs they're invited to" ON pairs
    FOR SELECT USING (
        auth.jwt() ->> 'email' = user_a_email 
        OR auth.jwt() ->> 'email' = user_b_email
    );

-- Permettre aux utilisateurs authentifiés d'accepter les invitations
CREATE POLICY "Authenticated users can accept invitations" ON pairs
    FOR UPDATE USING (
        auth.role() = 'authenticated'
        AND invite_token IS NOT NULL
        AND invite_expires_at > NOW()
    );
