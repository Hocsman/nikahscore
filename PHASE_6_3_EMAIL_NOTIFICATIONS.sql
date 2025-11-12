-- ============================================
-- PHASE 6.3 : Notifications Email Partenaire
-- ============================================

-- Ajouter la colonne notification_sent pour éviter les envois multiples
ALTER TABLE shared_questionnaires 
ADD COLUMN IF NOT EXISTS notification_sent BOOLEAN DEFAULT FALSE;

-- Ajouter la colonne notification_sent_at pour tracking
ALTER TABLE shared_questionnaires 
ADD COLUMN IF NOT EXISTS notification_sent_at TIMESTAMP;

-- Créer un index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_shared_questionnaires_notification 
ON shared_questionnaires(creator_id, notification_sent) 
WHERE notification_sent = FALSE;

-- Vérification de la structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'shared_questionnaires'
ORDER BY ordinal_position;
