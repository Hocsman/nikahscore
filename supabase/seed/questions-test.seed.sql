-- Test temporaire avec 5 questions pour tester l'API
-- Adapté au schéma existant: text, category au lieu de label, type

TRUNCATE TABLE questions RESTART IDENTITY CASCADE;

INSERT INTO questions (axis, text, category, weight, is_dealbreaker, order_index) VALUES

-- Intentions (2 questions test)
('Intentions', 'Je souhaite me marier dans les 12 prochains mois.', 'bool', 1.0, true, 1),
('Intentions', 'Je recherche une relation sérieuse en vue du mariage.', 'bool', 1.0, false, 2),

-- Valeurs (2 questions test) 
('Valeurs', 'La pratique religieuse régulière est importante pour moi.', 'bool', 1.0, true, 3),
('Valeurs', 'Évaluez l''importance de la prière quotidienne dans votre vie.', 'scale', 1.0, false, 4),

-- Test Scale
('Communication', 'À quel point êtes-vous à l''aise pour exprimer vos sentiments ?', 'scale', 1.0, false, 5);
