-- Migration pour les nouvelles tables analytics et paiements
-- À exécuter dans l'éditeur SQL de Supabase

-- Table pour les événements analytics
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

-- Table pour les customers Stripe
CREATE TABLE IF NOT EXISTS stripe_customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    stripe_customer_id VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table pour les abonnements utilisateur
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

-- Fonction pour calculer les stats quotidiennes
CREATE OR REPLACE FUNCTION get_daily_analytics(start_date TIMESTAMPTZ, end_date TIMESTAMPTZ)
RETURNS TABLE (
    date DATE,
    events BIGINT,
    sessions BIGINT,
    conversions BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        timestamp::DATE as date,
        COUNT(*) as events,
        COUNT(DISTINCT session_id) as sessions,
        COUNT(CASE WHEN event_type IN ('plan_upgrade_completed', 'payment_succeeded') THEN 1 END) as conversions
    FROM analytics_events
    WHERE timestamp >= start_date AND timestamp <= end_date
    GROUP BY timestamp::DATE
    ORDER BY date;
END;
$$ LANGUAGE plpgsql;

-- RLS (Row Level Security) pour sécuriser les données
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Politique pour les événements analytics (lecture/écriture libre pour l'API)
CREATE POLICY "Allow all operations on analytics_events" ON analytics_events FOR ALL USING (true);

-- Politique pour les customers Stripe (utilisateur peut voir seulement ses données)
CREATE POLICY "Users can view own stripe data" ON stripe_customers 
    FOR SELECT USING (user_id = auth.uid());

-- Politique pour les abonnements (utilisateur peut voir seulement son abonnement)
CREATE POLICY "Users can view own subscription" ON user_subscriptions 
    FOR SELECT USING (user_id = auth.uid());

-- Politique pour permettre l'insertion via API (webhooks Stripe)
CREATE POLICY "Allow API to insert/update subscriptions" ON user_subscriptions 
    FOR ALL USING (true);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer le trigger aux tables appropriées
CREATE TRIGGER update_stripe_customers_updated_at 
    BEFORE UPDATE ON stripe_customers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at 
    BEFORE UPDATE ON user_subscriptions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Vue pour simplifier les requêtes sur les abonnements actifs
CREATE OR REPLACE VIEW active_subscriptions AS
SELECT 
    us.*,
    sc.email,
    u.email as user_email
FROM user_subscriptions us
JOIN stripe_customers sc ON us.stripe_customer_id = sc.stripe_customer_id
JOIN auth.users u ON us.user_id = u.id
WHERE us.status = 'active' AND us.current_period_end > NOW();

-- Données de test (à supprimer en production)
INSERT INTO analytics_events (event_type, session_id, timestamp, properties) VALUES
('questionnaire_started', 'test_session_1', NOW() - INTERVAL '1 day', '{"source": "landing_page"}'),
('questionnaire_completed', 'test_session_1', NOW() - INTERVAL '1 day', '{"completion_time": 300}'),
('premium_feature_clicked', 'test_session_1', NOW() - INTERVAL '1 day', '{"feature": "pdf_report"}'),
('upgrade_button_clicked', 'test_session_1', NOW() - INTERVAL '1 day', '{"plan": "premium"}'),
('questionnaire_started', 'test_session_2', NOW() - INTERVAL '2 hours', '{"source": "social_media"}'),
('premium_feature_clicked', 'test_session_2', NOW() - INTERVAL '2 hours', '{"feature": "email_results"}');

-- Commentaires pour documentation
COMMENT ON TABLE analytics_events IS 'Stockage des événements analytics pour tracking des conversions';
COMMENT ON TABLE stripe_customers IS 'Association entre utilisateurs NikahScore et customers Stripe';
COMMENT ON TABLE user_subscriptions IS 'Abonnements utilisateur avec données Stripe';
COMMENT ON FUNCTION get_daily_analytics IS 'Fonction pour récupérer les statistiques quotidiennes';

-- Vérification que tout s'est bien passé
SELECT 'Migration terminée avec succès!' as status;
