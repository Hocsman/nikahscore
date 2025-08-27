-- Script de déploiement des analytics NikahScore
-- À copier/coller dans l'éditeur SQL de Supabase

-- 0. Table pour les profils utilisateur
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS pour les profils
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Politique pour que les utilisateurs puissent lire leur propre profil
CREATE POLICY "Users can read own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Politique pour que les utilisateurs puissent mettre à jour leur propre profil
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Politique pour insertion automatique du profil
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Index pour les profils
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- 1. Table pour les événements analytics
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id VARCHAR(100) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    properties JSONB DEFAULT '{}',
    user_plan VARCHAR(20) DEFAULT 'free',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour optimiser les requêtes analytics
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON analytics_events(session_id);

-- 2. Table pour les customers Stripe
CREATE TABLE IF NOT EXISTS stripe_customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    stripe_customer_id VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table pour les abonnements utilisateur
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    stripe_customer_id VARCHAR(100) NOT NULL,
    stripe_subscription_id VARCHAR(100) NOT NULL UNIQUE,
    plan VARCHAR(20) NOT NULL CHECK (plan IN ('free', 'premium', 'family', 'conseil')),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    canceled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les abonnements
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe ON user_subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);

-- 4. RLS (Row Level Security) pour les analytics
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre à tous les utilisateurs d'insérer leurs propres événements
CREATE POLICY "Users can insert their own analytics events" ON analytics_events
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR user_id IS NULL
    );

-- Politique pour que les admins puissent lire tous les événements
CREATE POLICY "Admins can read all analytics events" ON analytics_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.uid() = id 
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

-- 5. RLS pour les abonnements
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Politique pour que les utilisateurs puissent lire leur propre abonnement
CREATE POLICY "Users can read own subscription" ON user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Politique pour que les admins puissent tout lire
CREATE POLICY "Admins can read all subscriptions" ON user_subscriptions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.uid() = id 
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

-- 6. RLS pour les customers Stripe
ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;

-- Politique pour que les utilisateurs puissent lire leurs propres données Stripe
CREATE POLICY "Users can read own stripe customer" ON stripe_customers
    FOR SELECT USING (auth.uid() = user_id);

-- 7. Vues analytiques utiles
CREATE OR REPLACE VIEW analytics_daily_stats AS
SELECT 
    DATE(timestamp) as date,
    event_type,
    user_plan,
    COUNT(*) as count
FROM analytics_events
GROUP BY DATE(timestamp), event_type, user_plan
ORDER BY date DESC, event_type;

CREATE OR REPLACE VIEW user_conversion_funnel AS
SELECT 
    session_id,
    MIN(CASE WHEN event_type = 'page_view' THEN timestamp END) as first_visit,
    MIN(CASE WHEN event_type = 'questionnaire_start' THEN timestamp END) as questionnaire_start,
    MIN(CASE WHEN event_type = 'questionnaire_complete' THEN timestamp END) as questionnaire_complete,
    MIN(CASE WHEN event_type = 'user_register' THEN timestamp END) as user_register,
    MIN(CASE WHEN event_type = 'subscription_created' THEN timestamp END) as subscription_created
FROM analytics_events
GROUP BY session_id;

-- 8. Fonction pour calculer les métriques business
CREATE OR REPLACE FUNCTION get_business_metrics(days_back INTEGER DEFAULT 30)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    total_users INTEGER;
    active_users INTEGER;
    premium_users INTEGER;
    conversion_rate DECIMAL;
    mrr DECIMAL;
BEGIN
    -- Utilisateurs totaux
    SELECT COUNT(*) INTO total_users FROM auth.users;
    
    -- Utilisateurs actifs (derniers X jours)
    SELECT COUNT(DISTINCT user_id) INTO active_users 
    FROM analytics_events 
    WHERE timestamp >= NOW() - INTERVAL '%s days' AND user_id IS NOT NULL;
    
    -- Utilisateurs premium
    SELECT COUNT(*) INTO premium_users 
    FROM user_subscriptions 
    WHERE status = 'active' AND plan != 'free';
    
    -- Taux de conversion
    conversion_rate := CASE 
        WHEN total_users > 0 THEN (premium_users::DECIMAL / total_users) * 100 
        ELSE 0 
    END;
    
    -- MRR approximatif (à ajuster selon vos prix)
    mrr := premium_users * 9.99; -- Prix moyen
    
    result := jsonb_build_object(
        'total_users', total_users,
        'active_users', active_users,
        'premium_users', premium_users,
        'conversion_rate', conversion_rate,
        'mrr', mrr,
        'calculated_at', NOW()
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Message de confirmation
SELECT 'Analytics tables deployed successfully! 🚀' as status;
