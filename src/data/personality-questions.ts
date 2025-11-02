// 100 Questions de Personnalité pour la Compatibilité Matrimoniale Islamique
// Organisées par dimensions psychologiques et valeurs islamiques

export const PERSONALITY_QUESTIONS = [
  // DIMENSION 1: PRATIQUE RELIGIEUSE ET SPIRITUALITÉ (Questions 1-15)
  {
    id: 1,
    axis: 'Spiritualité',
    text: 'Je prie les 5 prières quotidiennes régulièrement.',
    category: 'scale' as const,
    weight: 1.5,
    is_dealbreaker: true,
    order_index: 1,
    hint: 'Cette question évalue votre assiduité dans l\'accomplissement des prières obligatoires, pilier fondamental de l\'Islam.'
  },
  {
    id: 2,
    axis: 'Spiritualité',
    text: 'Je lis le Coran au moins une fois par semaine.',
    category: 'scale' as const,
    weight: 1.2,
    is_dealbreaker: false,
    order_index: 2,
    hint: 'Il s\'agit de mesurer votre engagement dans la lecture et la méditation du Coran, au-delà des prières.'
  },
  {
    id: 3,
    axis: 'Spiritualité',
    text: 'Je considère que la spiritualité guide mes décisions importantes.',
    category: 'scale' as const,
    weight: 1.3,
    is_dealbreaker: true,
    order_index: 3,
    hint: 'Cette question évalue à quel point vous intégrez les principes islamiques dans vos choix de vie majeurs.'
  },
  {
    id: 4,
    axis: 'Spiritualité',
    text: 'Je souhaite accomplir le Hajj avec mon conjoint.',
    category: 'bool' as const,
    weight: 1.0,
    is_dealbreaker: false,
    order_index: 4,
    hint: 'Le pèlerinage à La Mecque est un objectif spirituel important. Cette question mesure si c\'est un projet que vous souhaitez partager en couple.'
  },
  {
    id: 5,
    axis: 'Spiritualité',
    text: 'Je préfère fréquenter des personnes pratiquantes.',
    category: 'scale' as const,
    weight: 1.1,
    is_dealbreaker: false,
    order_index: 5,
    hint: 'Cette question concerne l\'importance que vous accordez à votre entourage social et son influence sur votre pratique religieuse.'
  },
  {
    id: 6,
    axis: 'Spiritualité',
    text: 'Je jeûne volontairement en dehors du Ramadan.',
    category: 'scale' as const,
    weight: 0.8,
    is_dealbreaker: false,
    order_index: 6
  },
  {
    id: 7,
    axis: 'Spiritualité',
    text: 'Je participe activement à la vie de ma mosquée.',
    category: 'scale' as const,
    weight: 0.9,
    is_dealbreaker: false,
    order_index: 7
  },
  {
    id: 8,
    axis: 'Spiritualité',
    text: 'Je souhaite éduquer mes enfants dans la tradition islamique.',
    category: 'scale' as const,
    weight: 1.4,
    is_dealbreaker: true,
    order_index: 8
  },
  {
    id: 9,
    axis: 'Spiritualité',
    text: 'Je pratique régulièrement des invocations (dhikr).',
    category: 'scale' as const,
    weight: 0.8,
    is_dealbreaker: false,
    order_index: 9
  },
  {
    id: 10,
    axis: 'Spiritualité',
    text: 'Je respecte strictement les règles alimentaires halal.',
    category: 'scale' as const,
    weight: 1.3,
    is_dealbreaker: true,
    order_index: 10
  },
  {
    id: 11,
    axis: 'Spiritualité',
    text: 'Je souhaite me marier selon les traditions islamiques.',
    category: 'bool' as const,
    weight: 1.5,
    is_dealbreaker: true,
    order_index: 11
  },
  {
    id: 12,
    axis: 'Spiritualité',
    text: 'Je considère le mariage comme un acte d\'adoration.',
    category: 'scale' as const,
    weight: 1.2,
    is_dealbreaker: false,
    order_index: 12
  },
  {
    id: 13,
    axis: 'Spiritualité',
    text: 'Je refuse catégoriquement l\'alcool dans ma vie.',
    category: 'bool' as const,
    weight: 1.4,
    is_dealbreaker: true,
    order_index: 13
  },
  {
    id: 14,
    axis: 'Spiritualité',
    text: 'Je préfère éviter les environnements avec musique.',
    category: 'scale' as const,
    weight: 0.7,
    is_dealbreaker: false,
    order_index: 14
  },
  {
    id: 15,
    axis: 'Spiritualité',
    text: 'Je souhaite faire la prière en couple avec mon conjoint.',
    category: 'scale' as const,
    weight: 1.0,
    is_dealbreaker: false,
    order_index: 15
  },

  // DIMENSION 2: PERSONNALITÉ ET TEMPÉRAMENT (Questions 16-35)
  {
    id: 16,
    axis: 'Personnalité',
    text: 'Je me considère comme une personne très patiente.',
    category: 'scale' as const,
    weight: 1.2,
    is_dealbreaker: false,
    order_index: 16
  },
  {
    id: 17,
    axis: 'Personnalité',
    text: 'Je suis naturellement optimiste face aux difficultés.',
    category: 'scale' as const,
    weight: 1.1,
    is_dealbreaker: false,
    order_index: 17
  },
  {
    id: 18,
    axis: 'Personnalité',
    text: 'Je préfère réfléchir longuement avant de prendre une décision.',
    category: 'scale' as const,
    weight: 1.0,
    is_dealbreaker: false,
    order_index: 18
  },
  {
    id: 19,
    axis: 'Personnalité',
    text: 'Je me mets souvent en colère pour des petites choses.',
    category: 'scale' as const,
    weight: 1.3,
    is_dealbreaker: false,
    order_index: 19
  },
  {
    id: 20,
    axis: 'Personnalité',
    text: 'Je suis une personne très sociable et extravertie.',
    category: 'scale' as const,
    weight: 0.9,
    is_dealbreaker: false,
    order_index: 20
  },
  {
    id: 21,
    axis: 'Personnalité',
    text: 'J\'ai tendance à être perfectionniste dans mes tâches.',
    category: 'scale' as const,
    weight: 0.8,
    is_dealbreaker: false,
    order_index: 21
  },
  {
    id: 22,
    axis: 'Personnalité',
    text: 'Je pardonne facilement les erreurs des autres.',
    category: 'scale' as const,
    weight: 1.2,
    is_dealbreaker: false,
    order_index: 22
  },
  {
    id: 23,
    axis: 'Personnalité',
    text: 'Je suis une personne très organisée dans ma vie quotidienne.',
    category: 'scale' as const,
    weight: 1.0,
    is_dealbreaker: false,
    order_index: 23
  },
  {
    id: 24,
    axis: 'Personnalité',
    text: 'J\'aime prendre des initiatives et diriger.',
    category: 'scale' as const,
    weight: 0.9,
    is_dealbreaker: false,
    order_index: 24
  },
  {
    id: 25,
    axis: 'Personnalité',
    text: 'Je préfère la routine à l\'imprévu.',
    category: 'scale' as const,
    weight: 0.8,
    is_dealbreaker: false,
    order_index: 25
  },
  {
    id: 26,
    axis: 'Personnalité',
    text: 'Je suis très sensible aux critiques.',
    category: 'scale' as const,
    weight: 0.9,
    is_dealbreaker: false,
    order_index: 26
  },
  {
    id: 27,
    axis: 'Personnalité',
    text: 'J\'exprime facilement mes émotions.',
    category: 'scale' as const,
    weight: 1.0,
    is_dealbreaker: false,
    order_index: 27
  },
  {
    id: 28,
    axis: 'Personnalité',
    text: 'Je suis une personne très empathique.',
    category: 'scale' as const,
    weight: 1.1,
    is_dealbreaker: false,
    order_index: 28
  },
  {
    id: 29,
    axis: 'Personnalité',
    text: 'Je préfère éviter les conflits à tout prix.',
    category: 'scale' as const,
    weight: 0.8,
    is_dealbreaker: false,
    order_index: 29
  },
  {
    id: 30,
    axis: 'Personnalité',
    text: 'Je suis quelqu\'un de très déterminé dans mes objectifs.',
    category: 'scale' as const,
    weight: 1.0,
    is_dealbreaker: false,
    order_index: 30
  },
  {
    id: 31,
    axis: 'Personnalité',
    text: 'J\'ai besoin de beaucoup de temps seul pour me ressourcer.',
    category: 'scale' as const,
    weight: 0.8,
    is_dealbreaker: false,
    order_index: 31
  },
  {
    id: 32,
    axis: 'Personnalité',
    text: 'Je suis spontané et j\'aime les surprises.',
    category: 'scale' as const,
    weight: 0.7,
    is_dealbreaker: false,
    order_index: 32
  },
  {
    id: 33,
    axis: 'Personnalité',
    text: 'Je me préoccupe beaucoup du regard des autres.',
    category: 'scale' as const,
    weight: 0.7,
    is_dealbreaker: false,
    order_index: 33
  },
  {
    id: 34,
    axis: 'Personnalité',
    text: 'Je suis très attaché aux traditions familiales.',
    category: 'scale' as const,
    weight: 1.1,
    is_dealbreaker: false,
    order_index: 34
  },
  {
    id: 35,
    axis: 'Personnalité',
    text: 'J\'adapte facilement mon comportement selon les situations.',
    category: 'scale' as const,
    weight: 0.9,
    is_dealbreaker: false,
    order_index: 35
  },

  // DIMENSION 3: COMMUNICATION ET RELATIONS (Questions 36-50)
  {
    id: 36,
    axis: 'Communication',
    text: 'Je préfère parler directement plutôt que de faire des sous-entendus.',
    category: 'scale' as const,
    weight: 1.2,
    is_dealbreaker: false,
    order_index: 36
  },
  {
    id: 37,
    axis: 'Communication',
    text: 'J\'écoute attentivement avant de donner mon avis.',
    category: 'scale' as const,
    weight: 1.3,
    is_dealbreaker: false,
    order_index: 37
  },
  {
    id: 38,
    axis: 'Communication',
    text: 'Je me dispute souvent avec mes proches.',
    category: 'scale' as const,
    weight: 1.1,
    is_dealbreaker: false,
    order_index: 38
  },
  {
    id: 39,
    axis: 'Communication',
    text: 'Je préfère écrire mes sentiments plutôt que les dire.',
    category: 'scale' as const,
    weight: 0.8,
    is_dealbreaker: false,
    order_index: 39
  },
  {
    id: 40,
    axis: 'Communication',
    text: 'Je suis à l\'aise pour exprimer mes besoins.',
    category: 'scale' as const,
    weight: 1.2,
    is_dealbreaker: false,
    order_index: 40
  },
  {
    id: 41,
    axis: 'Communication',
    text: 'Je préfère résoudre les problèmes immédiatement.',
    category: 'scale' as const,
    weight: 1.0,
    is_dealbreaker: false,
    order_index: 41
  },
  {
    id: 42,
    axis: 'Communication',
    text: 'J\'utilise souvent l\'humour pour détendre l\'atmosphère.',
    category: 'scale' as const,
    weight: 0.9,
    is_dealbreaker: false,
    order_index: 42
  },
  {
    id: 43,
    axis: 'Communication',
    text: 'Je garde mes problèmes pour moi.',
    category: 'scale' as const,
    weight: 0.9,
    is_dealbreaker: false,
    order_index: 43
  },
  {
    id: 44,
    axis: 'Communication',
    text: 'Je critique constructivement pour aider.',
    category: 'scale' as const,
    weight: 1.0,
    is_dealbreaker: false,
    order_index: 44
  },
  {
    id: 45,
    axis: 'Communication',
    text: 'Je préfère éviter les sujets sensibles.',
    category: 'scale' as const,
    weight: 0.8,
    is_dealbreaker: false,
    order_index: 45
  },
  {
    id: 46,
    axis: 'Communication',
    text: 'Je remarque facilement les émotions des autres.',
    category: 'scale' as const,
    weight: 1.1,
    is_dealbreaker: false,
    order_index: 46
  },
  {
    id: 47,
    axis: 'Communication',
    text: 'J\'ai besoin de beaucoup d\'affection verbale.',
    category: 'scale' as const,
    weight: 0.9,
    is_dealbreaker: false,
    order_index: 47
  },
  {
    id: 48,
    axis: 'Communication',
    text: 'Je communique mieux en tête-à-tête qu\'en groupe.',
    category: 'scale' as const,
    weight: 0.8,
    is_dealbreaker: false,
    order_index: 48
  },
  {
    id: 49,
    axis: 'Communication',
    text: 'Je n\'hésite pas à demander de l\'aide quand j\'en ai besoin.',
    category: 'scale' as const,
    weight: 1.0,
    is_dealbreaker: false,
    order_index: 49
  },
  {
    id: 50,
    axis: 'Communication',
    text: 'Je préfère qu\'on me pose des questions directes.',
    category: 'scale' as const,
    weight: 0.9,
    is_dealbreaker: false,
    order_index: 50
  },

  // DIMENSION 4: FAMILLE ET RELATIONS (Questions 51-65)
  {
    id: 51,
    axis: 'Famille',
    text: 'Je souhaite avoir des enfants dans les 2 prochaines années.',
    category: 'bool' as const,
    weight: 1.5,
    is_dealbreaker: true,
    order_index: 51
  },
  {
    id: 52,
    axis: 'Famille',
    text: 'Je veux avoir plus de 3 enfants.',
    category: 'bool' as const,
    weight: 1.3,
    is_dealbreaker: true,
    order_index: 52
  },
  {
    id: 53,
    axis: 'Famille',
    text: 'Je préfère vivre près de ma famille élargie.',
    category: 'scale' as const,
    weight: 1.1,
    is_dealbreaker: false,
    order_index: 53
  },
  {
    id: 54,
    axis: 'Famille',
    text: 'Ma famille d\'origine influence beaucoup mes décisions.',
    category: 'scale' as const,
    weight: 1.0,
    is_dealbreaker: false,
    order_index: 54
  },
  {
    id: 55,
    axis: 'Famille',
    text: 'Je souhaite que ma belle-famille soit très impliquée.',
    category: 'scale' as const,
    weight: 1.0,
    is_dealbreaker: false,
    order_index: 55
  },
  {
    id: 56,
    axis: 'Famille',
    text: 'Je préfère élever mes enfants de manière stricte.',
    category: 'scale' as const,
    weight: 1.2,
    is_dealbreaker: false,
    order_index: 56
  },
  {
    id: 57,
    axis: 'Famille',
    text: 'L\'éducation religieuse de mes enfants est prioritaire.',
    category: 'scale' as const,
    weight: 1.4,
    is_dealbreaker: true,
    order_index: 57
  },
  {
    id: 58,
    axis: 'Famille',
    text: 'Je compte envoyer mes enfants à l\'école islamique.',
    category: 'scale' as const,
    weight: 1.1,
    is_dealbreaker: false,
    order_index: 58
  },
  {
    id: 59,
    axis: 'Famille',
    text: 'Je veux que mes enfants parlent parfaitement arabe.',
    category: 'scale' as const,
    weight: 0.9,
    is_dealbreaker: false,
    order_index: 59
  },
  {
    id: 60,
    axis: 'Famille',
    text: 'Je préfère avoir des enfants du même sexe.',
    category: 'scale' as const,
    weight: 0.6,
    is_dealbreaker: false,
    order_index: 60
  },
  {
    id: 61,
    axis: 'Famille',
    text: 'Ma famille doit approuver mon choix de conjoint.',
    category: 'scale' as const,
    weight: 1.2,
    is_dealbreaker: false,
    order_index: 61
  },
  {
    id: 62,
    axis: 'Famille',
    text: 'Je souhaite adopter des enfants si nécessaire.',
    category: 'scale' as const,
    weight: 0.8,
    is_dealbreaker: false,
    order_index: 62
  },
  {
    id: 63,
    axis: 'Famille',
    text: 'Je veux transmettre ma culture d\'origine à mes enfants.',
    category: 'scale' as const,
    weight: 1.0,
    is_dealbreaker: false,
    order_index: 63
  },
  {
    id: 64,
    axis: 'Famille',
    text: 'Je préfère que mon conjoint ait le même background culturel.',
    category: 'scale' as const,
    weight: 0.9,
    is_dealbreaker: false,
    order_index: 64
  },
  {
    id: 65,
    axis: 'Famille',
    text: 'Les réunions familiales fréquentes sont importantes pour moi.',
    category: 'scale' as const,
    weight: 0.8,
    is_dealbreaker: false,
    order_index: 65
  },

  // DIMENSION 5: STYLE DE VIE ET VALEURS (Questions 66-80)
  {
    id: 66,
    axis: 'Style de vie',
    text: 'Je préfère vivre dans un quartier à majorité musulmane.',
    category: 'scale' as const,
    weight: 1.0,
    is_dealbreaker: false,
    order_index: 66
  },
  {
    id: 67,
    axis: 'Style de vie',
    text: 'Je suis très soucieux de mon apparence physique.',
    category: 'scale' as const,
    weight: 0.7,
    is_dealbreaker: false,
    order_index: 67
  },
  {
    id: 68,
    axis: 'Style de vie',
    text: 'Je préfère sortir principalement le weekend.',
    category: 'scale' as const,
    weight: 0.6,
    is_dealbreaker: false,
    order_index: 68
  },
  {
    id: 69,
    axis: 'Style de vie',
    text: 'Je suis très attaché aux voyages et découvertes.',
    category: 'scale' as const,
    weight: 0.8,
    is_dealbreaker: false,
    order_index: 69
  },
  {
    id: 70,
    axis: 'Style de vie',
    text: 'Je préfère une vie simple et sans superflu.',
    category: 'scale' as const,
    weight: 1.1,
    is_dealbreaker: false,
    order_index: 70
  },
  {
    id: 71,
    axis: 'Style de vie',
    text: 'J\'aime recevoir des invités à la maison.',
    category: 'scale' as const,
    weight: 0.8,
    is_dealbreaker: false,
    order_index: 71
  },
  {
    id: 72,
    axis: 'Style de vie',
    text: 'Je fais du sport régulièrement.',
    category: 'scale' as const,
    weight: 0.7,
    is_dealbreaker: false,
    order_index: 72
  },
  {
    id: 73,
    axis: 'Style de vie',
    text: 'Je préfère cuisiner à la maison plutôt qu\'au restaurant.',
    category: 'scale' as const,
    weight: 0.8,
    is_dealbreaker: false,
    order_index: 73
  },
  {
    id: 74,
    axis: 'Style de vie',
    text: 'Les réseaux sociaux occupent une place importante dans ma vie.',
    category: 'scale' as const,
    weight: 0.6,
    is_dealbreaker: false,
    order_index: 74
  },
  {
    id: 75,
    axis: 'Style de vie',
    text: 'Je préfère les activités calmes aux sorties animées.',
    category: 'scale' as const,
    weight: 0.7,
    is_dealbreaker: false,
    order_index: 75
  },
  {
    id: 76,
    axis: 'Style de vie',
    text: 'J\'accorde beaucoup d\'importance à mon développement personnel.',
    category: 'scale' as const,
    weight: 0.9,
    is_dealbreaker: false,
    order_index: 76
  },
  {
    id: 77,
    axis: 'Style de vie',
    text: 'Je préfère avoir un cercle social restreint mais proche.',
    category: 'scale' as const,
    weight: 0.8,
    is_dealbreaker: false,
    order_index: 77
  },
  {
    id: 78,
    axis: 'Style de vie',
    text: 'L\'écologie et l\'environnement me préoccupent beaucoup.',
    category: 'scale' as const,
    weight: 0.7,
    is_dealbreaker: false,
    order_index: 78
  },
  {
    id: 79,
    axis: 'Style de vie',
    text: 'Je préfère les marques et produits éthiques.',
    category: 'scale' as const,
    weight: 0.8,
    is_dealbreaker: false,
    order_index: 79
  },
  {
    id: 80,
    axis: 'Style de vie',
    text: 'Je suis très ponctuel dans tous mes rendez-vous.',
    category: 'scale' as const,
    weight: 0.9,
    is_dealbreaker: false,
    order_index: 80
  },

  // DIMENSION 6: AMBITIONS ET PROJETS (Questions 81-100)
  {
    id: 81,
    axis: 'Ambitions',
    text: 'Ma carrière professionnelle est très importante pour moi.',
    category: 'scale' as const,
    weight: 1.1,
    is_dealbreaker: false,
    order_index: 81
  },
  {
    id: 82,
    axis: 'Ambitions',
    text: 'Je souhaite devenir financièrement indépendant rapidement.',
    category: 'scale' as const,
    weight: 1.0,
    is_dealbreaker: false,
    order_index: 82
  },
  {
    id: 83,
    axis: 'Ambitions',
    text: 'J\'accepterais de déménager pour ma carrière.',
    category: 'scale' as const,
    weight: 0.9,
    is_dealbreaker: false,
    order_index: 83
  },
  {
    id: 84,
    axis: 'Ambitions',
    text: 'Je veux créer ma propre entreprise.',
    category: 'scale' as const,
    weight: 0.8,
    is_dealbreaker: false,
    order_index: 84
  },
  {
    id: 85,
    axis: 'Ambitions',
    text: 'L\'argent n\'est pas ma motivation principale.',
    category: 'scale' as const,
    weight: 1.0,
    is_dealbreaker: false,
    order_index: 85
  },
  {
    id: 86,
    axis: 'Ambitions',
    text: 'Je souhaite poursuivre des études supérieures.',
    category: 'scale' as const,
    weight: 0.8,
    is_dealbreaker: false,
    order_index: 86
  },
  {
    id: 87,
    axis: 'Ambitions',
    text: 'Je veux contribuer à des œuvres caritatives.',
    category: 'scale' as const,
    weight: 1.2,
    is_dealbreaker: false,
    order_index: 87
  },
  {
    id: 88,
    axis: 'Ambitions',
    text: 'Posséder une belle maison est important pour moi.',
    category: 'scale' as const,
    weight: 0.7,
    is_dealbreaker: false,
    order_index: 88
  },
  {
    id: 89,
    axis: 'Ambitions',
    text: 'Je préfère la stabilité à l\'aventure professionnelle.',
    category: 'scale' as const,
    weight: 0.9,
    is_dealbreaker: false,
    order_index: 89
  },
  {
    id: 90,
    axis: 'Ambitions',
    text: 'Je veux faire au moins un pèlerinage par an.',
    category: 'scale' as const,
    weight: 0.9,
    is_dealbreaker: false,
    order_index: 90
  },
  {
    id: 91,
    axis: 'Ambitions',
    text: 'Apprendre plusieurs langues m\'intéresse beaucoup.',
    category: 'scale' as const,
    weight: 0.6,
    is_dealbreaker: false,
    order_index: 91
  },
  {
    id: 92,
    axis: 'Ambitions',
    text: 'Je veux devenir un pilier de ma communauté.',
    category: 'scale' as const,
    weight: 1.0,
    is_dealbreaker: false,
    order_index: 92
  },
  {
    id: 93,
    axis: 'Ambitions',
    text: 'L\'équilibre vie privée/professionnelle est essentiel.',
    category: 'scale' as const,
    weight: 1.1,
    is_dealbreaker: false,
    order_index: 93
  },
  {
    id: 94,
    axis: 'Ambitions',
    text: 'Je veux laisser un héritage spirituel à mes enfants.',
    category: 'scale' as const,
    weight: 1.3,
    is_dealbreaker: false,
    order_index: 94
  },
  {
    id: 95,
    axis: 'Ambitions',
    text: 'Voyager dans les pays musulmans m\'intéresse.',
    category: 'scale' as const,
    weight: 0.8,
    is_dealbreaker: false,
    order_index: 95
  },
  {
    id: 96,
    axis: 'Ambitions',
    text: 'Je veux maîtriser parfaitement l\'arabe coranique.',
    category: 'scale' as const,
    weight: 1.0,
    is_dealbreaker: false,
    order_index: 96
  },
  {
    id: 97,
    axis: 'Ambitions',
    text: 'Participer à des projets communautaires me motive.',
    category: 'scale' as const,
    weight: 1.0,
    is_dealbreaker: false,
    order_index: 97
  },
  {
    id: 98,
    axis: 'Ambitions',
    text: 'Je souhaite enseigner l\'Islam à d\'autres personnes.',
    category: 'scale' as const,
    weight: 0.9,
    is_dealbreaker: false,
    order_index: 98
  },
  {
    id: 99,
    axis: 'Ambitions',
    text: 'Avoir une retraite confortable est important.',
    category: 'scale' as const,
    weight: 0.8,
    is_dealbreaker: false,
    order_index: 99
  },
  {
    id: 100,
    axis: 'Ambitions',
    text: 'Je veux que notre couple soit un modèle pour autres.',
    category: 'scale' as const,
    weight: 1.1,
    is_dealbreaker: false,
    order_index: 100
  }
]