-- ============================================
-- PHASE 6 : Questionnaire Partageable
-- Permettre à 2 personnes de répondre et comparer leurs résultats
-- ============================================

-- 1️⃣ Table pour stocker les questionnaires partagés
CREATE TABLE IF NOT EXISTS shared_questionnaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_code VARCHAR(12) UNIQUE NOT NULL, -- Code unique type "ABC123XYZ"
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  creator_questionnaire_id UUID, -- Référence ajoutée plus tard si table questionnaires existe
  partner_name VARCHAR(100), -- Nom du partenaire (optionnel)
  partner_email VARCHAR(255), -- Email du partenaire (optionnel, pour notification)
  partner_questionnaire_id UUID, -- Référence ajoutée plus tard si table questionnaires existe
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
  expires_at TIMESTAMP NOT NULL, -- Expiration après 30 jours
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2️⃣ Index pour recherche rapide par code
CREATE INDEX IF NOT EXISTS idx_shared_questionnaires_share_code 
ON shared_questionnaires(share_code);

CREATE INDEX IF NOT EXISTS idx_shared_questionnaires_creator_id 
ON shared_questionnaires(creator_id);

-- 3️⃣ Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_shared_questionnaires_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_shared_questionnaires_updated_at
BEFORE UPDATE ON shared_questionnaires
FOR EACH ROW
EXECUTE FUNCTION update_shared_questionnaires_updated_at();

-- 4️⃣ Fonction pour générer un code unique (format: ABC123XYZ)
CREATE OR REPLACE FUNCTION generate_share_code()
RETURNS VARCHAR(12) AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- Évite I, O, 0, 1 (confusion)
  result VARCHAR(12) := '';
  i INTEGER;
BEGIN
  FOR i IN 1..12 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 5️⃣ Ajouter la feature "Questionnaire Partageable" 
INSERT INTO features (code, name, description, created_at)
VALUES (
  'questionnaire_shareable',
  'Questionnaire Partageable',
  'Partager un code unique pour que votre partenaire réponde et comparer vos résultats',
  NOW()
)
ON CONFLICT (code) DO NOTHING;

-- 6️⃣ Associer cette feature aux plans PREMIUM et CONSEIL
INSERT INTO plan_features (plan_name, feature_code, is_unlimited, usage_limit)
VALUES 
  ('premium', 'questionnaire_shareable', true, NULL), -- Illimité pour Premium
  ('conseil', 'questionnaire_shareable', true, NULL)  -- Illimité pour Conseil
ON CONFLICT (plan_name, feature_code) DO NOTHING;

-- 7️⃣ Vérifier que la feature a été ajoutée
SELECT 
  f.code,
  f.name,
  f.description,
  CASE 
    WHEN pf_premium.plan_name IS NOT NULL THEN '✅ Premium'
    ELSE ''
  END as premium,
  CASE 
    WHEN pf_conseil.plan_name IS NOT NULL THEN '✅ Conseil'
    ELSE ''
  END as conseil
FROM features f
LEFT JOIN plan_features pf_premium ON f.code = pf_premium.feature_code AND pf_premium.plan_name = 'premium'
LEFT JOIN plan_features pf_conseil ON f.code = pf_conseil.feature_code AND pf_conseil.plan_name = 'conseil'
WHERE f.code = 'questionnaire_shareable';

-- 8️⃣ Compter les features par plan
SELECT 
  pf.plan_name,
  COUNT(pf.feature_code) as total_features
FROM plan_features pf
GROUP BY pf.plan_name
ORDER BY pf.plan_name;

-- 9️⃣ Vérifier les questionnaires partagés existants (vide pour l'instant)
-- SELECT 
--   sq.share_code,
--   u.email as creator_email,
--   sq.partner_name,
--   sq.status,
--   sq.expires_at,
--   sq.created_at
-- FROM shared_questionnaires sq
-- JOIN auth.users u ON sq.creator_id = u.id
-- ORDER BY sq.created_at DESC
-- LIMIT 10;

-- 🔟 Nettoyer les questionnaires expirés (optionnel, à exécuter en cron)
-- UPDATE shared_questionnaires
-- SET status = 'expired'
-- WHERE expires_at < NOW()
-- AND status = 'pending';
