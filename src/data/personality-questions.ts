// 100 Questions de Personnalité pour la Compatibilité Matrimoniale Islamique
// Organisées par dimensions psychologiques et valeurs islamiques

export const PERSONALITY_QUESTIONS = [
  // DIMENSION 1: PRATIQUE RELIGIEUSE ET SPIRITUALITÉ (Questions 1-14)
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
    text: 'Je jeûne volontairement en dehors du Ramadan.',
    category: 'scale' as const,
    weight: 0.8,
    is_dealbreaker: false,
    order_index: 5,
    hint: 'Le jeûne surérogatoire (comme les lundis/jeudis) montre un engagement spirituel au-delà des obligations. Cette question évalue votre pratique personnelle.'
  },
  {
    id: 6,
    axis: 'Spiritualité',
    text: 'Je participe activement à la vie de ma mosquée.',
    category: 'scale' as const,
    weight: 0.9,
    is_dealbreaker: false,
    order_index: 6,
    hint: 'L\'engagement communautaire à la mosquée (cours, événements, bénévolat) reflète votre implication dans la vie religieuse collective.'
  },
  {
    id: 7,
    axis: 'Spiritualité',
    text: 'Je souhaite éduquer mes enfants dans la tradition islamique.',
    category: 'scale' as const,
    weight: 1.4,
    is_dealbreaker: true,
    order_index: 7,
    hint: 'Cette question fondamentale concerne la transmission de la foi à vos futurs enfants : éducation religieuse, valeurs, et pratiques islamiques.'
  },
  {
    id: 8,
    axis: 'Spiritualité',
    text: 'Je pratique régulièrement des invocations (dhikr).',
    category: 'scale' as const,
    weight: 0.8,
    is_dealbreaker: false,
    order_index: 8,
    hint: 'Le dhikr (rappel d\'Allah) à travers les invocations quotidiennes est une pratique spirituelle personnelle qui nourrit la foi au quotidien.'
  },
  {
    id: 9,
    axis: 'Spiritualité',
    text: 'Je respecte strictement les règles alimentaires halal.',
    category: 'scale' as const,
    weight: 1.3,
    is_dealbreaker: true,
    order_index: 9,
    hint: 'Le respect du halal dans l\'alimentation est un pilier du mode de vie islamique. Cette question évalue votre stricte observance ou votre flexibilité.'
  },
  {
    id: 10,
    axis: 'Spiritualité',
    text: 'Je souhaite me marier selon les traditions islamiques.',
    category: 'bool' as const,
    weight: 1.5,
    is_dealbreaker: true,
    order_index: 10,
    hint: 'Il s\'agit de savoir si vous souhaitez un mariage religieux conforme aux préceptes islamiques (walima, dot, témoins, etc.).'
  },
  {
    id: 11,
    axis: 'Spiritualité',
    text: 'Je considère le mariage comme un acte d\'adoration.',
    category: 'scale' as const,
    weight: 1.2,
    is_dealbreaker: false,
    order_index: 11,
    hint: 'Dans l\'Islam, le mariage est considéré comme un acte de foi et d\'adoration. Cette question mesure votre vision spirituelle du mariage.'
  },
  {
    id: 12,
    axis: 'Spiritualité',
    text: 'Je refuse catégoriquement l\'alcool dans ma vie.',
    category: 'bool' as const,
    weight: 1.4,
    is_dealbreaker: true,
    order_index: 12,
    hint: 'Question sur votre positionnement ferme concernant l\'interdiction de l\'alcool dans votre foyer et votre vie.'
  },
  {
    id: 13,
    axis: 'Spiritualité',
    text: 'Je préfère éviter les environnements avec musique.',
    category: 'scale' as const,
    weight: 0.7,
    is_dealbreaker: false,
    order_index: 13,
    hint: 'Certains pratiquants évitent la musique pour des raisons religieuses. Cette question évalue votre position personnelle sur ce sujet.'
  },
  {
    id: 14,
    axis: 'Spiritualité',
    text: 'Je souhaite faire la prière en couple avec mon conjoint.',
    category: 'scale' as const,
    weight: 1.0,
    is_dealbreaker: false,
    order_index: 14,
    hint: 'Certains couples aiment partager des moments spirituels comme la prière en commun. Cette question évalue si c\'est important pour vous.'
  },

  // DIMENSION 2: PERSONNALITÉ ET TEMPÉRAMENT (Questions 15-33)
  {
    id: 15,
    axis: 'Personnalité',
    text: 'Je me considère comme une personne très patiente.',
    category: 'scale' as const,
    weight: 1.2,
    is_dealbreaker: false,
    order_index: 15,
    hint: 'La patience est une qualité essentielle dans le mariage. Répondez honnêtement sur votre capacité à rester calme dans les situations difficiles.'
  },
  {
    id: 16,
    axis: 'Personnalité',
    text: 'Je suis naturellement optimiste face aux difficultés.',
    category: 'scale' as const,
    weight: 1.1,
    is_dealbreaker: false,
    order_index: 16,
    hint: 'L\'optimisme aide à surmonter les épreuves du couple. Cette question évalue votre capacité à voir le positif même dans les moments difficiles.'
  },
  {
    id: 17,
    axis: 'Personnalité',
    text: 'Je préfère réfléchir longuement avant de prendre une décision.',
    category: 'scale' as const,
    weight: 1.0,
    is_dealbreaker: false,
    order_index: 17,
    hint: 'Il s\'agit de votre style décisionnel : réfléchi et prudent vs spontané et rapide. Aucun n\'est meilleur, c\'est une question de compatibilité.'
  },
  {
    id: 18,
    axis: 'Personnalité',
    text: 'Je me mets souvent en colère pour des petites choses.',
    category: 'scale' as const,
    weight: 1.3,
    is_dealbreaker: false,
    order_index: 18,
    hint: 'Cette question évalue votre gestion de la colère et des frustrations quotidiennes. Soyez sincère pour une meilleure compatibilité.'
  },
  {
    id: 19,
    axis: 'Personnalité',
    text: 'Je suis une personne très sociable et extravertie.',
    category: 'scale' as const,
    weight: 0.9,
    is_dealbreaker: false,
    order_index: 19,
    hint: 'Introversion vs extraversion : cette question concerne votre besoin de socialisation et votre énergie dans les interactions sociales.'
  },
  {
    id: 20,
    axis: 'Personnalité',
    text: 'J\'ai tendance à être perfectionniste dans mes tâches.',
    category: 'scale' as const,
    weight: 0.8,
    is_dealbreaker: false,
    order_index: 20
  },
  {
    id: 21,
    axis: 'Personnalité',
    text: 'Je pardonne facilement les erreurs des autres.',
    category: 'scale' as const,
    weight: 1.2,
    is_dealbreaker: false,
    order_index: 21,
    hint: 'La capacité à pardonner est essentielle en couple. Cette question évalue votre tendance à garder rancune ou à passer l\'éponge rapidement après un conflit.'
  },
  {
    id: 22,
    axis: 'Personnalité',
    text: 'Je suis une personne très organisée dans ma vie quotidienne.',
    category: 'scale' as const,
    weight: 1.0,
    is_dealbreaker: false,
    order_index: 22,
    hint: 'L\'organisation quotidienne (rangement, planning, gestion du temps) peut être source de conflits si l\'un est très structuré et l\'autre spontané.'
  },
  {
    id: 23,
    axis: 'Personnalité',
    text: 'J\'aime prendre des initiatives et diriger.',
    category: 'scale' as const,
    weight: 0.9,
    is_dealbreaker: false,
    order_index: 23
  },
  {
    id: 24,
    axis: 'Personnalité',
    text: 'Je préfère la routine à l\'imprévu.',
    category: 'scale' as const,
    weight: 0.8,
    is_dealbreaker: false,
    order_index: 24
  },
  {
    id: 25,
    axis: 'Personnalité',
    text: 'Je suis très sensible aux critiques.',
    category: 'scale' as const,
    weight: 0.9,
    is_dealbreaker: false,
    order_index: 25
  },
  {
    id: 26,
    axis: 'Personnalité',
    text: 'J\'exprime facilement mes émotions.',
    category: 'scale' as const,
    weight: 1.0,
    is_dealbreaker: false,
    order_index: 26,
    hint: 'L\'expression émotionnelle varie selon les personnes. Certains sont très expressifs, d\'autres plus réservés. Aucun n\'est mauvais, c\'est une question de compatibilité.'
  },
  {
    id: 27,
    axis: 'Personnalité',
    text: 'Je suis une personne très empathique.',
    category: 'scale' as const,
    weight: 1.1,
    is_dealbreaker: false,
    order_index: 27,
    hint: 'L\'empathie (capacité à ressentir les émotions de l\'autre) est fondamentale en couple. Elle favorise le soutien émotionnel et la compréhension mutuelle.'
  },
  {
    id: 28,
    axis: 'Personnalité',
    text: 'Je suis quelqu\'un de très déterminé dans mes objectifs.',
    category: 'scale' as const,
    weight: 1.0,
    is_dealbreaker: false,
    order_index: 28,
    hint: 'La détermination reflète votre capacité à poursuivre vos objectifs malgré les obstacles. Un atout en couple, surtout pour construire un projet de vie commun.'
  },
  {
    id: 29,
    axis: 'Personnalité',
    text: 'J\'ai besoin de beaucoup de temps seul pour me ressourcer.',
    category: 'scale' as const,
    weight: 0.8,
    is_dealbreaker: false,
    order_index: 29
  },
  {
    id: 30,
    axis: 'Personnalité',
    text: 'Je suis spontané et j\'aime les surprises.',
    category: 'scale' as const,
    weight: 0.7,
    is_dealbreaker: false,
    order_index: 30
  },
  {
    id: 31,
    axis: 'Personnalité',
    text: 'Je me préoccupe beaucoup du regard des autres.',
    category: 'scale' as const,
    weight: 0.7,
    is_dealbreaker: false,
    order_index: 31
  },
  {
    id: 32,
    axis: 'Personnalité',
    text: 'Je suis très attaché aux traditions familiales.',
    category: 'scale' as const,
    weight: 1.1,
    is_dealbreaker: false,
    order_index: 32,
    hint: 'Les traditions familiales (fêtes, rituels, coutumes) créent des liens mais peuvent aussi créer des conflits si les deux familles ont des pratiques différentes.'
  },
  {
    id: 33,
    axis: 'Personnalité',
    text: 'J\'adapte facilement mon comportement selon les situations.',
    category: 'scale' as const,
    weight: 0.9,
    is_dealbreaker: false,
    order_index: 33
  },

  // DIMENSION 3: COMMUNICATION ET RELATIONS (Questions 34-48)
  {
    id: 34,
    axis: 'Communication',
    text: 'Je préfère parler directement plutôt que de faire des sous-entendus.',
    category: 'scale' as const,
    weight: 1.2,
    is_dealbreaker: false,
    order_index: 34
  },
  {
    id: 35,
    axis: 'Communication',
    text: 'J\'écoute attentivement avant de donner mon avis.',
    category: 'scale' as const,
    weight: 1.3,
    is_dealbreaker: false,
    order_index: 35
  },
  {
    id: 36,
    axis: 'Communication',
    text: 'Je me dispute souvent avec mes proches.',
    category: 'scale' as const,
    weight: 1.1,
    is_dealbreaker: false,
    order_index: 36,
    hint: 'Une tendance aux disputes fréquentes peut indiquer une difficulté à gérer les désaccords calmement. Important à prendre en compte pour la dynamique de couple.'
  },
  {
    id: 37,
    axis: 'Communication',
    text: 'Je préfère écrire mes sentiments plutôt que les dire.',
    category: 'scale' as const,
    weight: 0.8,
    is_dealbreaker: false,
    order_index: 37
  },
  {
    id: 38,
    axis: 'Communication',
    text: 'Je suis à l\'aise pour exprimer mes besoins.',
    category: 'scale' as const,
    weight: 1.2,
    is_dealbreaker: false,
    order_index: 38,
    hint: 'Une communication claire de vos besoins est cruciale pour un couple sain. Cette question mesure votre capacité à exprimer ce qui est important pour vous sans attendre que l\'autre devine.'
  },
  {
    id: 39,
    axis: 'Communication',
    text: 'Je préfère résoudre les problèmes immédiatement.',
    category: 'scale' as const,
    weight: 1.0,
    is_dealbreaker: false,
    order_index: 39
  },
  {
    id: 40,
    axis: 'Communication',
    text: 'J\'utilise souvent l\'humour pour détendre l\'atmosphère.',
    category: 'scale' as const,
    weight: 0.9,
    is_dealbreaker: false,
    order_index: 40
  },
  {
    id: 41,
    axis: 'Communication',
    text: 'Je garde mes problèmes pour moi.',
    category: 'scale' as const,
    weight: 0.9,
    is_dealbreaker: false,
    order_index: 41
  },
  {
    id: 42,
    axis: 'Communication',
    text: 'Je critique constructivement pour aider.',
    category: 'scale' as const,
    weight: 1.0,
    is_dealbreaker: false,
    order_index: 42
  },
  {
    id: 43,
    axis: 'Communication',
    text: 'Je préfère éviter les sujets sensibles.',
    category: 'scale' as const,
    weight: 0.8,
    is_dealbreaker: false,
    order_index: 43
  },
  {
    id: 44,
    axis: 'Communication',
    text: 'Je remarque facilement les émotions des autres.',
    category: 'scale' as const,
    weight: 1.1,
    is_dealbreaker: false,
    order_index: 44,
    hint: 'L\'intelligence émotionnelle (détecter les émotions non-dites) aide à anticiper les besoins de votre partenaire et éviter les malentendus.'
  },
  {
    id: 45,
    axis: 'Communication',
    text: 'J\'ai besoin de beaucoup d\'affection verbale.',
    category: 'scale' as const,
    weight: 0.9,
    is_dealbreaker: false,
    order_index: 45
  },
  {
    id: 46,
    axis: 'Communication',
    text: 'Je communique mieux en tête-à-tête qu\'en groupe.',
    category: 'scale' as const,
    weight: 0.8,
    is_dealbreaker: false,
    order_index: 46,
    hint: 'Certaines personnes sont plus à l\'aise dans les conversations intimes que dans les interactions de groupe. Cela influence la vie sociale du couple.'
  },
  {
    id: 47,
    axis: 'Communication',
    text: 'Je n\'hésite pas à demander de l\'aide quand j\'en ai besoin.',
    category: 'scale' as const,
    weight: 1.0,
    is_dealbreaker: false,
    order_index: 47,
    hint: 'Demander de l\'aide n\'est pas une faiblesse. En couple, savoir exprimer ses besoins et accepter le soutien de l\'autre renforce la relation.'
  },
  {
    id: 48,
    axis: 'Communication',
    text: 'Je préfère qu\'on me pose des questions directes.',
    category: 'scale' as const,
    weight: 0.9,
    is_dealbreaker: false,
    order_index: 48
  },

  // DIMENSION 4: FAMILLE ET RELATIONS (Questions 49-61)
  {
    id: 49,
    axis: 'Famille',
    text: 'Je souhaite avoir des enfants dans les 2 prochaines années.',
    category: 'bool' as const,
    weight: 1.5,
    is_dealbreaker: true,
    order_index: 49,
    hint: 'Question cruciale sur le timing de la parentalité. Un désaccord ici peut créer des tensions majeures dans le couple. Si vous avez des projets précis, c\'est le moment de le clarifier.'
  },
  {
    id: 50,
    axis: 'Famille',
    text: 'Je veux avoir plus de 3 enfants.',
    category: 'bool' as const,
    weight: 1.3,
    is_dealbreaker: true,
    order_index: 50,
    hint: 'Le nombre d\'enfants souhaité est un point fondamental à aligner avant le mariage. Une famille nombreuse impacte finances, espace de vie, et organisation quotidienne.'
  },
  {
    id: 51,
    axis: 'Famille',
    text: 'Je préfère vivre près de ma famille élargie.',
    category: 'scale' as const,
    weight: 1.1,
    is_dealbreaker: false,
    order_index: 51,
    hint: 'La proximité géographique avec la famille élargie peut être un atout (aide, soutien) ou une source de tension (manque d\'intimité). Discutez-en ouvertement.'
  },
  {
    id: 52,
    axis: 'Famille',
    text: 'Ma famille d\'origine influence beaucoup mes décisions.',
    category: 'scale' as const,
    weight: 1.0,
    is_dealbreaker: false,
    order_index: 52,
    hint: 'L\'influence de la famille d\'origine peut être forte. En couple, il est important de trouver l\'équilibre entre respecter ses parents et prendre ses propres décisions.'
  },
  {
    id: 53,
    axis: 'Famille',
    text: 'Je souhaite que ma belle-famille soit très impliquée.',
    category: 'scale' as const,
    weight: 1.0,
    is_dealbreaker: false,
    order_index: 53,
    hint: 'L\'implication de la belle-famille peut être bénéfique (soutien, aide) ou problématique (intrusion). Cette question évalue vos attentes concernant la proximité avec les beaux-parents.'
  },
  {
    id: 54,
    axis: 'Famille',
    text: 'Je préfère élever mes enfants de manière stricte.',
    category: 'scale' as const,
    weight: 1.2,
    is_dealbreaker: false,
    order_index: 54,
    hint: 'Le style d\'éducation (strict vs permissif) crée souvent des tensions si les parents ne sont pas alignés. Clarifiez votre approche disciplinaire.'
  },
  {
    id: 55,
    axis: 'Famille',
    text: 'Je compte envoyer mes enfants à l\'école islamique.',
    category: 'scale' as const,
    weight: 1.1,
    is_dealbreaker: false,
    order_index: 55,
    hint: 'Le choix de l\'école (publique, privée, islamique) impacte l\'éducation religieuse et la socialisation de vos enfants. Un point à discuter avant le mariage.'
  },
  {
    id: 56,
    axis: 'Famille',
    text: 'Je veux que mes enfants parlent parfaitement arabe.',
    category: 'scale' as const,
    weight: 0.9,
    is_dealbreaker: false,
    order_index: 56
  },
  {
    id: 57,
    axis: 'Famille',
    text: 'Ma famille doit approuver mon choix de conjoint.',
    category: 'scale' as const,
    weight: 1.2,
    is_dealbreaker: false,
    order_index: 57,
    hint: 'L\'approbation familiale peut être un deal-breaker pour certains. Cette question évalue l\'importance de l\'avis de votre famille dans votre choix matrimonial.'
  },
  {
    id: 58,
    axis: 'Famille',
    text: 'Je souhaite adopter des enfants si nécessaire.',
    category: 'scale' as const,
    weight: 0.8,
    is_dealbreaker: false,
    order_index: 58
  },
  {
    id: 59,
    axis: 'Famille',
    text: 'Je veux transmettre ma culture d\'origine à mes enfants.',
    category: 'scale' as const,
    weight: 1.0,
    is_dealbreaker: false,
    order_index: 59
  },
  {
    id: 60,
    axis: 'Famille',
    text: 'Je préfère que mon conjoint ait le même background culturel.',
    category: 'scale' as const,
    weight: 0.9,
    is_dealbreaker: false,
    order_index: 60
  },
  {
    id: 61,
    axis: 'Famille',
    text: 'Les réunions familiales fréquentes sont importantes pour moi.',
    category: 'scale' as const,
    weight: 0.8,
    is_dealbreaker: false,
    order_index: 61
  },

  // DIMENSION 5: FINANCES (Questions 62-68)
  {
    id: 62,
    axis: 'Finances',
    text: 'Je préfère une gestion financière commune dans le couple.',
    category: 'scale' as const,
    weight: 1.3,
    is_dealbreaker: false,
    order_index: 62,
    hint: 'La gestion des finances (commune, séparée ou mixte) est l\'un des principaux sujets de désaccord dans les couples. Clarifier vos attentes évite les conflits futurs.'
  },
  {
    id: 63,
    axis: 'Finances',
    text: 'J\'évite strictement les crédits avec intérêts (riba).',
    category: 'scale' as const,
    weight: 1.4,
    is_dealbreaker: true,
    order_index: 63,
    hint: 'Le riba (intérêt usuraire) est interdit en Islam. Cette question évalue votre position sur les prêts bancaires classiques, les crédits immobiliers conventionnels, etc.'
  },
  {
    id: 64,
    axis: 'Finances',
    text: 'La dot (mahr) est un droit important que je respecte pleinement.',
    category: 'scale' as const,
    weight: 1.3,
    is_dealbreaker: true,
    order_index: 64,
    hint: 'Le mahr est un droit de la femme en Islam. Cette question mesure votre vision de cette obligation : montant symbolique vs conséquent, versement immédiat vs différé.'
  },
  {
    id: 65,
    axis: 'Finances',
    text: 'Je suis à l\'aise pour discuter ouvertement d\'argent avec mon conjoint.',
    category: 'scale' as const,
    weight: 1.1,
    is_dealbreaker: false,
    order_index: 65,
    hint: 'La transparence financière est essentielle dans un couple. Certains trouvent gênant de parler d\'argent, ce qui peut créer des malentendus et des conflits.'
  },
  {
    id: 66,
    axis: 'Finances',
    text: 'Épargner pour l\'avenir est plus important que profiter du présent.',
    category: 'scale' as const,
    weight: 1.0,
    is_dealbreaker: false,
    order_index: 66,
    hint: 'Le rapport à l\'épargne et aux dépenses varie : certains privilégient la sécurité financière, d\'autres préfèrent profiter au quotidien. Un point de compatibilité clé.'
  },
  {
    id: 67,
    axis: 'Finances',
    text: 'Je donne régulièrement la zakat et la sadaqah.',
    category: 'scale' as const,
    weight: 1.2,
    is_dealbreaker: false,
    order_index: 67,
    hint: 'La zakat est un pilier de l\'Islam et la sadaqah une pratique vertueuse. Cette question évalue votre engagement dans le don et la charité, qui impacte le budget familial.'
  },
  {
    id: 68,
    axis: 'Finances',
    text: 'Je considère que le mari a la responsabilité financière principale du foyer.',
    category: 'scale' as const,
    weight: 1.2,
    is_dealbreaker: false,
    order_index: 68,
    hint: 'En Islam, le nafaqah (prise en charge financière) est une responsabilité du mari. Cette question évalue votre position sur ce rôle traditionnel dans le contexte moderne.'
  },

  // DIMENSION 6: VIE CONJUGALE (Questions 69-74)
  {
    id: 69,
    axis: 'Vie conjugale',
    text: 'Je considère que la femme peut travailler après le mariage.',
    category: 'scale' as const,
    weight: 1.3,
    is_dealbreaker: true,
    order_index: 69,
    hint: 'Le travail de la femme mariée est un sujet important. Certains y sont favorables sans restriction, d\'autres souhaitent des conditions. Un point essentiel à aligner avant le mariage.'
  },
  {
    id: 70,
    axis: 'Vie conjugale',
    text: 'Le port du hijab est important dans ma vision du couple.',
    category: 'scale' as const,
    weight: 1.3,
    is_dealbreaker: true,
    order_index: 70,
    hint: 'Le hijab est une question personnelle et religieuse. Cette question évalue l\'importance que vous y accordez dans votre vie de couple et vos attentes envers votre conjoint(e).'
  },
  {
    id: 71,
    axis: 'Vie conjugale',
    text: 'La polygamie est acceptable dans certaines conditions islamiques.',
    category: 'scale' as const,
    weight: 1.4,
    is_dealbreaker: true,
    order_index: 71,
    hint: 'La polygamie, permise sous conditions strictes en Islam, divise. Cette question évalue votre position sur le sujet — un désaccord ici peut être un deal-breaker majeur.'
  },
  {
    id: 72,
    axis: 'Vie conjugale',
    text: 'J\'accepte les interactions professionnelles mixtes hommes/femmes.',
    category: 'scale' as const,
    weight: 1.1,
    is_dealbreaker: false,
    order_index: 72,
    hint: 'La mixité professionnelle est une réalité du monde du travail. Cette question évalue votre position sur les interactions homme/femme dans le cadre professionnel et social.'
  },
  {
    id: 73,
    axis: 'Vie conjugale',
    text: 'Je souhaite une répartition équitable des tâches ménagères.',
    category: 'scale' as const,
    weight: 1.2,
    is_dealbreaker: false,
    order_index: 73,
    hint: 'La répartition des tâches domestiques (cuisine, ménage, courses) est une source fréquente de tension. Alignez-vous sur vos attentes mutuelles dès le départ.'
  },
  {
    id: 74,
    axis: 'Vie conjugale',
    text: 'Je suis ouvert(e) à discuter des attentes intimes avec mon conjoint.',
    category: 'scale' as const,
    weight: 1.1,
    is_dealbreaker: false,
    order_index: 74,
    hint: 'L\'intimité conjugale est un sujet pudique mais essentiel. Pouvoir en discuter ouvertement avec son conjoint favorise l\'épanouissement et évite les frustrations.'
  },

  // DIMENSION 7: STYLE DE VIE (Questions 75-81)
  {
    id: 75,
    axis: 'Style de vie',
    text: 'Je préfère vivre dans un quartier à majorité musulmane.',
    category: 'scale' as const,
    weight: 1.0,
    is_dealbreaker: false,
    order_index: 75
  },
  {
    id: 76,
    axis: 'Style de vie',
    text: 'Je suis très attaché aux voyages et découvertes.',
    category: 'scale' as const,
    weight: 0.8,
    is_dealbreaker: false,
    order_index: 76
  },
  {
    id: 77,
    axis: 'Style de vie',
    text: 'Je préfère une vie simple et sans superflu.',
    category: 'scale' as const,
    weight: 1.1,
    is_dealbreaker: false,
    order_index: 77
  },
  {
    id: 78,
    axis: 'Style de vie',
    text: 'J\'aime recevoir des invités à la maison.',
    category: 'scale' as const,
    weight: 0.8,
    is_dealbreaker: false,
    order_index: 78
  },
  {
    id: 79,
    axis: 'Style de vie',
    text: 'Je préfère cuisiner à la maison plutôt qu\'au restaurant.',
    category: 'scale' as const,
    weight: 0.8,
    is_dealbreaker: false,
    order_index: 79
  },
  {
    id: 80,
    axis: 'Style de vie',
    text: 'J\'accorde beaucoup d\'importance à mon développement personnel.',
    category: 'scale' as const,
    weight: 0.9,
    is_dealbreaker: false,
    order_index: 80
  },
  {
    id: 81,
    axis: 'Style de vie',
    text: 'Je suis très ponctuel dans tous mes rendez-vous.',
    category: 'scale' as const,
    weight: 0.9,
    is_dealbreaker: false,
    order_index: 81
  },

  // DIMENSION 8: AMBITIONS ET PROJETS (Questions 82-100)
  {
    id: 82,
    axis: 'Ambitions',
    text: 'Ma carrière professionnelle est très importante pour moi.',
    category: 'scale' as const,
    weight: 1.1,
    is_dealbreaker: false,
    order_index: 82,
    hint: 'L\'équilibre vie pro/vie perso varie selon les personnes. Si votre carrière est prioritaire, cela impactera le temps familial et peut créer des tensions.'
  },
  {
    id: 83,
    axis: 'Ambitions',
    text: 'Je souhaite devenir financièrement indépendant rapidement.',
    category: 'scale' as const,
    weight: 1.0,
    is_dealbreaker: false,
    order_index: 83,
    hint: 'L\'indépendance financière est importante pour certains. Cette question évalue votre priorité entre stabilité financière immédiate vs construction progressive.'
  },
  {
    id: 84,
    axis: 'Ambitions',
    text: 'J\'accepterais de déménager pour ma carrière.',
    category: 'scale' as const,
    weight: 0.9,
    is_dealbreaker: false,
    order_index: 84
  },
  {
    id: 85,
    axis: 'Ambitions',
    text: 'Je veux créer ma propre entreprise.',
    category: 'scale' as const,
    weight: 0.8,
    is_dealbreaker: false,
    order_index: 85
  },
  {
    id: 86,
    axis: 'Ambitions',
    text: 'L\'argent n\'est pas ma motivation principale.',
    category: 'scale' as const,
    weight: 1.0,
    is_dealbreaker: false,
    order_index: 86,
    hint: 'Votre relation à l\'argent influence les choix de carrière et de vie. Cette question mesure si vous priorisez l\'épanouissement personnel ou la réussite financière.'
  },
  {
    id: 87,
    axis: 'Ambitions',
    text: 'Je souhaite poursuivre des études supérieures.',
    category: 'scale' as const,
    weight: 0.8,
    is_dealbreaker: false,
    order_index: 87
  },
  {
    id: 88,
    axis: 'Ambitions',
    text: 'Je veux contribuer à des œuvres caritatives.',
    category: 'scale' as const,
    weight: 1.2,
    is_dealbreaker: false,
    order_index: 88,
    hint: 'La générosité et la charité (sadaqah) sont des valeurs islamiques importantes. Cette question évalue votre engagement envers l\'aide aux autres et votre vision du don.'
  },
  {
    id: 89,
    axis: 'Ambitions',
    text: 'Posséder une belle maison est important pour moi.',
    category: 'scale' as const,
    weight: 0.7,
    is_dealbreaker: false,
    order_index: 89
  },
  {
    id: 90,
    axis: 'Ambitions',
    text: 'Je préfère la stabilité à l\'aventure professionnelle.',
    category: 'scale' as const,
    weight: 0.9,
    is_dealbreaker: false,
    order_index: 90
  },
  {
    id: 91,
    axis: 'Ambitions',
    text: 'Je veux faire au moins un pèlerinage par an.',
    category: 'scale' as const,
    weight: 0.9,
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
    order_index: 92,
    hint: 'Devenir une figure respectée dans la communauté musulmane demande du temps et de l\'investissement. Cela peut influencer votre disponibilité familiale.'
  },
  {
    id: 93,
    axis: 'Ambitions',
    text: 'L\'équilibre vie privée/professionnelle est essentiel.',
    category: 'scale' as const,
    weight: 1.1,
    is_dealbreaker: false,
    order_index: 93,
    hint: 'Un bon équilibre entre travail et famille est crucial pour la santé du couple. Cette question évalue si vous êtes prêt à sacrifier votre carrière pour votre vie personnelle.'
  },
  {
    id: 94,
    axis: 'Ambitions',
    text: 'Je veux laisser un héritage spirituel à mes enfants.',
    category: 'scale' as const,
    weight: 1.3,
    is_dealbreaker: false,
    order_index: 94,
    hint: 'Au-delà des biens matériels, l\'héritage spirituel (valeurs, foi, connaissances islamiques) est ce qui perdure. Cette question évalue vos priorités à long terme.'
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
    order_index: 96,
    hint: 'La maîtrise de l\'arabe coranique permet de comprendre le Coran dans sa langue originale. Cette ambition reflète votre engagement dans l\'apprentissage religieux.'
  },
  {
    id: 97,
    axis: 'Ambitions',
    text: 'Participer à des projets communautaires me motive.',
    category: 'scale' as const,
    weight: 1.0,
    is_dealbreaker: false,
    order_index: 97,
    hint: 'L\'engagement communautaire (mosquée, associations, projets sociaux) reflète votre volonté d\'aider la Oummah. Important si vous voulez un conjoint actif dans la communauté.'
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
    order_index: 100,
    hint: 'Aspirer à être un couple exemplaire dans la foi reflète votre désir d\'inspirer et de représenter les valeurs islamiques. Cela demande un engagement mutuel fort.'
  }
]
