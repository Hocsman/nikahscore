-- Seed des questions pour NikahScore
-- 60 questions réparties sur 8 catégories et 6 axes principaux
-- Catégories: valeurs_religieuses, mode_de_vie, famille, finances, intimite, projets_avenir, education, communication
-- Axes: spiritualite, tradition, ouverture, stabilite, ambition, compatibilite

INSERT INTO questions (text, category, axis, is_dealbreaker, order_index, weight) VALUES

-- VALEURS RELIGIEUSES (axis: spiritualite, tradition)
('Je considère que la prière quotidienne (Salah) est essentielle dans ma vie', 'valeurs_religieuses', 'spiritualite', true, 1, 2.0),
('Je souhaite que mon futur conjoint pratique régulièrement les 5 prières', 'valeurs_religieuses', 'spiritualite', true, 2, 2.0),
('Le port du hijab/voile est important pour moi dans notre couple', 'valeurs_religieuses', 'tradition', true, 3, 1.8),
('Je veux que notre mariage soit célébré selon les traditions islamiques complètes', 'valeurs_religieuses', 'tradition', false, 4, 1.5),
('La lecture régulière du Coran fait partie de mes priorités', 'valeurs_religieuses', 'spiritualite', false, 5, 1.4),
('Je souhaite faire le pèlerinage (Hajj) avec mon conjoint', 'valeurs_religieuses', 'spiritualite', false, 6, 1.3),
('L''éducation religieuse de nos enfants est une priorité absolue', 'valeurs_religieuses', 'spiritualite', true, 7, 1.9),

-- MODE DE VIE (axis: ouverture, tradition, stabilite)
('Je suis à l''aise avec le fait d''avoir des amis non-musulmans', 'mode_de_vie', 'ouverture', false, 8, 1.2),
('Je préfère socialiser principalement dans un environnement musulman', 'mode_de_vie', 'tradition', false, 9, 1.1),
('Je souhaite que ma femme reste à la maison après le mariage', 'mode_de_vie', 'tradition', true, 10, 1.8),
('Il est important que mon futur conjoint ait un travail/carrière', 'mode_de_vie', 'stabilite', false, 11, 1.4),
('Je suis ouvert(e) à vivre dans un pays occidental', 'mode_de_vie', 'ouverture', false, 12, 1.3),
('La nourriture halal est non-négociable dans notre foyer', 'mode_de_vie', 'tradition', true, 13, 1.9),
('Je suis à l''aise avec la technologie et les réseaux sociaux', 'mode_de_vie', 'ouverture', false, 14, 1.0),

-- FAMILLE (axis: tradition, stabilite, compatibilite)
('Je veux absolument avoir des enfants dans les 2-3 premières années', 'famille', 'stabilite', true, 15, 1.8),
('Ma famille d''origine aura un rôle important dans notre couple', 'famille', 'tradition', false, 16, 1.3),
('Je préfère que nous vivions près de nos familles respectives', 'famille', 'stabilite', false, 17, 1.2),
('L''avis de mes parents sur mon futur conjoint est déterminant', 'famille', 'tradition', false, 18, 1.4),
('Je souhaite avoir une famille nombreuse (4+ enfants)', 'famille', 'stabilite', false, 19, 1.3),
('Il est important que nos familles s''entendent bien', 'famille', 'compatibilite', false, 20, 1.5),
('Je veux que mes enfants parlent la langue de mes parents', 'famille', 'tradition', false, 21, 1.1),

-- FINANCES (axis: ambition, stabilite)
('Il est essentiel que mon conjoint ait une situation financière stable', 'finances', 'stabilite', true, 22, 1.7),
('Je préfère gérer nos finances de manière commune et transparente', 'finances', 'compatibilite', false, 23, 1.4),
('L''ambition professionnelle de mon conjoint est très importante', 'finances', 'ambition', false, 24, 1.3),
('Je souhaite pouvoir maintenir mon niveau de vie actuel', 'finances', 'stabilite', false, 25, 1.2),
('Épargner pour l''achat d''une maison est une priorité', 'finances', 'stabilite', false, 26, 1.4),
('Je suis prêt(e) à faire des sacrifices financiers pour ma famille', 'finances', 'compatibilite', false, 27, 1.2),

-- INTIMITÉ ET COUPLE (axis: compatibilite, ouverture)
('La communication ouverte sur tous les sujets est essentielle', 'intimite', 'compatibilite', false, 28, 1.6),
('Je souhaite que nous prenions les décisions importantes ensemble', 'intimite', 'compatibilite', false, 29, 1.5),
('Il est important d''avoir des moments d''intimité réguliers', 'intimite', 'compatibilite', false, 30, 1.4),
('Je veux pouvoir exprimer mes sentiments librement', 'intimite', 'ouverture', false, 31, 1.3),
('La confiance mutuelle est la base de notre relation', 'intimite', 'compatibilite', true, 32, 1.9),
('Je souhaite que nous gardions nos téléphones sans mot de passe', 'intimite', 'ouverture', false, 33, 1.1),

-- PROJETS D'AVENIR (axis: ambition, ouverture, stabilite)
('J''aimerais voyager régulièrement avec mon conjoint', 'projets_avenir', 'ouverture', false, 34, 1.2),
('Créer notre propre entreprise ensemble m''intéresse', 'projets_avenir', 'ambition', false, 35, 1.1),
('Je veux que nous continuions à apprendre et grandir ensemble', 'projets_avenir', 'ouverture', false, 36, 1.3),
('Acheter une maison dans les 5 ans est un objectif important', 'projets_avenir', 'stabilite', false, 37, 1.4),
('Je souhaite que nous soyons actifs dans la communauté musulmane', 'projets_avenir', 'tradition', false, 38, 1.2),
('Il est important d''avoir des objectifs de vie similaires', 'projets_avenir', 'compatibilite', false, 39, 1.5),
('Je veux pouvoir poursuivre mes passions personnelles après le mariage', 'projets_avenir', 'ouverture', false, 40, 1.3),

-- QUESTIONS SUPPLÉMENTAIRES POUR ENRICHIR LE TEST

-- VALEURS RELIGIEUSES SUPPLÉMENTAIRES
('Je pratique le jeûne du Ramadan de manière stricte', 'valeurs_religieuses', 'spiritualite', true, 41, 1.8),
('Je souhaite faire les prières de Tarawih ensemble pendant le Ramadan', 'valeurs_religieuses', 'spiritualite', false, 42, 1.3),
('L''aumône (Zakat) doit être calculée et donnée précisément', 'valeurs_religieuses', 'spiritualite', false, 43, 1.4),
('Je veux que notre foyer soit un exemple islamique pour notre entourage', 'valeurs_religieuses', 'tradition', false, 44, 1.5),
('La récitation du Coran en famille est importante pour moi', 'valeurs_religieuses', 'spiritualite', false, 45, 1.2),

-- MODE DE VIE SUPPLÉMENTAIRES  
('Je suis à l''aise avec les sorties en couples mixtes (mariés)', 'mode_de_vie', 'ouverture', false, 46, 1.2),
('Je préfère éviter la musique et les divertissements non-islamiques', 'mode_de_vie', 'tradition', false, 47, 1.1),
('Il est important de maintenir une décoration islamique à la maison', 'mode_de_vie', 'tradition', false, 48, 1.0),
('Je souhaite que nous prenions nos vacances en terre d''Islam', 'mode_de_vie', 'tradition', false, 49, 1.2),
('L''exercice physique et la santé sont des priorités dans notre couple', 'mode_de_vie', 'stabilite', false, 50, 1.3),

-- ÉDUCATION ET DÉVELOPPEMENT PERSONNEL
('Je veux continuer mes études islamiques après le mariage', 'education', 'ambition', false, 51, 1.3),
('L''apprentissage de l''arabe coranique est une priorité', 'education', 'spiritualite', false, 52, 1.4),
('Je souhaite que nous assistions régulièrement à des cours religieux', 'education', 'spiritualite', false, 53, 1.2),
('Il est important que mon conjoint soit cultivé et ouvert', 'education', 'ouverture', false, 54, 1.4),
('Je veux transmettre plusieurs langues à nos enfants', 'education', 'ouverture', false, 55, 1.1),

-- COMMUNICATION ET RÉSOLUTION DE CONFLITS
('Je préfère discuter des problèmes immédiatement plutôt que d''attendre', 'communication', 'ouverture', false, 56, 1.5),
('Il est acceptable de demander conseil à nos parents en cas de désaccord', 'communication', 'tradition', false, 57, 1.2),
('Je crois qu''il faut parfois accepter d''être en désaccord sans forcer', 'communication', 'compatibilite', false, 58, 1.3),
('La médiation religieuse peut aider en cas de conflit majeur', 'communication', 'tradition', false, 59, 1.4),
('Je pense qu''il faut toujours chercher des solutions ensemble', 'communication', 'compatibilite', false, 60, 1.6);

-- Vérification du nombre total de questions (60 questions au total)
SELECT 
    category,
    axis,
    COUNT(*) as count,
    COUNT(CASE WHEN is_dealbreaker THEN 1 END) as dealbreakers
FROM questions 
GROUP BY category, axis
ORDER BY category, axis;

-- Statistiques globales
SELECT 
    COUNT(*) as total_questions,
    COUNT(CASE WHEN is_dealbreaker THEN 1 END) as total_dealbreakers,
    COUNT(DISTINCT category) as total_categories,
    COUNT(DISTINCT axis) as total_axes
FROM questions;
