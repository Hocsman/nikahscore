-- Insertion des 60 questions de compatibilité pour NikahScore

-- Questions Valeurs Religieuses (8 questions)
INSERT INTO questions (text, category, axis, is_dealbreaker, order_index, weight) VALUES
('Quelle importance accordez-vous à la pratique quotidienne des 5 prières ?', 'valeurs_religieuses', 'spiritualite', true, 1, 2.0),
('Comment envisagez-vous l''éducation religieuse de vos futurs enfants ?', 'valeurs_religieuses', 'spiritualite', true, 2, 2.0),
('Quel rôle joue le Coran dans votre vie quotidienne ?', 'valeurs_religieuses', 'spiritualite', false, 3, 1.5),
('Comment souhaitez-vous célébrer les fêtes religieuses en famille ?', 'valeurs_religieuses', 'spiritualite', false, 4, 1.0),
('Quelle importance donnez-vous au pèlerinage (Hajj/Omra) ?', 'valeurs_religieuses', 'spiritualite', false, 5, 1.0),
('Comment gérez-vous la pratique religieuse dans un environnement non-musulman ?', 'valeurs_religieuses', 'adaptation', false, 6, 1.5),
('Quel équilibre trouvez-vous entre tradition et modernité ?', 'valeurs_religieuses', 'adaptation', false, 7, 1.5),
('Comment envisagez-vous le rôle de la communauté musulmane dans votre vie ?', 'valeurs_religieuses', 'communaute', false, 8, 1.0),

-- Questions Mode de Vie (8 questions)
('Quelle importance accordez-vous à l''alimentation halal ?', 'mode_de_vie', 'quotidien', true, 9, 2.0),
('Comment envisagez-vous le partage des tâches ménagères ?', 'mode_de_vie', 'quotidien', false, 10, 1.5),
('Quelle place occupe le sport et la santé dans votre vie ?', 'mode_de_vie', 'sante', false, 11, 1.0),
('Comment gérez-vous l''équilibre travail-vie privée ?', 'mode_de_vie', 'equilibre', false, 12, 1.5),
('Quelle importance accordez-vous aux voyages et découvertes ?', 'mode_de_vie', 'loisirs', false, 13, 1.0),
('Comment envisagez-vous l''usage des réseaux sociaux dans le couple ?', 'mode_de_vie', 'technologie', false, 14, 1.0),
('Quel rôle jouent les amis dans votre vie de couple ?', 'mode_de_vie', 'social', false, 15, 1.5),
('Comment gérez-vous le stress et les défis du quotidien ?', 'mode_de_vie', 'gestion_stress', false, 16, 1.5),

-- Questions Famille (8 questions)
('Combien d''enfants souhaitez-vous avoir ?', 'famille', 'enfants', true, 17, 2.0),
('À quel âge idéal souhaitez-vous devenir parent ?', 'famille', 'enfants', false, 18, 1.5),
('Quelle place accordez-vous à la famille élargie ?', 'famille', 'famille_elargie', false, 19, 1.5),
('Comment envisagez-vous les relations avec les beaux-parents ?', 'famille', 'famille_elargie', false, 20, 1.5),
('Quel style d''éducation privilégiez-vous pour vos enfants ?', 'famille', 'education', false, 21, 1.5),
('Comment souhaitez-vous transmettre votre culture d''origine ?', 'famille', 'culture', false, 22, 1.0),
('Quelle importance accordez-vous aux traditions familiales ?', 'famille', 'traditions', false, 23, 1.0),
('Comment gérez-vous les désaccords familiaux ?', 'famille', 'conflits', false, 24, 1.5),

-- Questions Finances (7 questions)
('Comment envisagez-vous la gestion des finances du couple ?', 'finances', 'gestion', false, 25, 1.5),
('Quelle importance accordez-vous à l''épargne et à la planification financière ?', 'finances', 'epargne', false, 26, 1.5),
('Comment gérez-vous les différences de revenus dans le couple ?', 'finances', 'revenus', false, 27, 1.5),
('Quel budget consacrez-vous aux loisirs et sorties ?', 'finances', 'loisirs', false, 28, 1.0),
('Comment envisagez-vous l''investissement immobilier ?', 'finances', 'immobilier', false, 29, 1.0),
('Quelle place accordez-vous à la charité (Zakat) et aux dons ?', 'finances', 'charite', false, 30, 1.5),
('Comment gérez-vous les dépenses imprévues ?', 'finances', 'imprevus', false, 31, 1.0),

-- Questions Intimité (7 questions)
('Comment envisagez-vous la communication dans votre couple ?', 'intimite', 'communication', false, 32, 2.0),
('Quelle importance accordez-vous à l''affection et aux petites attentions ?', 'intimite', 'affection', false, 33, 1.5),
('Comment exprimez-vous votre amour au quotidien ?', 'intimite', 'expression_amour', false, 34, 1.5),
('Comment souhaitez-vous gérer les désaccords dans le couple ?', 'intimite', 'conflits', false, 35, 2.0),
('Quelle place accordez-vous aux moments d''intimité et de complicité ?', 'intimite', 'complicite', false, 36, 1.5),
('Comment envisagez-vous le respect mutuel dans le couple ?', 'intimite', 'respect', true, 37, 2.0),
('Quelle importance accordez-vous au soutien émotionnel mutuel ?', 'intimite', 'soutien', false, 38, 2.0),

-- Questions Projets d''Avenir (8 questions)
('Où souhaitez-vous vivre dans 10 ans ?', 'projets_avenir', 'lieu_vie', false, 39, 1.5),
('Comment envisagez-vous l''évolution de votre carrière professionnelle ?', 'projets_avenir', 'carriere', false, 40, 1.5),
('Quels sont vos rêves de voyage à réaliser ensemble ?', 'projets_avenir', 'voyages', false, 41, 1.0),
('Comment imaginez-vous votre retraite ?', 'projets_avenir', 'retraite', false, 42, 1.0),
('Quels projets entrepreneuriaux vous motivent ?', 'projets_avenir', 'entrepreneuriat', false, 43, 1.0),
('Comment souhaitez-vous contribuer à votre communauté ?', 'projets_avenir', 'communaute', false, 44, 1.0),
('Quels défis souhaitez-vous relever ensemble ?', 'projets_avenir', 'defis', false, 45, 1.5),
('Comment envisagez-vous votre développement personnel ?', 'projets_avenir', 'developpement', false, 46, 1.0),

-- Questions Éducation (7 questions)
('Quelle importance accordez-vous à l''éducation continue ?', 'education', 'apprentissage', false, 47, 1.5),
('Comment souhaitez-vous encourager la curiosité chez vos enfants ?', 'education', 'curiosite', false, 48, 1.5),
('Quel rôle joue la lecture dans votre foyer ?', 'education', 'lecture', false, 49, 1.0),
('Comment équilibrez-vous éducation religieuse et laïque ?', 'education', 'equilibre', false, 50, 1.5),
('Quelle place accordez-vous aux activités artistiques et créatives ?', 'education', 'creativite', false, 51, 1.0),
('Comment envisagez-vous l''éducation aux nouvelles technologies ?', 'education', 'technologie', false, 52, 1.0),
('Quel investissement êtes-vous prêt à faire pour l''éducation ?', 'education', 'investissement', false, 53, 1.5),

-- Questions Communication (7 questions)
('Comment préférez-vous résoudre les conflits ?', 'communication', 'conflits', false, 54, 2.0),
('Quelle importance accordez-vous à l''écoute active ?', 'communication', 'ecoute', false, 55, 2.0),
('Comment exprimez-vous vos besoins et attentes ?', 'communication', 'expression', false, 56, 1.5),
('Quel rôle joue l''humour dans votre couple ?', 'communication', 'humour', false, 57, 1.0),
('Comment gérez-vous les moments de silence ?', 'communication', 'silence', false, 58, 1.0),
('Quelle place accordez-vous aux discussions profondes ?', 'communication', 'profondeur', false, 59, 1.5),
('Comment maintenez-vous la complicité au fil du temps ?', 'communication', 'complicite', false, 60, 1.5);

-- Vérification du nombre de questions insérées
DO $$
DECLARE
    question_count integer;
BEGIN
    SELECT COUNT(*) INTO question_count FROM questions;
    RAISE NOTICE 'Nombre de questions insérées: %', question_count;
END $$;
