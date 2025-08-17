-- Seed des 60 questions pour NikahScore
-- Table cible: questions(axis, text, category, weight, is_dealbreaker, order_index)
-- Types: bool et scale uniquement, weight=1 partout
-- order_index: 1..60

-- Vider la table questions
TRUNCATE TABLE questions RESTART IDENTITY CASCADE;

INSERT INTO questions (axis, text, category, weight, is_dealbreaker, order_index) VALUES

-- INTENTIONS (8 questions - 3 deal-breakers minimum)
('Intentions', 'Je souhaite me marier dans les 12 prochains mois.', 'bool', 1, TRUE, 1),
('Intentions', 'Je souhaite le mariage civil avant toute vie commune.', 'bool', 1, TRUE, 2),
('Intentions', 'Le mariage religieux est prioritaire pour moi.', 'scale', 1, TRUE, 3),
('Intentions', 'Je recherche une relation sérieuse en vue du mariage.', 'bool', 1, FALSE, 4),
('Intentions', 'Je suis prêt(e) à m''engager pour la vie.', 'scale', 1, FALSE, 5),
('Intentions', 'Une période de fiançailles courte me convient.', 'scale', 1, FALSE, 6),
('Intentions', 'Les familles doivent se rencontrer rapidement.', 'scale', 1, FALSE, 7),
('Intentions', 'Le mariage doit suivre les traditions islamiques.', 'scale', 1, FALSE, 8),

-- VALEURS (8 questions - 3 deal-breakers minimum)
('Valeurs', 'La pratique religieuse régulière est importante pour moi.', 'scale', 1, TRUE, 9),
('Valeurs', 'Je souhaite préserver des limites d''interaction avant le mariage.', 'bool', 1, TRUE, 10),
('Valeurs', 'La lecture du Coran fait partie de ma routine.', 'scale', 1, TRUE, 11),
('Valeurs', 'Je prie les cinq prières quotidiennes.', 'scale', 1, FALSE, 12),
('Valeurs', 'Je jeûne pendant le mois de Ramadan.', 'bool', 1, FALSE, 13),
('Valeurs', 'Je souhaite faire le pèlerinage ensemble.', 'scale', 1, FALSE, 14),
('Valeurs', 'L''apprentissage religieux en couple est important.', 'scale', 1, FALSE, 15),
('Valeurs', 'Je participe aux activités de la mosquée.', 'scale', 1, FALSE, 16),

-- RÔLES (7 questions)
('Rôles', 'Je préfère une répartition traditionnelle des rôles.', 'scale', 1, FALSE, 17),
('Rôles', 'L''homme doit être le principal pourvoyeur financier.', 'scale', 1, FALSE, 18),
('Rôles', 'La femme peut travailler après le mariage.', 'scale', 1, FALSE, 19),
('Rôles', 'Les tâches ménagères doivent être partagées.', 'scale', 1, FALSE, 20),
('Rôles', 'Mon conjoint doit participer à l''éducation des enfants.', 'scale', 1, FALSE, 21),
('Rôles', 'Les décisions importantes se prennent ensemble.', 'scale', 1, FALSE, 22),
('Rôles', 'Je peux accepter un conjoint plus ou moins éduqué que moi.', 'scale', 1, FALSE, 23),

-- ENFANTS (7 questions - 2 deal-breakers minimum)
('Enfants', 'Je souhaite des enfants.', 'bool', 1, TRUE, 24),
('Enfants', 'Je veux plus de trois enfants.', 'scale', 1, TRUE, 25),
('Enfants', 'L''éducation islamique des enfants est prioritaire.', 'scale', 1, FALSE, 26),
('Enfants', 'Je préfère l''école islamique pour mes enfants.', 'scale', 1, FALSE, 27),
('Enfants', 'L''apprentissage de l''arabe est important pour les enfants.', 'scale', 1, FALSE, 28),
('Enfants', 'Je veux avoir des enfants rapidement après le mariage.', 'scale', 1, FALSE, 29),
('Enfants', 'L''éducation mixte est acceptable pour mes enfants.', 'scale', 1, FALSE, 30),

-- FINANCE (7 questions)
('Finance', 'La transparence financière est essentielle dans le couple.', 'scale', 1, FALSE, 31),
('Finance', 'Nous devons avoir un budget commun.', 'scale', 1, FALSE, 32),
('Finance', 'L''épargne pour le pèlerinage est prioritaire.', 'scale', 1, FALSE, 33),
('Finance', 'Je peux accepter un crédit immobilier conforme.', 'scale', 1, FALSE, 34),
('Finance', 'Le niveau de vie doit rester modeste.', 'scale', 1, FALSE, 35),
('Finance', 'L''alimentation halal est non négociable même si plus chère.', 'scale', 1, FALSE, 36),
('Finance', 'Les achats importants se décident ensemble.', 'scale', 1, FALSE, 37),

-- STYLE (7 questions - 2 deal-breakers minimum)
('Style', 'Je refuse l''alcool dans le foyer.', 'bool', 1, TRUE, 38),
('Style', 'La nourriture doit être exclusivement halal.', 'scale', 1, TRUE, 39),
('Style', 'Je limite mes sorties en soirée.', 'scale', 1, FALSE, 40),
('Style', 'Les voyages en couple sont importants pour moi.', 'scale', 1, FALSE, 41),
('Style', 'Je pratique régulièrement une activité sportive.', 'scale', 1, FALSE, 42),
('Style', 'Je limite mon utilisation des réseaux sociaux.', 'scale', 1, FALSE, 43),
('Style', 'Les loisirs culturels m''intéressent.', 'scale', 1, FALSE, 44),

-- COMMUNICATION (7 questions)
('Communication', 'Je préfère résoudre les conflits par la discussion.', 'scale', 1, FALSE, 45),
('Communication', 'Je suis à l''aise pour exprimer mes sentiments.', 'scale', 1, FALSE, 46),
('Communication', 'Les non-dits peuvent détruire un couple.', 'scale', 1, FALSE, 47),
('Communication', 'Je peux accepter les critiques constructives.', 'scale', 1, FALSE, 48),
('Communication', 'Je présente facilement mes excuses quand j''ai tort.', 'scale', 1, FALSE, 49),
('Communication', 'L''humour est important dans la relation.', 'scale', 1, FALSE, 50),
('Communication', 'Je consulte un imam en cas de conflit important.', 'scale', 1, FALSE, 51),

-- PERSONNALITÉ (4 questions)
('Personnalité', 'Je me considère comme une personne patiente.', 'scale', 1, FALSE, 52),
('Personnalité', 'J''ai une stabilité émotionnelle.', 'scale', 1, FALSE, 53),
('Personnalité', 'Je suis plutôt introverti(e).', 'scale', 1, FALSE, 54),
('Personnalité', 'J''exprime facilement mes émotions.', 'scale', 1, FALSE, 55),

-- LOGISTIQUE (5 questions - 2 deal-breakers minimum)
('Logistique', 'Je vis (ou peux vivre) en Île-de-France.', 'bool', 1, TRUE, 56),
('Logistique', 'Je peux déménager dans une autre région.', 'bool', 1, TRUE, 57),
('Logistique', 'Je préfère rester proche de ma famille.', 'scale', 1, FALSE, 58),
('Logistique', 'Je suis ouvert(e) à l''expatriation.', 'scale', 1, FALSE, 59),
('Logistique', 'La mobilité géographique ne me dérange pas.', 'scale', 1, FALSE, 60);

-- Vérification
DO $$
DECLARE
    total_count INTEGER;
    dealbreaker_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_count FROM questions;
    SELECT COUNT(*) INTO dealbreaker_count FROM questions WHERE is_dealbreaker = TRUE;
    
    RAISE NOTICE 'Total questions: %', total_count;
    RAISE NOTICE 'Deal-breakers: %', dealbreaker_count;
    
    IF total_count != 60 THEN
        RAISE EXCEPTION 'Erreur: % questions au lieu de 60', total_count;
    END IF;
END $$;
