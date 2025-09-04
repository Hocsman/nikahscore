-- Schema pour le système de notifications NikahScore
-- À exécuter dans Supabase SQL Editor

-- Table des notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('message', 'match', 'profile_view', 'system', 'achievement')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- RLS (Row Level Security) pour la sécurité
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Politique : Les utilisateurs ne peuvent voir que leurs propres notifications
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

-- Politique : Les utilisateurs peuvent mettre à jour leurs propres notifications (marquer comme lu)
CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour updated_at
CREATE TRIGGER update_notifications_updated_at 
    BEFORE UPDATE ON notifications 
    FOR EACH ROW 
    EXECUTE PROCEDURE update_updated_at_column();

-- Fonction pour créer une notification
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id UUID,
    p_type VARCHAR,
    p_title VARCHAR,
    p_message TEXT,
    p_data JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO notifications (user_id, type, title, message, data)
    VALUES (p_user_id, p_type, p_title, p_message, p_data)
    RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour marquer toutes les notifications comme lues
CREATE OR REPLACE FUNCTION mark_all_notifications_as_read(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER;
BEGIN
    UPDATE notifications 
    SET read = true, updated_at = timezone('utc'::text, now())
    WHERE user_id = p_user_id AND read = false;
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Vue pour les statistiques de notifications
CREATE OR REPLACE VIEW notification_stats AS
SELECT 
    user_id,
    COUNT(*) as total_notifications,
    COUNT(*) FILTER (WHERE read = false) as unread_count,
    COUNT(*) FILTER (WHERE type = 'message') as message_count,
    COUNT(*) FILTER (WHERE type = 'match') as match_count,
    COUNT(*) FILTER (WHERE type = 'profile_view') as profile_view_count,
    COUNT(*) FILTER (WHERE type = 'achievement') as achievement_count,
    MAX(created_at) as latest_notification
FROM notifications
GROUP BY user_id;

-- Trigger pour nettoyer automatiquement les anciennes notifications (optionnel)
-- Garde seulement les 100 dernières notifications par utilisateur
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM notifications 
    WHERE id IN (
        SELECT id FROM notifications 
        WHERE user_id = NEW.user_id 
        ORDER BY created_at DESC 
        OFFSET 100
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer le trigger de nettoyage (optionnel, décommentez si nécessaire)
-- CREATE TRIGGER trigger_cleanup_notifications
--     AFTER INSERT ON notifications
--     FOR EACH ROW
--     EXECUTE FUNCTION cleanup_old_notifications();

-- Données d'exemple (à supprimer en production)
-- INSERT INTO notifications (user_id, type, title, message, data) VALUES
-- ('4c48cb8f-7958-4104-9dbe-eccde79d7f45', 'welcome', 'Bienvenue !', 'Bienvenue sur NikahScore ! Commencez par compléter votre profil.', '{}'),
-- ('4c48cb8f-7958-4104-9dbe-eccde79d7f45', 'match', 'Nouveau match !', 'Vous avez 92% de compatibilité avec Amina K.', '{"compatibility": 92, "match_name": "Amina K."}');

COMMENT ON TABLE notifications IS 'Stockage des notifications utilisateur avec support temps réel';
COMMENT ON FUNCTION create_notification IS 'Fonction helper pour créer une nouvelle notification';
COMMENT ON FUNCTION mark_all_notifications_as_read IS 'Marque toutes les notifications d''un utilisateur comme lues';
COMMENT ON VIEW notification_stats IS 'Statistiques des notifications par utilisateur';
