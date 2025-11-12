-- ============================================
-- PHASE 7 : Coach AI Matrimonial (Exclusif Conseil)
-- ============================================

-- 1. Ajouter la feature "Coach AI"
INSERT INTO features (code, name, description, created_at)
VALUES (
  'ai_coach',
  'Coach AI Matrimonial',
  '🤖 Intelligence artificielle spécialisée en mariage islamique. Conseils personnalisés 24/7, analyse de vos résultats, recommandations sur-mesure.',
  NOW()
)
ON CONFLICT (code) DO NOTHING;

-- 2. Associer UNIQUEMENT au plan CONSEIL (exclusivité)
INSERT INTO plan_features (plan_name, feature_code, is_unlimited, usage_limit)
VALUES 
  ('conseil', 'ai_coach', true, NULL)
ON CONFLICT (plan_name, feature_code) DO NOTHING;

-- 3. Créer la table pour l'historique des conversations
CREATE TABLE IF NOT EXISTS coach_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Créer la table pour les messages
CREATE TABLE IF NOT EXISTS coach_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES coach_conversations(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  tokens_used INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_coach_conversations_user 
ON coach_conversations(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_coach_messages_conversation 
ON coach_messages(conversation_id, created_at ASC);

-- 6. Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_coach_conversations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER coach_conversations_updated_at
BEFORE UPDATE ON coach_conversations
FOR EACH ROW
EXECUTE FUNCTION update_coach_conversations_updated_at();

-- 7. RLS (Row Level Security) pour la sécurité
ALTER TABLE coach_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_messages ENABLE ROW LEVEL SECURITY;

-- Politique : Les utilisateurs ne voient que leurs conversations
CREATE POLICY "Users can view their own conversations"
ON coach_conversations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversations"
ON coach_conversations FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations"
ON coach_conversations FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations"
ON coach_conversations FOR DELETE
USING (auth.uid() = user_id);

-- Politique : Les messages sont liés aux conversations
CREATE POLICY "Users can view messages of their conversations"
ON coach_messages FOR SELECT
USING (
  conversation_id IN (
    SELECT id FROM coach_conversations WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create messages in their conversations"
ON coach_messages FOR INSERT
WITH CHECK (
  conversation_id IN (
    SELECT id FROM coach_conversations WHERE user_id = auth.uid()
  )
);

-- 8. Vérification
SELECT 
  f.code,
  f.name,
  f.description,
  CASE 
    WHEN pf_conseil.plan_name IS NOT NULL THEN '✅ Conseil'
    ELSE '❌ Non'
  END as conseil_only
FROM features f
LEFT JOIN plan_features pf_conseil ON f.code = pf_conseil.feature_code AND pf_conseil.plan_name = 'conseil'
WHERE f.code = 'ai_coach';

-- Compter les features par plan
SELECT 
  pf.plan_name,
  COUNT(pf.feature_code) as total_features
FROM plan_features pf
GROUP BY pf.plan_name
ORDER BY pf.plan_name;

-- Vérifier les tables créées
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_name IN ('coach_conversations', 'coach_messages')
AND table_schema = 'public';
