-- Script pour insérer les 100 questions de personnalité dans la base Supabase
-- Exécution: copier-coller ce script dans l'éditeur SQL de Supabase

-- Nettoyer la table questions
TRUNCATE TABLE questions RESTART IDENTITY CASCADE;

-- Script de migration généré automatiquement
-- Source: src/data/personality-questions.ts

-- INSÉRER LES 100 QUESTIONS DE PERSONNALITÉ

INSERT INTO questions (id, axis, label, type, weight, is_dealbreaker, order_index) VALUES

-- DIMENSION 1: PRATIQUE RELIGIEUSE ET SPIRITUALITÉ (Questions 1-15)
(1, 'Spiritualité', 'Je prie les 5 prières quotidiennes régulièrement.', 'scale', 1.5, true, 1),
(2, 'Spiritualité', 'Je lis le Coran au moins une fois par semaine.', 'scale', 1.2, false, 2),
(3, 'Spiritualité', 'Je considère que la spiritualité guide mes décisions importantes.', 'scale', 1.3, true, 3),
(4, 'Spiritualité', 'Je souhaite accomplir le Hajj avec mon conjoint.', 'bool', 1.0, false, 4),
(5, 'Spiritualité', 'Je préfère fréquenter des personnes pratiquantes.', 'scale', 1.1, false, 5),
(6, 'Spiritualité', 'Le jeûne du Ramadan est un pilier important de ma vie.', 'scale', 1.4, true, 6),
(7, 'Spiritualité', 'Je participe régulièrement aux activités de ma mosquée.', 'scale', 1.0, false, 7),
(8, 'Spiritualité', 'Je cherche constamment à approfondir ma connaissance religieuse.', 'scale', 1.1, false, 8),
(9, 'Spiritualité', 'Je considère que l''invocation (dhikr) fait partie de ma routine.', 'scale', 1.0, false, 9),
(10, 'Spiritualité', 'Je préfère célébrer les fêtes religieuses de manière traditionnelle.', 'scale', 1.1, false, 10),
(11, 'Spiritualité', 'La prière en congrégation est importante pour moi.', 'scale', 1.0, false, 11),
(12, 'Spiritualité', 'Je respecte strictement les interdits alimentaires islamiques.', 'scale', 1.3, true, 12),
(13, 'Spiritualité', 'Je considère que mon travail doit être conforme aux valeurs islamiques.', 'scale', 1.2, false, 13),
(14, 'Spiritualité', 'Je donne régulièrement la zakat et la sadaqah.', 'scale', 1.1, false, 14),
(15, 'Spiritualité', 'Je souhaite que ma famille pratique l''Islam ensemble.', 'scale', 1.3, false, 15),

-- DIMENSION 2: VALEURS FAMILIALES ET RÔLES (Questions 16-30)
(16, 'Famille', 'Je souhaite avoir des enfants.', 'bool', 1.5, true, 16),
(17, 'Famille', 'L''éducation islamique de mes enfants est prioritaire.', 'scale', 1.4, true, 17),
(18, 'Famille', 'Je préfère une famille nombreuse (plus de 3 enfants).', 'scale', 1.2, false, 18),
(19, 'Famille', 'Le respect des parents est un pilier de ma relation.', 'scale', 1.4, true, 19),
(20, 'Famille', 'Je veux transmettre la langue arabe à mes enfants.', 'scale', 1.1, false, 20),
(21, 'Famille', 'Ma famille d''origine doit approuver mon choix de conjoint.', 'scale', 1.2, false, 21),
(22, 'Famille', 'Je préfère vivre près de ma famille élargie.', 'scale', 1.0, false, 22),
(23, 'Famille', 'Les traditions familiales sont importantes à perpétuer.', 'scale', 1.1, false, 23),
(24, 'Famille', 'Je veux que mes enfants fréquentent des écoles islamiques.', 'scale', 1.2, false, 24),
(25, 'Famille', 'L''harmonie familiale passe avant mes intérêts personnels.', 'scale', 1.2, false, 25),
(26, 'Famille', 'Je considère important de maintenir les liens de parenté.', 'scale', 1.3, false, 26),
(27, 'Famille', 'Les décisions familiales importantes doivent être consultées.', 'scale', 1.3, false, 27),
(28, 'Famille', 'Je veux célébrer les événements familiaux de manière traditionnelle.', 'scale', 1.0, false, 28),
(29, 'Famille', 'L''hospitalité est une valeur centrale de mon foyer.', 'scale', 1.1, false, 29),
(30, 'Famille', 'Je souhaite élever mes enfants de manière bilingue.', 'scale', 1.0, false, 30),

-- DIMENSION 3: RELATIONS SOCIALES ET COMMUNAUTAIRES (Questions 31-45)
(31, 'Social', 'Je préfère des amitiés avec des personnes de même confession.', 'scale', 1.1, false, 31),
(32, 'Social', 'Je m''implique activement dans ma communauté musulmane.', 'scale', 1.2, false, 32),
(33, 'Social', 'Je suis à l''aise en société avec des non-musulmans.', 'scale', 1.0, false, 33),
(34, 'Social', 'Je préfère des activités sociales respectueuses des valeurs islamiques.', 'scale', 1.2, false, 34),
(35, 'Social', 'L''entraide communautaire fait partie de mes priorités.', 'scale', 1.1, false, 35),
(36, 'Social', 'Je participe régulièrement aux événements de ma mosquée.', 'scale', 1.0, false, 36),
(37, 'Social', 'Je suis à l''aise pour parler de ma foi avec autrui.', 'scale', 1.1, false, 37),
(38, 'Social', 'Je préfère éviter les environnements où l''alcool est présent.', 'scale', 1.3, true, 38),
(39, 'Social', 'Les amitiés mixtes doivent respecter certaines limites.', 'scale', 1.2, false, 39),
(40, 'Social', 'Je souhaite que mon conjoint partage mes cercles sociaux.', 'scale', 1.1, false, 40),
(41, 'Social', 'Je préfère les loisirs culturellement enrichissants.', 'scale', 1.0, false, 41),
(42, 'Social', 'Je suis ouvert(e) au dialogue interreligieux respectueux.', 'scale', 1.0, false, 42),
(43, 'Social', 'Ma réputation dans la communauté m''importe.', 'scale', 1.1, false, 43),
(44, 'Social', 'Je préfère les sorties en groupe plutôt qu''en couple isolé.', 'scale', 1.0, false, 44),
(45, 'Social', 'L''engagement caritatif fait partie de ma vie sociale.', 'scale', 1.2, false, 45),

-- DIMENSION 4: LIFESTYLE ET HABITUDES QUOTIDIENNES (Questions 46-60)
(46, 'Lifestyle', 'Je maintiens un mode de vie sain et équilibré.', 'scale', 1.1, false, 46),
(47, 'Lifestyle', 'Je préfère me coucher et me lever tôt.', 'scale', 1.0, false, 47),
(48, 'Lifestyle', 'L''exercice physique fait partie de ma routine.', 'scale', 1.0, false, 48),
(49, 'Lifestyle', 'Je limite ma consommation de médias non-islamiques.', 'scale', 1.1, false, 49),
(50, 'Lifestyle', 'Je préfère cuisiner des plats traditionnels.', 'scale', 1.0, false, 50),
(51, 'Lifestyle', 'Je planifie mes journées en incluant les temps de prière.', 'scale', 1.2, false, 51),
(52, 'Lifestyle', 'Je préfère un foyer calme et paisible.', 'scale', 1.1, false, 52),
(53, 'Lifestyle', 'Les voyages doivent respecter mes principes religieux.', 'scale', 1.2, false, 53),
(54, 'Lifestyle', 'Je suis attentif(ve) à la provenance halal de mes achats.', 'scale', 1.2, false, 54),
(55, 'Lifestyle', 'Je préfère limiter les sorties nocturnes.', 'scale', 1.1, false, 55),
(56, 'Lifestyle', 'La décoration de mon intérieur reflète mes valeurs.', 'scale', 1.0, false, 56),
(57, 'Lifestyle', 'Je privilégie la qualité à la quantité dans mes achats.', 'scale', 1.0, false, 57),
(58, 'Lifestyle', 'Je préfère éviter les environnements trop bruyants.', 'scale', 1.0, false, 58),
(59, 'Lifestyle', 'Mes habitudes alimentaires suivent les recommandations prophétiques.', 'scale', 1.1, false, 59),
(60, 'Lifestyle', 'Je maintiens une routine d''apprentissage religieux.', 'scale', 1.1, false, 60),

-- DIMENSION 5: GESTION FINANCIÈRE ET MATÉRIELLE (Questions 61-75)
(61, 'Finance', 'Je considère que la gestion financière doit être partagée.', 'scale', 1.2, false, 61),
(62, 'Finance', 'L''épargne pour les projets familiaux est prioritaire.', 'scale', 1.2, false, 62),
(63, 'Finance', 'Je refuse catégoriquement l''intérêt bancaire (riba).', 'scale', 1.4, true, 63),
(64, 'Finance', 'Je préfère un train de vie modeste et raisonnable.', 'scale', 1.2, false, 64),
(65, 'Finance', 'La transparence financière est essentielle dans le couple.', 'scale', 1.3, false, 65),
(66, 'Finance', 'Je privilégie l''investissement dans l''éducation des enfants.', 'scale', 1.2, false, 66),
(67, 'Finance', 'Je suis prêt(e) à sacrifier le confort pour respecter mes principes.', 'scale', 1.1, false, 67),
(68, 'Finance', 'L''aumône (zakat) est un budget prioritaire.', 'scale', 1.3, false, 68),
(69, 'Finance', 'Je préfère éviter les dépenses ostentatoires.', 'scale', 1.1, false, 69),
(70, 'Finance', 'L''épargne pour le hajj est un objectif important.', 'scale', 1.1, false, 70),
(71, 'Finance', 'Je privilégie les banques et assurances islamiques.', 'scale', 1.2, false, 71),
(72, 'Finance', 'Les revenus du couple doivent servir la famille avant tout.', 'scale', 1.2, false, 72),
(73, 'Finance', 'Je suis rigoureux(se) dans la tenue de mes comptes.', 'scale', 1.1, false, 73),
(74, 'Finance', 'L''indépendance financière de chaque époux est importante.', 'scale', 1.0, false, 74),
(75, 'Finance', 'Je planifie mes dépenses selon les priorités islamiques.', 'scale', 1.2, false, 75),

-- DIMENSION 6: COMMUNICATION ET RÉSOLUTION DE CONFLITS (Questions 76-90)
(76, 'Communication', 'Je préfère discuter calmement des problèmes.', 'scale', 1.3, false, 76),
(77, 'Communication', 'J''exprime facilement mes sentiments et besoins.', 'scale', 1.2, false, 77),
(78, 'Communication', 'Je suis à l''écoute des préoccupations de mon partenaire.', 'scale', 1.3, false, 78),
(79, 'Communication', 'Les silences prolongés me mettent mal à l''aise.', 'scale', 1.0, false, 79),
(80, 'Communication', 'Je privilégie la médiation en cas de conflit grave.', 'scale', 1.2, false, 80),
(81, 'Communication', 'L''humour aide à désamorcer les tensions.', 'scale', 1.1, false, 81),
(82, 'Communication', 'Je respecte le besoin d''espace de mon partenaire.', 'scale', 1.2, false, 82),
(83, 'Communication', 'Je préfère résoudre les conflits rapidement.', 'scale', 1.1, false, 83),
(84, 'Communication', 'Les conseils familiaux sont utiles pour résoudre les problèmes.', 'scale', 1.1, false, 84),
(85, 'Communication', 'Je suis capable de présenter mes excuses sincèrement.', 'scale', 1.2, false, 85),
(86, 'Communication', 'La patience est ma principale qualité relationnelle.', 'scale', 1.2, false, 86),
(87, 'Communication', 'Je préfère éviter les sujets de désaccord profond.', 'scale', 1.0, false, 87),
(88, 'Communication', 'L''honnêteté doit primer même si elle peut blesser.', 'scale', 1.1, false, 88),
(89, 'Communication', 'Je consulte facilement un imam en cas de conflit conjugal.', 'scale', 1.1, false, 89),
(90, 'Communication', 'La prière en commun aide à résoudre nos différends.', 'scale', 1.2, false, 90),

-- DIMENSION 7: PROJETS D'AVENIR ET AMBITIONS (Questions 91-100)
(91, 'Projets', 'Je souhaite me marier dans les 12 prochains mois.', 'bool', 1.5, true, 91),
(92, 'Projets', 'L''expatriation est envisageable pour ma famille.', 'scale', 1.1, false, 92),
(93, 'Projets', 'Je veux créer une entreprise respectueuse des valeurs islamiques.', 'scale', 1.0, false, 93),
(94, 'Projets', 'L''apprentissage continu fait partie de mes objectifs.', 'scale', 1.1, false, 94),
(95, 'Projets', 'Je rêve de posséder ma propre maison.', 'scale', 1.1, false, 95),
(96, 'Projets', 'Voyager dans des pays musulmans m''intéresse.', 'scale', 1.0, false, 96),
(97, 'Projets', 'Je veux contribuer activement au développement de ma communauté.', 'scale', 1.2, false, 97),
(98, 'Projets', 'La retraite spirituelle fait partie de mes projets.', 'scale', 1.0, false, 98),
(99, 'Projets', 'Je souhaite transmettre un héritage spirituel à mes descendants.', 'scale', 1.3, false, 99),
(100, 'Projets', 'Mes ambitions professionnelles doivent s''aligner avec ma foi.', 'scale', 1.2, false, 100);

-- Reset de la séquence pour correspondre aux IDs
SELECT setval('questions_id_seq', 100, true);

-- Vérification des insertions
DO $$
DECLARE
    total_count INTEGER;
    dealbreaker_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_count FROM questions;
    SELECT COUNT(*) INTO dealbreaker_count FROM questions WHERE is_dealbreaker = TRUE;
    
    RAISE NOTICE '✅ Total questions insérées: %', total_count;
    RAISE NOTICE '🚨 Questions deal-breakers: %', dealbreaker_count;
    RAISE NOTICE '📊 Répartition par axe:';
    
    FOR axis_info IN
        SELECT axis, COUNT(*) as count 
        FROM questions 
        GROUP BY axis 
        ORDER BY axis
    LOOP
        RAISE NOTICE '   - %: % questions', axis_info.axis, axis_info.count;
    END LOOP;
    
    IF total_count != 100 THEN
        RAISE EXCEPTION '❌ Erreur: % questions au lieu de 100', total_count;
    END IF;
END $$;

-- Message de succès
SELECT '🎉 Les 100 questions de personnalité ont été ajoutées avec succès !' as status;