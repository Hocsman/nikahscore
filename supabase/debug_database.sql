-- Script de débogage et nettoyage pour NikahScore
-- À exécuter d'abord pour voir l'état actuel de la base

-- 1. Vérifier quelles tables existent
SELECT 'Tables existantes:' as info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. Vérifier la structure de la table users
SELECT '--- Structure table users ---' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Vérifier la structure de la table pairs si elle existe
SELECT '--- Structure table pairs ---' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'pairs' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Vérifier les politiques RLS existantes
SELECT '--- Politiques RLS existantes ---' as info;
SELECT schemaname, tablename, policyname, cmd, roles 
FROM pg_policies 
WHERE schemaname = 'public';
