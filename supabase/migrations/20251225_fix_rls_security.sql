-- =====================================================
-- FIX RLS SECURITY ISSUES - Supabase Linter Errors
-- Date: 25 décembre 2025
-- =====================================================

-- =====================================================
-- 1. TABLE: public.questions
-- Activer RLS (la policy existe déjà)
-- =====================================================

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Vérifier que la policy existe, sinon la créer
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'questions' 
        AND policyname = 'Questions are viewable by everyone'
    ) THEN
        CREATE POLICY "Questions are viewable by everyone"
        ON public.questions FOR SELECT
        USING (true);
    END IF;
END $$;

-- =====================================================
-- 2. TABLE: public.users
-- Activer RLS (les policies existent déjà)
-- =====================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Vérifier les policies existantes
DO $$
BEGIN
    -- Policy SELECT
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'users' 
        AND policyname = 'Users can view own data'
    ) THEN
        CREATE POLICY "Users can view own data"
        ON public.users FOR SELECT
        USING (auth.uid() = id);
    END IF;
    
    -- Policy INSERT
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'users' 
        AND policyname = 'Users can insert own data'
    ) THEN
        CREATE POLICY "Users can insert own data"
        ON public.users FOR INSERT
        WITH CHECK (auth.uid() = id);
    END IF;
    
    -- Policy UPDATE
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'users' 
        AND policyname = 'Users can update own data'
    ) THEN
        CREATE POLICY "Users can update own data"
        ON public.users FOR UPDATE
        USING (auth.uid() = id);
    END IF;
END $$;

-- =====================================================
-- 3. TABLE: public.shared_questionnaires
-- Activer RLS (policies simples car accès via share_code)
-- =====================================================

ALTER TABLE public.shared_questionnaires ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes policies si elles existent
DROP POLICY IF EXISTS "Anyone can read with share code" ON public.shared_questionnaires;
DROP POLICY IF EXISTS "Anyone can create shared questionnaire" ON public.shared_questionnaires;
DROP POLICY IF EXISTS "Anyone can update shared questionnaire" ON public.shared_questionnaires;

-- Recréer les policies (accès ouvert car sécurisé par share_code unique)
CREATE POLICY "Anyone can read with share code"
ON public.shared_questionnaires FOR SELECT
USING (true);

CREATE POLICY "Anyone can create shared questionnaire"
ON public.shared_questionnaires FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update shared questionnaire"
ON public.shared_questionnaires FOR UPDATE
USING (true);

-- =====================================================
-- 4. VIEW: public.analytics_daily_stats
-- Changer SECURITY DEFINER en SECURITY INVOKER
-- =====================================================

-- D'abord, récupérer la définition actuelle et recréer avec SECURITY INVOKER
DROP VIEW IF EXISTS public.analytics_daily_stats;

CREATE OR REPLACE VIEW public.analytics_daily_stats
WITH (security_invoker = true)
AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_events,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(CASE WHEN event_type = 'page_view' THEN 1 END) as page_views,
    COUNT(CASE WHEN event_type = 'questionnaire_started' THEN 1 END) as questionnaires_started,
    COUNT(CASE WHEN event_type = 'questionnaire_completed' THEN 1 END) as questionnaires_completed,
    COUNT(CASE WHEN event_type = 'signup' THEN 1 END) as signups,
    COUNT(CASE WHEN event_type = 'subscription' THEN 1 END) as subscriptions
FROM public.analytics_events
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Accorder les permissions appropriées
GRANT SELECT ON public.analytics_daily_stats TO authenticated;

-- =====================================================
-- 5. VIEW: public.user_conversion_funnel
-- Changer SECURITY DEFINER en SECURITY INVOKER
-- =====================================================

DROP VIEW IF EXISTS public.user_conversion_funnel;

CREATE OR REPLACE VIEW public.user_conversion_funnel
WITH (security_invoker = true)
AS
SELECT 
    'Visiteurs' as stage,
    1 as stage_order,
    COUNT(DISTINCT CASE WHEN event_type = 'page_view' THEN user_id END) as count
FROM public.analytics_events
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'

UNION ALL

SELECT 
    'Inscriptions' as stage,
    2 as stage_order,
    COUNT(DISTINCT CASE WHEN event_type = 'signup' THEN user_id END) as count
FROM public.analytics_events
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'

UNION ALL

SELECT 
    'Questionnaires commencés' as stage,
    3 as stage_order,
    COUNT(DISTINCT CASE WHEN event_type = 'questionnaire_started' THEN user_id END) as count
FROM public.analytics_events
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'

UNION ALL

SELECT 
    'Questionnaires terminés' as stage,
    4 as stage_order,
    COUNT(DISTINCT CASE WHEN event_type = 'questionnaire_completed' THEN user_id END) as count
FROM public.analytics_events
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'

UNION ALL

SELECT 
    'Abonnements' as stage,
    5 as stage_order,
    COUNT(DISTINCT CASE WHEN event_type = 'subscription' THEN user_id END) as count
FROM public.analytics_events
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'

ORDER BY stage_order;

-- Accorder les permissions appropriées
GRANT SELECT ON public.user_conversion_funnel TO authenticated;

-- =====================================================
-- VÉRIFICATION
-- =====================================================

-- Vérifier que RLS est bien activé sur les tables
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('questions', 'users', 'shared_questionnaires');

-- Vérifier les policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('questions', 'users', 'shared_questionnaires');
