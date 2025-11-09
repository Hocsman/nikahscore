-- Migration : Ajout des colonnes first_name et last_name
-- Créé le : 2025-11-09
-- Description : Ajoute les prénoms et noms pour personnalisation de l'interface

-- Ajouter les colonnes first_name et last_name à la table users si elles n'existent pas
DO $$ 
BEGIN
  -- Ajouter first_name (prénom - requis)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name = 'first_name'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE users ADD COLUMN first_name VARCHAR(100);
    
    -- Mettre à jour les utilisateurs existants avec un prénom par défaut
    -- (ils devront le changer à leur première connexion)
    UPDATE users 
    SET first_name = COALESCE(
      SPLIT_PART(email, '@', 1), -- Utiliser la partie avant @ de l'email
      'Utilisateur'
    )
    WHERE first_name IS NULL;
    
    -- Rendre la colonne NOT NULL après avoir mis à jour les données existantes
    ALTER TABLE users ALTER COLUMN first_name SET NOT NULL;
    
    RAISE NOTICE 'Colonne first_name ajoutée avec succès';
  ELSE
    RAISE NOTICE 'Colonne first_name existe déjà';
  END IF;

  -- Ajouter last_name (nom - optionnel)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name = 'last_name'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE users ADD COLUMN last_name VARCHAR(100);
    RAISE NOTICE 'Colonne last_name ajoutée avec succès';
  ELSE
    RAISE NOTICE 'Colonne last_name existe déjà';
  END IF;
END $$;

-- Créer un index pour optimiser les recherches par prénom
CREATE INDEX IF NOT EXISTS idx_users_first_name ON users(first_name);

-- Commentaires pour documentation
COMMENT ON COLUMN users.first_name IS 'Prénom de l''utilisateur (requis pour personnalisation)';
COMMENT ON COLUMN users.last_name IS 'Nom de famille de l''utilisateur (optionnel)';
