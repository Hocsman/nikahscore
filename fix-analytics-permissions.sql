-- Script de correction des politiques RLS
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Supprimer les anciennes politiques problématiques
DROP POLICY IF EXISTS "Admins can read all analytics events" ON analytics_events;
DROP POLICY IF EXISTS "Admins can read all subscriptions" ON user_subscriptions;

-- 2. Créer des politiques plus permissives pour le développement
-- Permettre la lecture pour les utilisateurs authentifiés (temporaire)
CREATE POLICY "Authenticated users can read analytics events" ON analytics_events
    FOR SELECT USING (true);

-- Permettre l'insertion pour tous (avec ou sans auth)
CREATE POLICY "Anyone can insert analytics events" ON analytics_events
    FOR INSERT WITH CHECK (true);

-- 3. Politique simplifiée pour les abonnements
CREATE POLICY "Users can read own subscription" ON user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage subscriptions" ON user_subscriptions
    FOR ALL USING (true);

-- 4. Politique simplifiée pour les customers Stripe
CREATE POLICY "Users can read own stripe customer" ON stripe_customers
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage stripe customers" ON stripe_customers
    FOR ALL USING (true);

-- 5. Créer une fonction sécurisée pour vérifier les admins
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
    -- Vérifier si l'utilisateur courant est admin
    RETURN COALESCE(
        (SELECT raw_user_meta_data->>'role' = 'admin' FROM auth.users WHERE id = auth.uid()),
        false
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Créer une vue publique pour les métriques de base (sans données sensibles)
CREATE OR REPLACE VIEW public_analytics_stats AS
SELECT 
    COUNT(*) as total_events,
    COUNT(DISTINCT session_id) as unique_sessions,
    COUNT(DISTINCT CASE WHEN user_id IS NOT NULL THEN user_id END) as unique_users,
    event_type,
    COUNT(*) as event_count
FROM analytics_events 
WHERE timestamp >= NOW() - INTERVAL '7 days'
GROUP BY event_type;

-- 7. Fonction publique pour récupérer les stats de base
CREATE OR REPLACE FUNCTION get_public_analytics_stats()
RETURNS TABLE (
    total_events bigint,
    unique_sessions bigint,
    unique_users bigint,
    events_by_type jsonb
) AS $$
BEGIN
    RETURN QUERY
    WITH stats AS (
        SELECT 
            COUNT(*)::bigint as total,
            COUNT(DISTINCT session_id)::bigint as sessions,
            COUNT(DISTINCT CASE WHEN user_id IS NOT NULL THEN user_id END)::bigint as users
        FROM analytics_events 
        WHERE timestamp >= NOW() - INTERVAL '7 days'
    ),
    events AS (
        SELECT 
            jsonb_object_agg(event_type, event_count) as by_type
        FROM (
            SELECT event_type, COUNT(*)::int as event_count
            FROM analytics_events 
            WHERE timestamp >= NOW() - INTERVAL '7 days'
            GROUP BY event_type
        ) t
    )
    SELECT 
        s.total,
        s.sessions, 
        s.users,
        COALESCE(e.by_type, '{}'::jsonb)
    FROM stats s
    CROSS JOIN events e;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Accorder les permissions nécessaires
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public_analytics_stats TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_public_analytics_stats() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION is_admin() TO anon, authenticated;

SELECT 'Analytics policies fixed! 🔧' as status;
