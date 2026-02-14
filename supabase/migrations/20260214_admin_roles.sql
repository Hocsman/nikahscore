-- =====================================================
-- Admin Roles Table - Gestion admin par base de données
-- Remplace les emails hardcodés et user_metadata exploitable
-- =====================================================

-- 1. Créer la table admin_roles
CREATE TABLE IF NOT EXISTS public.admin_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    role VARCHAR(50) DEFAULT 'admin' NOT NULL,
    granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Activer RLS
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

-- 3. Politique RLS : chaque utilisateur ne peut voir que sa propre ligne
CREATE POLICY "Users can read own admin role"
    ON public.admin_roles FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- 4. Pas de politique INSERT/UPDATE/DELETE pour les utilisateurs normaux
-- Seul le service_role peut gérer admin_roles (bypass RLS)

-- 5. Index pour recherche rapide par user_id
CREATE INDEX IF NOT EXISTS idx_admin_roles_user_id ON public.admin_roles(user_id);

-- 6. Seed des admins existants
INSERT INTO public.admin_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE email = 'admin@nikahscore.fr'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.admin_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE email = 'hocsman@gmail.com'
ON CONFLICT (user_id) DO NOTHING;

-- 7. Remplacer la fonction is_admin() exploitable par une version sécurisée
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;
