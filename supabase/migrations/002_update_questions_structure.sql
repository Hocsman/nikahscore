-- Migration pour mettre à jour la structure de la table questions
-- À exécuter dans Supabase SQL Editor

-- Modifier la table questions pour correspondre aux nouvelles spécifications
ALTER TABLE questions 
DROP COLUMN IF EXISTS text CASCADE,
DROP COLUMN IF EXISTS category CASCADE,
DROP COLUMN IF EXISTS weight CASCADE;

ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS label TEXT NOT NULL,
ADD COLUMN IF NOT EXISTS type TEXT CHECK (type IN ('bool', 'scale')) NOT NULL,
ADD COLUMN IF NOT EXISTS weight FLOAT DEFAULT 1.0;

-- Vérifier que les colonnes nécessaires existent
DO $$ 
BEGIN
    -- S'assurer que toutes les colonnes requises existent
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'axis') THEN
        ALTER TABLE questions ADD COLUMN axis TEXT NOT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'label') THEN
        ALTER TABLE questions ADD COLUMN label TEXT NOT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'type') THEN
        ALTER TABLE questions ADD COLUMN type TEXT CHECK (type IN ('bool', 'scale')) NOT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'weight') THEN
        ALTER TABLE questions ADD COLUMN weight FLOAT DEFAULT 1.0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'is_dealbreaker') THEN
        ALTER TABLE questions ADD COLUMN is_dealbreaker BOOLEAN DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'order_index') THEN
        ALTER TABLE questions ADD COLUMN order_index INTEGER NOT NULL;
    END IF;
END $$;
