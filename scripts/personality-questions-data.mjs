/**
 * Les 100 questions de personnalité pour NikahScore
 * Version complète avec tous les axes psychologiques
 */

export const PERSONALITY_QUESTIONS = [
  // DIMENSION 1: SPIRITUALITÉ (15 questions)
  { axis: 'Spiritualité', text: 'Je prie les 5 prières quotidiennes régulièrement.', category: 'scale', weight: 1.5, is_dealbreaker: true, order_index: 1 },
  { axis: 'Spiritualité', text: 'Je lis le Coran au moins une fois par semaine.', category: 'scale', weight: 1.2, is_dealbreaker: false, order_index: 2 },
  { axis: 'Spiritualité', text: 'Je considère que la spiritualité guide mes décisions importantes.', category: 'scale', weight: 1.3, is_dealbreaker: true, order_index: 3 },
  { axis: 'Spiritualité', text: 'Je souhaite accomplir le Hajj avec mon conjoint.', category: 'bool', weight: 1.0, is_dealbreaker: false, order_index: 4 },
  { axis: 'Spiritualité', text: 'Je préfère fréquenter des personnes pratiquantes.', category: 'scale', weight: 1.1, is_dealbreaker: false, order_index: 5 },
  { axis: 'Spiritualité', text: 'Je jeûne volontairement en dehors du Ramadan.', category: 'scale', weight: 0.8, is_dealbreaker: false, order_index: 6 },
  { axis: 'Spiritualité', text: 'Je participe activement à la vie de ma mosquée.', category: 'scale', weight: 0.9, is_dealbreaker: false, order_index: 7 },
  { axis: 'Spiritualité', text: 'Je souhaite éduquer mes enfants dans la tradition islamique.', category: 'scale', weight: 1.4, is_dealbreaker: true, order_index: 8 },
  { axis: 'Spiritualité', text: 'Je pratique régulièrement des invocations (dhikr).', category: 'scale', weight: 0.8, is_dealbreaker: false, order_index: 9 },
  { axis: 'Spiritualité', text: 'Je respecte strictement les règles alimentaires halal.', category: 'scale', weight: 1.3, is_dealbreaker: true, order_index: 10 },
  { axis: 'Spiritualité', text: 'Je souhaite me marier selon les traditions islamiques.', category: 'bool', weight: 1.5, is_dealbreaker: true, order_index: 11 },
  { axis: 'Spiritualité', text: 'Je considère le mariage comme un acte d\'adoration.', category: 'scale', weight: 1.2, is_dealbreaker: false, order_index: 12 },
  { axis: 'Spiritualité', text: 'Je refuse catégoriquement l\'alcool dans ma vie.', category: 'bool', weight: 1.4, is_dealbreaker: true, order_index: 13 },
  { axis: 'Spiritualité', text: 'Je préfère éviter les environnements avec musique.', category: 'scale', weight: 0.7, is_dealbreaker: false, order_index: 14 },
  { axis: 'Spiritualité', text: 'Je souhaite faire la prière en couple avec mon conjoint.', category: 'scale', weight: 1.0, is_dealbreaker: false, order_index: 15 },

  // DIMENSION 2: PERSONNALITÉ (20 questions)
  { axis: 'Personnalité', text: 'Je me considère comme une personne très patiente.', category: 'scale', weight: 1.2, is_dealbreaker: false, order_index: 16 },
  { axis: 'Personnalité', text: 'Je suis naturellement optimiste face aux difficultés.', category: 'scale', weight: 1.1, is_dealbreaker: false, order_index: 17 },
  { axis: 'Personnalité', text: 'Je préfère réfléchir longuement avant de prendre une décision.', category: 'scale', weight: 1.0, is_dealbreaker: false, order_index: 18 },
  { axis: 'Personnalité', text: 'Je me mets souvent en colère pour des petites choses.', category: 'scale', weight: 1.3, is_dealbreaker: false, order_index: 19 },
  { axis: 'Personnalité', text: 'Je suis une personne très sociable et extravertie.', category: 'scale', weight: 0.9, is_dealbreaker: false, order_index: 20 },
  { axis: 'Personnalité', text: 'J\'ai tendance à être perfectionniste dans mes tâches.', category: 'scale', weight: 0.8, is_dealbreaker: false, order_index: 21 },
  { axis: 'Personnalité', text: 'Je pardonne facilement les erreurs des autres.', category: 'scale', weight: 1.2, is_dealbreaker: false, order_index: 22 },
  { axis: 'Personnalité', text: 'Je suis une personne très organisée dans ma vie quotidienne.', category: 'scale', weight: 1.0, is_dealbreaker: false, order_index: 23 },
  { axis: 'Personnalité', text: 'J\'aime prendre des initiatives et diriger.', category: 'scale', weight: 0.9, is_dealbreaker: false, order_index: 24 },
  { axis: 'Personnalité', text: 'Je préfère la routine à l\'imprévu.', category: 'scale', weight: 0.8, is_dealbreaker: false, order_index: 25 },
  { axis: 'Personnalité', text: 'Je suis très sensible aux critiques.', category: 'scale', weight: 0.9, is_dealbreaker: false, order_index: 26 },
  { axis: 'Personnalité', text: 'J\'exprime facilement mes émotions.', category: 'scale', weight: 1.0, is_dealbreaker: false, order_index: 27 },
  { axis: 'Personnalité', text: 'Je suis une personne très empathique.', category: 'scale', weight: 1.1, is_dealbreaker: false, order_index: 28 },
  { axis: 'Personnalité', text: 'Je préfère éviter les conflits à tout prix.', category: 'scale', weight: 0.8, is_dealbreaker: false, order_index: 29 },
  { axis: 'Personnalité', text: 'Je suis quelqu\'un de très déterminé dans mes objectifs.', category: 'scale', weight: 1.0, is_dealbreaker: false, order_index: 30 },
  { axis: 'Personnalité', text: 'J\'ai besoin de beaucoup de temps seul pour me ressourcer.', category: 'scale', weight: 0.8, is_dealbreaker: false, order_index: 31 },
  { axis: 'Personnalité', text: 'Je suis spontané et j\'aime les surprises.', category: 'scale', weight: 0.7, is_dealbreaker: false, order_index: 32 },
  { axis: 'Personnalité', text: 'Je me préoccupe beaucoup du regard des autres.', category: 'scale', weight: 0.7, is_dealbreaker: false, order_index: 33 },
  { axis: 'Personnalité', text: 'Je suis très attaché aux traditions familiales.', category: 'scale', weight: 1.1, is_dealbreaker: false, order_index: 34 },
  { axis: 'Personnalité', text: 'J\'adapte facilement mon comportement selon les situations.', category: 'scale', weight: 0.9, is_dealbreaker: false, order_index: 35 },

  // DIMENSION 3: COMMUNICATION (15 questions)
  { axis: 'Communication', text: 'Je parle ouvertement de mes sentiments avec mon partenaire.', category: 'scale', weight: 1.3, is_dealbreaker: false, order_index: 36 },
  { axis: 'Communication', text: 'J\'écoute attentivement sans interrompre.', category: 'scale', weight: 1.2, is_dealbreaker: false, order_index: 37 },
  { axis: 'Communication', text: 'Je préfère résoudre les conflits par la discussion.', category: 'scale', weight: 1.4, is_dealbreaker: true, order_index: 38 },
  { axis: 'Communication', text: 'J\'ai du mal à exprimer mes besoins clairement.', category: 'scale', weight: 1.1, is_dealbreaker: false, order_index: 39 },
  { axis: 'Communication', text: 'Je préfère les discussions profondes aux conversations légères.', category: 'scale', weight: 0.8, is_dealbreaker: false, order_index: 40 },
  { axis: 'Communication', text: 'Je deviens silencieux quand je suis contrarié.', category: 'scale', weight: 1.0, is_dealbreaker: false, order_index: 41 },
  { axis: 'Communication', text: 'J\'utilise souvent l\'humour pour détendre l\'atmosphère.', category: 'scale', weight: 0.9, is_dealbreaker: false, order_index: 42 },
  { axis: 'Communication', text: 'Je respecte les opinions différentes des miennes.', category: 'scale', weight: 1.3, is_dealbreaker: true, order_index: 43 },
  { axis: 'Communication', text: 'Je parle plusieurs langues couramment.', category: 'scale', weight: 0.7, is_dealbreaker: false, order_index: 44 },
  { axis: 'Communication', text: 'Je préfère communiquer par écrit plutôt qu\'oralement.', category: 'scale', weight: 0.6, is_dealbreaker: false, order_index: 45 },
  { axis: 'Communication', text: 'Je suis à l\'aise pour parler en public.', category: 'scale', weight: 0.7, is_dealbreaker: false, order_index: 46 },
  { axis: 'Communication', text: 'J\'évite les sujets de conversation difficiles.', category: 'scale', weight: 1.0, is_dealbreaker: false, order_index: 47 },
  { axis: 'Communication', text: 'Je pose beaucoup de questions pour comprendre.', category: 'scale', weight: 1.1, is_dealbreaker: false, order_index: 48 },
  { axis: 'Communication', text: 'Je préfère les gestes aux mots pour montrer mon affection.', category: 'scale', weight: 0.8, is_dealbreaker: false, order_index: 49 },
  { axis: 'Communication', text: 'Je suis capable de critiquer de manière constructive.', category: 'scale', weight: 1.2, is_dealbreaker: false, order_index: 50 },

  // DIMENSION 4: FAMILLE (20 questions)
  { axis: 'Famille', text: 'Je souhaite avoir des enfants dans les 2-3 premières années.', category: 'scale', weight: 1.5, is_dealbreaker: true, order_index: 51 },
  { axis: 'Famille', text: 'Je veux au moins 3 enfants.', category: 'scale', weight: 1.2, is_dealbreaker: false, order_index: 52 },
  { axis: 'Famille', text: 'L\'éducation religieuse des enfants est ma priorité.', category: 'scale', weight: 1.4, is_dealbreaker: true, order_index: 53 },
  { axis: 'Famille', text: 'Je souhaite que ma femme reste à la maison avec les enfants.', category: 'scale', weight: 1.3, is_dealbreaker: true, order_index: 54 },
  { axis: 'Famille', text: 'Je veux vivre près de ma famille élargie.', category: 'scale', weight: 1.0, is_dealbreaker: false, order_index: 55 },
  { axis: 'Famille', text: 'L\'harmonie avec ma belle-famille est très importante.', category: 'scale', weight: 1.2, is_dealbreaker: false, order_index: 56 },
  { axis: 'Famille', text: 'Je souhaite organiser des réunions familiales régulières.', category: 'scale', weight: 0.9, is_dealbreaker: false, order_index: 57 },
  { axis: 'Famille', text: 'L\'éducation bilingue de mes enfants est importante.', category: 'scale', weight: 0.8, is_dealbreaker: false, order_index: 58 },
  { axis: 'Famille', text: 'Je veux impliquer mes parents dans l\'éducation des enfants.', category: 'scale', weight: 1.0, is_dealbreaker: false, order_index: 59 },
  { axis: 'Famille', text: 'Je préfère une famille nombreuse.', category: 'scale', weight: 1.1, is_dealbreaker: false, order_index: 60 },
  { axis: 'Famille', text: 'L\'adoption d\'enfants est envisageable pour moi.', category: 'bool', weight: 0.9, is_dealbreaker: false, order_index: 61 },
  { axis: 'Famille', text: 'Je veux transmettre notre culture d\'origine à nos enfants.', category: 'scale', weight: 1.1, is_dealbreaker: false, order_index: 62 },
  { axis: 'Famille', text: 'L\'éducation dans le pays d\'origine est importante.', category: 'scale', weight: 0.8, is_dealbreaker: false, order_index: 63 },
  { axis: 'Famille', text: 'Je souhaite que mes enfants apprennent l\'arabe.', category: 'scale', weight: 1.0, is_dealbreaker: false, order_index: 64 },
  { axis: 'Famille', text: 'La planification familiale doit être discutée ensemble.', category: 'scale', weight: 1.3, is_dealbreaker: true, order_index: 65 },
  { axis: 'Famille', text: 'Je veux prendre des décisions importantes en famille élargie.', category: 'scale', weight: 0.9, is_dealbreaker: false, order_index: 66 },
  { axis: 'Famille', text: 'L\'allaitement maternel est une priorité pour moi.', category: 'scale', weight: 0.8, is_dealbreaker: false, order_index: 67 },
  { axis: 'Famille', text: 'Je souhaite organiser des voyages familiaux réguliers.', category: 'scale', weight: 0.7, is_dealbreaker: false, order_index: 68 },
  { axis: 'Famille', text: 'L\'épargne pour l\'éducation des enfants est essentielle.', category: 'scale', weight: 1.0, is_dealbreaker: false, order_index: 69 },
  { axis: 'Famille', text: 'Je veux que mes enfants gardent des liens avec le pays d\'origine.', category: 'scale', weight: 0.9, is_dealbreaker: false, order_index: 70 },

  // DIMENSION 5: STYLE DE VIE (15 questions)
  { axis: 'Style de vie', text: 'Je pratique du sport au moins 3 fois par semaine.', category: 'scale', weight: 0.8, is_dealbreaker: false, order_index: 71 },
  { axis: 'Style de vie', text: 'J\'aime voyager et découvrir de nouvelles cultures.', category: 'scale', weight: 0.9, is_dealbreaker: false, order_index: 72 },
  { axis: 'Style de vie', text: 'Je préfère cuisiner des plats traditionnels.', category: 'scale', weight: 0.7, is_dealbreaker: false, order_index: 73 },
  { axis: 'Style de vie', text: 'J\'évite les réseaux sociaux autant que possible.', category: 'scale', weight: 0.6, is_dealbreaker: false, order_index: 74 },
  { axis: 'Style de vie', text: 'Je préfère les sorties en nature aux sorties en ville.', category: 'scale', weight: 0.5, is_dealbreaker: false, order_index: 75 },
  { axis: 'Style de vie', text: 'J\'aime recevoir des invités régulièrement.', category: 'scale', weight: 0.8, is_dealbreaker: false, order_index: 76 },
  { axis: 'Style de vie', text: 'Je surveille attentivement mon alimentation.', category: 'scale', weight: 0.7, is_dealbreaker: false, order_index: 77 },
  { axis: 'Style de vie', text: 'Je préfère me coucher tôt et me lever tôt.', category: 'scale', weight: 0.6, is_dealbreaker: false, order_index: 78 },
  { axis: 'Style de vie', text: 'J\'aime les activités artisanales et créatives.', category: 'scale', weight: 0.5, is_dealbreaker: false, order_index: 79 },
  { axis: 'Style de vie', text: 'Je préfère une vie simple et minimaliste.', category: 'scale', weight: 0.7, is_dealbreaker: false, order_index: 80 },
  { axis: 'Style de vie', text: 'J\'aime suivre les tendances et la mode.', category: 'scale', weight: 0.4, is_dealbreaker: false, order_index: 81 },
  { axis: 'Style de vie', text: 'Je préfère les activités intellectuelles aux activités physiques.', category: 'scale', weight: 0.6, is_dealbreaker: false, order_index: 82 },
  { axis: 'Style de vie', text: 'J\'aime passer du temps dans la nature régulièrement.', category: 'scale', weight: 0.7, is_dealbreaker: false, order_index: 83 },
  { axis: 'Style de vie', text: 'Je préfère économiser plutôt que dépenser.', category: 'scale', weight: 1.0, is_dealbreaker: false, order_index: 84 },
  { axis: 'Style de vie', text: 'J\'aime organiser et planifier mes activités à l\'avance.', category: 'scale', weight: 0.8, is_dealbreaker: false, order_index: 85 },

  // DIMENSION 6: AMBITIONS (15 questions)
  { axis: 'Ambitions', text: 'Ma carrière professionnelle est une priorité majeure.', category: 'scale', weight: 1.1, is_dealbreaker: false, order_index: 86 },
  { axis: 'Ambitions', text: 'Je souhaite créer ma propre entreprise.', category: 'scale', weight: 0.9, is_dealbreaker: false, order_index: 87 },
  { axis: 'Ambitions', text: 'Je veux acheter une maison dans les 5 prochaines années.', category: 'scale', weight: 1.2, is_dealbreaker: false, order_index: 88 },
  { axis: 'Ambitions', text: 'L\'accumulation de richesse est importante pour moi.', category: 'scale', weight: 0.8, is_dealbreaker: false, order_index: 89 },
  { axis: 'Ambitions', text: 'Je souhaite poursuivre des études supérieures.', category: 'scale', weight: 0.7, is_dealbreaker: false, order_index: 90 },
  { axis: 'Ambitions', text: 'Je veux avoir un impact positif sur ma communauté.', category: 'scale', weight: 1.0, is_dealbreaker: false, order_index: 91 },
  { axis: 'Ambitions', text: 'La stabilité financière prime sur l\'aventure professionnelle.', category: 'scale', weight: 1.1, is_dealbreaker: false, order_index: 92 },
  { axis: 'Ambitions', text: 'Je souhaite déménager à l\'étranger pour ma carrière.', category: 'scale', weight: 0.8, is_dealbreaker: false, order_index: 93 },
  { axis: 'Ambitions', text: 'Je veux transmettre un héritage financier à mes enfants.', category: 'scale', weight: 1.0, is_dealbreaker: false, order_index: 94 },
  { axis: 'Ambitions', text: 'L\'équilibre vie professionnelle/familiale est essentiel.', category: 'scale', weight: 1.3, is_dealbreaker: true, order_index: 95 },
  { axis: 'Ambitions', text: 'Je souhaite occuper un poste de direction.', category: 'scale', weight: 0.7, is_dealbreaker: false, order_index: 96 },
  { axis: 'Ambitions', text: 'Je préfère un travail stable à un travail passionnant.', category: 'scale', weight: 0.9, is_dealbreaker: false, order_index: 97 },
  { axis: 'Ambitions', text: 'Je veux contribuer à des causes caritatives importantes.', category: 'scale', weight: 1.0, is_dealbreaker: false, order_index: 98 },
  { axis: 'Ambitions', text: 'L\'apprentissage continu est une priorité dans ma vie.', category: 'scale', weight: 0.8, is_dealbreaker: false, order_index: 99 },
  { axis: 'Ambitions', text: 'Je souhaite laisser une trace positive dans le monde.', category: 'scale', weight: 1.1, is_dealbreaker: false, order_index: 100 }
]

// Statistiques des questions
export const QUESTIONS_STATS = {
  total: PERSONALITY_QUESTIONS.length,
  dimensions: {
    'Spiritualité': PERSONALITY_QUESTIONS.filter(q => q.axis === 'Spiritualité').length,
    'Personnalité': PERSONALITY_QUESTIONS.filter(q => q.axis === 'Personnalité').length,
    'Communication': PERSONALITY_QUESTIONS.filter(q => q.axis === 'Communication').length,
    'Famille': PERSONALITY_QUESTIONS.filter(q => q.axis === 'Famille').length,
    'Style de vie': PERSONALITY_QUESTIONS.filter(q => q.axis === 'Style de vie').length,
    'Ambitions': PERSONALITY_QUESTIONS.filter(q => q.axis === 'Ambitions').length
  },
  dealbreakers: PERSONALITY_QUESTIONS.filter(q => q.is_dealbreaker).length,
  categories: {
    scale: PERSONALITY_QUESTIONS.filter(q => q.category === 'scale').length,
    bool: PERSONALITY_QUESTIONS.filter(q => q.category === 'bool').length
  },
  averageWeight: PERSONALITY_QUESTIONS.reduce((sum, q) => sum + q.weight, 0) / PERSONALITY_QUESTIONS.length
}

console.log('📊 Statistiques des questions:', QUESTIONS_STATS)