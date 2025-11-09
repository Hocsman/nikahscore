-- Migration : Système de badges et achievements
-- Créé le : 2025-11-10
-- Description : Table pour gamification avec badges déblocables

-- Table pour stocker les achievements possibles
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(50) NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'questionnaire', 'social', 'profile', 'engagement'
  requirement_type VARCHAR(50) NOT NULL, -- 'count', 'score', 'action', 'time'
  requirement_value INTEGER,
  points INTEGER DEFAULT 10,
  rarity VARCHAR(20) DEFAULT 'common', -- 'common', 'rare', 'epic', 'legendary'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les achievements débloqués par utilisateur
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress INTEGER DEFAULT 0,
  notified BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, achievement_id)
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_unlocked ON user_achievements(user_id, unlocked_at DESC);
CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements(category);

-- RLS Policies
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut voir les achievements disponibles
CREATE POLICY "Achievements are viewable by everyone" ON achievements
  FOR SELECT USING (true);

-- Les utilisateurs peuvent voir leurs propres achievements débloqués
CREATE POLICY "Users can view their own achievements" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

-- Seul le service peut créer des achievements débloqués
CREATE POLICY "Service role can manage user achievements" ON user_achievements
  FOR ALL USING (auth.role() = 'service_role');

-- Insérer les achievements par défaut
INSERT INTO achievements (code, title, description, icon, category, requirement_type, requirement_value, points, rarity) VALUES
  -- Questionnaires
  ('first_questionnaire', 'Premier Pas', 'Complétez votre premier questionnaire', '🎯', 'questionnaire', 'count', 1, 10, 'common'),
  ('five_questionnaires', 'Explorateur', 'Complétez 5 questionnaires', '🔍', 'questionnaire', 'count', 5, 25, 'rare'),
  ('ten_questionnaires', 'Expert', 'Complétez 10 questionnaires', '⭐', 'questionnaire', 'count', 10, 50, 'epic'),
  ('perfect_match', 'Match Parfait', 'Obtenez un score de compatibilité supérieur à 90%', '💚', 'questionnaire', 'score', 90, 50, 'epic'),
  ('good_match', 'Bonne Compatibilité', 'Obtenez un score supérieur à 80%', '💛', 'questionnaire', 'score', 80, 25, 'rare'),
  
  -- Profil
  ('profile_complete', 'Profil Complet', 'Complétez 100% de votre profil', '✅', 'profile', 'action', 100, 15, 'common'),
  ('early_adopter', 'Early Adopter', 'Parmi les 100 premiers utilisateurs', '🚀', 'profile', 'action', 1, 100, 'legendary'),
  
  -- Social
  ('first_share', 'Partageur', 'Partagez vos résultats pour la première fois', '📤', 'social', 'action', 1, 15, 'common'),
  ('five_shares', 'Ambassadeur', 'Partagez vos résultats 5 fois', '🌟', 'social', 'action', 5, 35, 'rare'),
  
  -- Engagement
  ('active_week', 'Utilisateur Actif', 'Connectez-vous 7 jours consécutifs', '📅', 'engagement', 'action', 7, 30, 'rare'),
  ('active_month', 'Fidèle', 'Utilisez l''application pendant 30 jours', '💎', 'engagement', 'action', 30, 75, 'epic'),
  
  -- Couple
  ('first_couple', 'Ensemble', 'Créez votre premier questionnaire en couple', '👥', 'questionnaire', 'action', 1, 20, 'common'),
  ('three_couples', 'Polyvalent', 'Complétez des questionnaires avec 3 partenaires différents', '🔄', 'questionnaire', 'count', 3, 40, 'rare')
ON CONFLICT (code) DO NOTHING;

-- Commentaires
COMMENT ON TABLE achievements IS 'Liste des achievements disponibles dans l''application';
COMMENT ON TABLE user_achievements IS 'Achievements débloqués par chaque utilisateur';
COMMENT ON COLUMN achievements.rarity IS 'Rareté: common, rare, epic, legendary';
COMMENT ON COLUMN user_achievements.progress IS 'Progression vers le déblocage (0-100)';
