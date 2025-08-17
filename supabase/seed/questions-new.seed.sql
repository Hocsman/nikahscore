-- Seed des 60 questions pour NikahScore
-- Répartition: Intentions(8), Valeurs&pratique(8), Rôles familiaux(7), Enfants&éducation(7), 
-- Finance&train de vie(7), Style de vie&limites(7), Communication&conflits(7), Personnalité&émotions(4), Logistique(5)

-- Vider la table questions avant d'insérer les nouvelles données
TRUNCATE TABLE questions RESTART IDENTITY CASCADE;

-- INTENTIONS (8 questions - 3+ deal-breakers)
INSERT INTO questions (axis, label, type, weight, is_dealbreaker, order_index) VALUES
('Intentions', 'Je souhaite me marier dans les 12 prochains mois.', 'bool', 1.5, TRUE, 1),
('Intentions', 'Je souhaite le mariage civil avant toute vie commune.', 'bool', 1.5, TRUE, 2),
('Intentions', 'Le mariage religieux est plus important pour moi que le civil.', 'bool', 1.0, TRUE, 3),
('Intentions', 'Je recherche une relation sérieuse en vue du mariage.', 'bool', 1.2, FALSE, 4),
('Intentions', 'Je suis prêt(e) à m''engager pour la vie.', 'scale', 1.3, FALSE, 5),
('Intentions', 'Je souhaite une période de fiançailles de moins de 6 mois.', 'bool', 1.0, FALSE, 6),
('Intentions', 'Le mariage doit être célébré selon les traditions islamiques.', 'scale', 1.2, FALSE, 7),
('Intentions', 'Je veux que ma famille soit impliquée dans les préparatifs du mariage.', 'scale', 1.0, FALSE, 8),

-- VALEURS & PRATIQUE (8 questions - 3+ deal-breakers)
('Valeurs & pratique', 'La pratique religieuse régulière est importante pour moi.', 'scale', 1.5, TRUE, 9),
('Valeurs & pratique', 'Je prie les 5 prières quotidiennes.', 'scale', 1.3, TRUE, 10),
('Valeurs & pratique', 'Le port du hijab/barbe est important dans notre couple.', 'scale', 1.2, TRUE, 11),
('Valeurs & pratique', 'Je lis le Coran régulièrement.', 'scale', 1.1, FALSE, 12),
('Valeurs & pratique', 'Je jeûne pendant le mois de Ramadan.', 'bool', 1.2, FALSE, 13),
('Valeurs & pratique', 'Je souhaite faire le pèlerinage (Hajj) ensemble.', 'scale', 1.0, FALSE, 14),
('Valeurs & pratique', 'L''apprentissage religieux en couple est important.', 'scale', 1.1, FALSE, 15),
('Valeurs & pratique', 'Je participe régulièrement aux activités de la mosquée.', 'scale', 1.0, FALSE, 16),

-- RÔLES FAMILIAUX (7 questions)
('Rôles familiaux', 'Je préfère une répartition traditionnelle des rôles dans le couple.', 'scale', 1.2, FALSE, 17),
('Rôles familiaux', 'L''homme doit être le principal pourvoyeur financier.', 'scale', 1.1, FALSE, 18),
('Rôles familiaux', 'La femme peut travailler après le mariage.', 'scale', 1.2, FALSE, 19),
('Rôles familiaux', 'Les tâches ménagères doivent être partagées équitablement.', 'scale', 1.0, FALSE, 20),
('Rôles familiaux', 'Je veux que mon conjoint soit impliqué dans l''éducation des enfants.', 'scale', 1.3, FALSE, 21),
('Rôles familiaux', 'L''épouse doit demander l''autorisation pour sortir le soir.', 'scale', 1.1, FALSE, 22),
('Rôles familiaux', 'Nous devons prendre les décisions importantes ensemble.', 'scale', 1.4, FALSE, 23),

-- ENFANTS & ÉDUCATION (7 questions - 2+ deal-breakers)
('Enfants & éducation', 'Je souhaite des enfants.', 'bool', 1.5, TRUE, 24),
('Enfants & éducation', 'Je veux plus de 3 enfants.', 'bool', 1.2, TRUE, 25),
('Enfants & éducation', 'L''éducation islamique des enfants est prioritaire.', 'scale', 1.4, FALSE, 26),
('Enfants & éducation', 'Je préfère l''école islamique pour mes enfants.', 'scale', 1.1, FALSE, 27),
('Enfants & éducation', 'L''apprentissage de l''arabe est important pour les enfants.', 'scale', 1.1, FALSE, 28),
('Enfants & éducation', 'Je veux avoir des enfants dans les 2 premières années.', 'bool', 1.0, FALSE, 29),
('Enfants & éducation', 'L''éducation mixte est acceptable pour mes enfants.', 'scale', 1.0, FALSE, 30),

-- FINANCE & TRAIN DE VIE (7 questions)
('Finance & train de vie', 'Nous devons avoir un compte bancaire commun.', 'scale', 1.1, FALSE, 31),
('Finance & train de vie', 'Je préfère une gestion financière transparente.', 'scale', 1.3, FALSE, 32),
('Finance & train de vie', 'L''épargne pour le pèlerinage est prioritaire.', 'scale', 1.0, FALSE, 33),
('Finance & train de vie', 'Je suis à l''aise avec un crédit immobilier.', 'scale', 1.1, FALSE, 34),
('Finance & train de vie', 'Le niveau de vie doit être modeste et conforme à l''Islam.', 'scale', 1.2, FALSE, 35),
('Finance & train de vie', 'Je peux accepter que mon conjoint gagne plus que moi.', 'scale', 1.0, FALSE, 36),
('Finance & train de vie', 'Nous devons discuter de tous les achats importants.', 'scale', 1.1, FALSE, 37),

-- STYLE DE VIE & LIMITES (7 questions - 2+ deal-breakers)
('Style de vie & limites', 'Je souhaite préserver des limites d''interaction avant le mariage.', 'bool', 1.5, TRUE, 38),
('Style de vie & limites', 'Je refuse l''alcool dans le foyer.', 'bool', 1.5, TRUE, 39),
('Style de vie & limites', 'La nourriture halal uniquement est importante.', 'scale', 1.3, FALSE, 40),
('Style de vie & limites', 'Je préfère limiter les sorties en soirée.', 'scale', 1.1, FALSE, 41),
('Style de vie & limites', 'Les voyages en couple sont importants pour moi.', 'scale', 1.0, FALSE, 42),
('Style de vie & limites', 'Je pratique régulièrement une activité sportive.', 'scale', 1.0, FALSE, 43),
('Style de vie & limites', 'Les loisirs culturels (cinéma, théâtre) m''intéressent.', 'scale', 1.0, FALSE, 44),

-- COMMUNICATION & CONFLITS (7 questions)
('Communication & conflits', 'Je préfère résoudre les conflits par la discussion.', 'scale', 1.4, FALSE, 45),
('Communication & conflits', 'Je suis à l''aise pour exprimer mes sentiments.', 'scale', 1.2, FALSE, 46),
('Communication & conflits', 'Les non-dits peuvent détruire un couple.', 'scale', 1.3, FALSE, 47),
('Communication & conflits', 'Je peux accepter les critiques constructives.', 'scale', 1.2, FALSE, 48),
('Communication & conflits', 'Je préfère éviter les confrontations directes.', 'scale', 1.0, FALSE, 49),
('Communication & conflits', 'L''humour est important dans la relation.', 'scale', 1.1, FALSE, 50),
('Communication & conflits', 'Je consulte facilement un imam en cas de conflit.', 'scale', 1.0, FALSE, 51),

-- PERSONNALITÉ & ÉMOTIONS (4 questions)
('Personnalité & émotions', 'Je me considère comme une personne patiente.', 'scale', 1.2, FALSE, 52),
('Personnalité & émotions', 'J''ai besoin de beaucoup de temps personnel.', 'scale', 1.1, FALSE, 53),
('Personnalité & émotions', 'Je suis plutôt introverti(e) que extraverti(e).', 'scale', 1.0, FALSE, 54),
('Personnalité & émotions', 'J''exprime facilement mes émotions.', 'scale', 1.1, FALSE, 55),

-- LOGISTIQUE (5 questions - 2+ deal-breakers)
('Logistique', 'Je vis (ou peux vivre) en Île-de-France.', 'bool', 1.5, TRUE, 56),
('Logistique', 'Je peux déménager dans une autre région pour le mariage.', 'bool', 1.3, TRUE, 57),
('Logistique', 'Je préfère rester proche de ma famille après le mariage.', 'scale', 1.2, FALSE, 58),
('Logistique', 'Je suis ouvert(e) à l''expatriation.', 'scale', 1.1, FALSE, 59),
('Logistique', 'Vivre en appartement me convient parfaitement.', 'scale', 1.0, FALSE, 60);

-- Vérification des contraintes
DO $$
DECLARE
    total_count INTEGER;
    dealbreaker_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_count FROM questions;
    SELECT COUNT(*) INTO dealbreaker_count FROM questions WHERE is_dealbreaker = TRUE;
    
    RAISE NOTICE 'Total questions insérées: %', total_count;
    RAISE NOTICE 'Questions deal-breakers: %', dealbreaker_count;
    
    IF total_count != 60 THEN
        RAISE EXCEPTION 'Erreur: % questions au lieu de 60', total_count;
    END IF;
    
    IF dealbreaker_count < 12 THEN
        RAISE EXCEPTION 'Erreur: seulement % deal-breakers (minimum 12 requis)', dealbreaker_count;
    END IF;
END $$;
