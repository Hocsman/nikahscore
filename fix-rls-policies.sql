-- Script de nettoyage et recréation pour le partage de questionnaire
-- À exécuter si il y a des conflits avec les politiques existantes

-- Supprimer les politiques existantes (ignore les erreurs si elles n'existent pas)
DROP POLICY IF EXISTS "Anyone can read with share code" ON shared_questionnaires;
DROP POLICY IF EXISTS "Anyone can create shared questionnaire" ON shared_questionnaires;
DROP POLICY IF EXISTS "Anyone can update shared questionnaire" ON shared_questionnaires;

-- Désactiver temporairement RLS pour nettoyer
ALTER TABLE shared_questionnaires DISABLE ROW LEVEL SECURITY;

-- Recréer les politiques proprement
ALTER TABLE shared_questionnaires ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read with share code" ON shared_questionnaires
    FOR SELECT USING (true);

CREATE POLICY "Anyone can create shared questionnaire" ON shared_questionnaires
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update shared questionnaire" ON shared_questionnaires
    FOR UPDATE USING (true);

-- Message de confirmation
SELECT 'Politiques RLS nettoyées et recréées ! 🔗' as status;