-- Migration vers 100 questions de personnalité pour NikahScore
-- Supprime les anciennes questions et insère les nouvelles

-- Supprimer toutes les anciennes questions
DELETE FROM questions;

-- Réinitialiser la séquence
ALTER SEQUENCE questions_id_seq RESTART WITH 1;

-- Insérer les 100 nouvelles questions axées sur la personnalité
INSERT INTO questions (axis, text, category, weight, is_dealbreaker, order_index) VALUES
-- DIMENSION 1: SPIRITUALITÉ ET PRATIQUE RELIGIEUSE (Questions 1-15)
('Spiritualité', 'Je prie les 5 prières quotidiennes régulièrement.', 'scale', 1.5, true, 1),
('Spiritualité', 'Je lis le Coran au moins une fois par semaine.', 'scale', 1.2, false, 2),
('Spiritualité', 'Je considère que la spiritualité guide mes décisions importantes.', 'scale', 1.3, true, 3),
('Spiritualité', 'Je souhaite accomplir le Hajj avec mon conjoint.', 'bool', 1.0, false, 4),
('Spiritualité', 'Je préfère fréquenter des personnes pratiquantes.', 'scale', 1.1, false, 5),
('Spiritualité', 'Je jeûne volontairement en dehors du Ramadan.', 'scale', 0.8, false, 6),
('Spiritualité', 'Je participe activement à la vie de ma mosquée.', 'scale', 0.9, false, 7),
('Spiritualité', 'Je souhaite éduquer mes enfants dans la tradition islamique.', 'scale', 1.4, true, 8),
('Spiritualité', 'Je pratique régulièrement des invocations (dhikr).', 'scale', 0.8, false, 9),
('Spiritualité', 'Je respecte strictement les règles alimentaires halal.', 'scale', 1.3, true, 10),
('Spiritualité', 'Je souhaite me marier selon les traditions islamiques.', 'bool', 1.5, true, 11),
('Spiritualité', 'Je considère le mariage comme un acte d''adoration.', 'scale', 1.2, false, 12),
('Spiritualité', 'Je refuse catégoriquement l''alcool dans ma vie.', 'bool', 1.4, true, 13),
('Spiritualité', 'Je préfère éviter les environnements avec musique.', 'scale', 0.7, false, 14),
('Spiritualité', 'Je souhaite faire la prière en couple avec mon conjoint.', 'scale', 1.0, false, 15),

-- DIMENSION 2: PERSONNALITÉ ET TEMPÉRAMENT (Questions 16-35)
('Personnalité', 'Je me considère comme une personne très patiente.', 'scale', 1.2, false, 16),
('Personnalité', 'Je suis naturellement optimiste face aux difficultés.', 'scale', 1.1, false, 17),
('Personnalité', 'Je préfère réfléchir longuement avant de prendre une décision.', 'scale', 1.0, false, 18),
('Personnalité', 'Je me mets souvent en colère pour des petites choses.', 'scale', 1.3, false, 19),
('Personnalité', 'Je suis une personne très sociable et extravertie.', 'scale', 0.9, false, 20),
('Personnalité', 'J''ai tendance à être perfectionniste dans mes tâches.', 'scale', 0.8, false, 21),
('Personnalité', 'Je pardonne facilement les erreurs des autres.', 'scale', 1.2, false, 22),
('Personnalité', 'Je suis une personne très organisée dans ma vie quotidienne.', 'scale', 1.0, false, 23),
('Personnalité', 'J''aime prendre des initiatives et diriger.', 'scale', 0.9, false, 24),
('Personnalité', 'Je préfère la routine à l''imprévu.', 'scale', 0.8, false, 25),
('Personnalité', 'Je suis très sensible aux critiques.', 'scale', 0.9, false, 26),
('Personnalité', 'J''exprime facilement mes émotions.', 'scale', 1.0, false, 27),
('Personnalité', 'Je suis une personne très empathique.', 'scale', 1.1, false, 28),
('Personnalité', 'Je préfère éviter les conflits à tout prix.', 'scale', 0.8, false, 29),
('Personnalité', 'Je suis quelqu''un de très déterminé dans mes objectifs.', 'scale', 1.0, false, 30),
('Personnalité', 'J''ai besoin de beaucoup de temps seul pour me ressourcer.', 'scale', 0.8, false, 31),
('Personnalité', 'Je suis spontané et j''aime les surprises.', 'scale', 0.7, false, 32),
('Personnalité', 'Je me préoccupe beaucoup du regard des autres.', 'scale', 0.7, false, 33),
('Personnalité', 'Je suis très attaché aux traditions familiales.', 'scale', 1.1, false, 34),
('Personnalité', 'J''adapte facilement mon comportement selon les situations.', 'scale', 0.9, false, 35),

-- DIMENSION 3: COMMUNICATION ET RELATIONS (Questions 36-50)
('Communication', 'Je préfère parler directement plutôt que de faire des sous-entendus.', 'scale', 1.2, false, 36),
('Communication', 'J''écoute attentivement avant de donner mon avis.', 'scale', 1.3, false, 37),
('Communication', 'Je me dispute souvent avec mes proches.', 'scale', 1.1, false, 38),
('Communication', 'Je préfère écrire mes sentiments plutôt que les dire.', 'scale', 0.8, false, 39),
('Communication', 'Je suis à l''aise pour exprimer mes besoins.', 'scale', 1.2, false, 40),
('Communication', 'Je préfère résoudre les problèmes immédiatement.', 'scale', 1.0, false, 41),
('Communication', 'J''utilise souvent l''humour pour détendre l''atmosphère.', 'scale', 0.9, false, 42),
('Communication', 'Je garde mes problèmes pour moi.', 'scale', 0.9, false, 43),
('Communication', 'Je critique constructivement pour aider.', 'scale', 1.0, false, 44),
('Communication', 'Je préfère éviter les sujets sensibles.', 'scale', 0.8, false, 45),
('Communication', 'Je remarque facilement les émotions des autres.', 'scale', 1.1, false, 46),
('Communication', 'J''ai besoin de beaucoup d''affection verbale.', 'scale', 0.9, false, 47),
('Communication', 'Je communique mieux en tête-à-tête qu''en groupe.', 'scale', 0.8, false, 48),
('Communication', 'Je n''hésite pas à demander de l''aide quand j''en ai besoin.', 'scale', 1.0, false, 49),
('Communication', 'Je préfère qu''on me pose des questions directes.', 'scale', 0.9, false, 50),

-- DIMENSION 4: FAMILLE ET RELATIONS (Questions 51-65)
('Famille', 'Je souhaite avoir des enfants dans les 2 prochaines années.', 'bool', 1.5, true, 51),
('Famille', 'Je veux avoir plus de 3 enfants.', 'bool', 1.3, true, 52),
('Famille', 'Je préfère vivre près de ma famille élargie.', 'scale', 1.1, false, 53),
('Famille', 'Ma famille d''origine influence beaucoup mes décisions.', 'scale', 1.0, false, 54),
('Famille', 'Je souhaite que ma belle-famille soit très impliquée.', 'scale', 1.0, false, 55),
('Famille', 'Je préfère élever mes enfants de manière stricte.', 'scale', 1.2, false, 56),
('Famille', 'L''éducation religieuse de mes enfants est prioritaire.', 'scale', 1.4, true, 57),
('Famille', 'Je compte envoyer mes enfants à l''école islamique.', 'scale', 1.1, false, 58),
('Famille', 'Je veux que mes enfants parlent parfaitement arabe.', 'scale', 0.9, false, 59),
('Famille', 'Je préfère avoir des enfants du même sexe.', 'scale', 0.6, false, 60),
('Famille', 'Ma famille doit approuver mon choix de conjoint.', 'scale', 1.2, false, 61),
('Famille', 'Je souhaite adopter des enfants si nécessaire.', 'scale', 0.8, false, 62),
('Famille', 'Je veux transmettre ma culture d''origine à mes enfants.', 'scale', 1.0, false, 63),
('Famille', 'Je préfère que mon conjoint ait le même background culturel.', 'scale', 0.9, false, 64),
('Famille', 'Les réunions familiales fréquentes sont importantes pour moi.', 'scale', 0.8, false, 65),

-- DIMENSION 5: STYLE DE VIE ET VALEURS (Questions 66-80)
('Style de vie', 'Je préfère vivre dans un quartier à majorité musulmane.', 'scale', 1.0, false, 66),
('Style de vie', 'Je suis très soucieux de mon apparence physique.', 'scale', 0.7, false, 67),
('Style de vie', 'Je préfère sortir principalement le weekend.', 'scale', 0.6, false, 68),
('Style de vie', 'Je suis très attaché aux voyages et découvertes.', 'scale', 0.8, false, 69),
('Style de vie', 'Je préfère une vie simple et sans superflu.', 'scale', 1.1, false, 70),
('Style de vie', 'J''aime recevoir des invités à la maison.', 'scale', 0.8, false, 71),
('Style de vie', 'Je fais du sport régulièrement.', 'scale', 0.7, false, 72),
('Style de vie', 'Je préfère cuisiner à la maison plutôt qu''au restaurant.', 'scale', 0.8, false, 73),
('Style de vie', 'Les réseaux sociaux occupent une place importante dans ma vie.', 'scale', 0.6, false, 74),
('Style de vie', 'Je préfère les activités calmes aux sorties animées.', 'scale', 0.7, false, 75),
('Style de vie', 'J''accorde beaucoup d''importance à mon développement personnel.', 'scale', 0.9, false, 76),
('Style de vie', 'Je préfère avoir un cercle social restreint mais proche.', 'scale', 0.8, false, 77),
('Style de vie', 'L''écologie et l''environnement me préoccupent beaucoup.', 'scale', 0.7, false, 78),
('Style de vie', 'Je préfère les marques et produits éthiques.', 'scale', 0.8, false, 79),
('Style de vie', 'Je suis très ponctuel dans tous mes rendez-vous.', 'scale', 0.9, false, 80),

-- DIMENSION 6: AMBITIONS ET PROJETS (Questions 81-100)
('Ambitions', 'Ma carrière professionnelle est très importante pour moi.', 'scale', 1.1, false, 81),
('Ambitions', 'Je souhaite devenir financièrement indépendant rapidement.', 'scale', 1.0, false, 82),
('Ambitions', 'J''accepterais de déménager pour ma carrière.', 'scale', 0.9, false, 83),
('Ambitions', 'Je veux créer ma propre entreprise.', 'scale', 0.8, false, 84),
('Ambitions', 'L''argent n''est pas ma motivation principale.', 'scale', 1.0, false, 85),
('Ambitions', 'Je souhaite poursuivre des études supérieures.', 'scale', 0.8, false, 86),
('Ambitions', 'Je veux contribuer à des œuvres caritatives.', 'scale', 1.2, false, 87),
('Ambitions', 'Posséder une belle maison est important pour moi.', 'scale', 0.7, false, 88),
('Ambitions', 'Je préfère la stabilité à l''aventure professionnelle.', 'scale', 0.9, false, 89),
('Ambitions', 'Je veux faire au moins un pèlerinage par an.', 'scale', 0.9, false, 90),
('Ambitions', 'Apprendre plusieurs langues m''intéresse beaucoup.', 'scale', 0.6, false, 91),
('Ambitions', 'Je veux devenir un pilier de ma communauté.', 'scale', 1.0, false, 92),
('Ambitions', 'L''équilibre vie privée/professionnelle est essentiel.', 'scale', 1.1, false, 93),
('Ambitions', 'Je veux laisser un héritage spirituel à mes enfants.', 'scale', 1.3, false, 94),
('Ambitions', 'Voyager dans les pays musulmans m''intéresse.', 'scale', 0.8, false, 95),
('Ambitions', 'Je veux maîtriser parfaitement l''arabe coranique.', 'scale', 1.0, false, 96),
('Ambitions', 'Participer à des projets communautaires me motive.', 'scale', 1.0, false, 97),
('Ambitions', 'Je souhaite enseigner l''Islam à d''autres personnes.', 'scale', 0.9, false, 98),
('Ambitions', 'Avoir une retraite confortable est important.', 'scale', 0.8, false, 99),
('Ambitions', 'Je veux que notre couple soit un modèle pour autres.', 'scale', 1.1, false, 100);

-- Vérification du nombre total de questions (100 questions au total)
DO $$
DECLARE
    total_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_count FROM questions;
    
    IF total_count != 100 THEN
        RAISE EXCEPTION 'Erreur: % questions au lieu de 100', total_count;
    END IF;
    
    RAISE NOTICE 'Migration réussie: % questions de personnalité insérées', total_count;
END
$$;