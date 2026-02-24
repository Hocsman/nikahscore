// Explications (hints) pour aider les utilisateurs à mieux comprendre les questions
// Format: { questionId: hint }

export const QUESTION_HINTS: Record<number, string> = {
  // SPIRITUALITÉ (1-14)
  1: 'Cette question évalue votre assiduité dans l\'accomplissement des prières obligatoires, pilier fondamental de l\'Islam.',
  2: 'Il s\'agit de mesurer votre engagement dans la lecture et la méditation du Coran, au-delà des prières.',
  3: 'Cette question évalue à quel point vous intégrez les principes islamiques dans vos choix de vie majeurs.',
  4: 'Le pèlerinage à La Mecque est un objectif spirituel important. Cette question mesure si c\'est un projet que vous souhaitez partager en couple.',
  5: 'Le jeûne surérogatoire (comme les lundis/jeudis) montre un engagement spirituel au-delà des obligations.',
  7: 'Cette question fondamentale concerne la transmission de la foi à vos futurs enfants.',
  9: 'Le respect du halal dans l\'alimentation est un pilier du mode de vie islamique.',
  10: 'Il s\'agit de savoir si vous souhaitez un mariage religieux conforme aux préceptes islamiques (walima, dot, témoins, etc.).',
  12: 'Question sur votre positionnement ferme concernant l\'interdiction de l\'alcool dans votre foyer et votre vie.',
  14: 'Certains couples aiment partager des moments spirituels comme la prière en commun. Cette question évalue si c\'est important pour vous.',

  // PERSONNALITÉ (15-33)
  15: 'La patience est une qualité essentielle dans le mariage. Répondez honnêtement sur votre capacité à rester calme dans les situations difficiles.',
  18: 'Cette question évalue votre gestion de la colère et des frustrations quotidiennes. Soyez sincère pour une meilleure compatibilité.',
  21: 'La capacité à pardonner est essentielle en couple. Cette question évalue votre tendance à garder rancune ou à passer l\'éponge.',
  22: 'L\'organisation quotidienne peut être source de conflits si l\'un est très structuré et l\'autre spontané.',
  27: 'L\'empathie (capacité à ressentir les émotions de l\'autre) est fondamentale en couple.',

  // COMMUNICATION (34-48)
  36: 'Une tendance aux disputes fréquentes peut indiquer une difficulté à gérer les désaccords calmement.',
  38: 'Une communication claire de vos besoins est cruciale pour un couple sain.',
  44: 'L\'intelligence émotionnelle (détecter les émotions non-dites) aide à anticiper les besoins de votre partenaire.',
  47: 'Demander de l\'aide n\'est pas une faiblesse. En couple, savoir exprimer ses besoins et accepter le soutien de l\'autre renforce la relation.',

  // FAMILLE (49-61)
  49: 'Question cruciale sur le timing de la parentalité. Un désaccord ici peut créer des tensions majeures dans le couple.',
  50: 'Le nombre d\'enfants souhaité est un point fondamental à aligner avant le mariage.',
  52: 'L\'influence de la famille d\'origine peut être forte. En couple, il est important de trouver l\'équilibre entre respecter ses parents et prendre ses propres décisions.',
  54: 'Le style d\'éducation (strict vs permissif) crée souvent des tensions si les parents ne sont pas alignés.',
  57: 'L\'approbation familiale peut être un deal-breaker pour certains.',

  // FINANCES (62-68)
  62: 'La gestion des finances (commune, séparée ou mixte) est l\'un des principaux sujets de désaccord dans les couples.',
  63: 'Le riba (intérêt usuraire) est interdit en Islam. Cette question évalue votre position sur les prêts bancaires classiques.',
  64: 'Le mahr est un droit de la femme en Islam. Cette question mesure votre vision de cette obligation.',
  65: 'La transparence financière est essentielle dans un couple. Certains trouvent gênant de parler d\'argent.',
  67: 'La zakat est un pilier de l\'Islam et la sadaqah une pratique vertueuse. Cela impacte le budget familial.',
  68: 'En Islam, le nafaqah (prise en charge financière) est une responsabilité du mari. Cette question évalue votre position sur ce rôle dans le contexte moderne.',

  // VIE CONJUGALE (69-74)
  69: 'Le travail de la femme mariée est un sujet important. Certains y sont favorables sans restriction, d\'autres souhaitent des conditions.',
  70: 'Le hijab est une question personnelle et religieuse. Cette question évalue l\'importance que vous y accordez dans votre vie de couple.',
  71: 'La polygamie, permise sous conditions strictes en Islam, divise. Un désaccord ici peut être un deal-breaker majeur.',
  72: 'La mixité professionnelle est une réalité du monde du travail. Cette question évalue votre position sur les interactions homme/femme.',
  73: 'La répartition des tâches domestiques est une source fréquente de tension. Alignez-vous sur vos attentes mutuelles.',
  74: 'L\'intimité conjugale est un sujet pudique mais essentiel. Pouvoir en discuter favorise l\'épanouissement du couple.',

  // AMBITIONS (82-100)
  82: 'L\'équilibre vie pro/vie perso varie selon les personnes. Si votre carrière est prioritaire, cela impactera le temps familial.',
  86: 'Votre relation à l\'argent influence les choix de carrière et de vie.',
  92: 'Devenir une figure respectée dans la communauté musulmane demande du temps et de l\'investissement.',
  94: 'Au-delà des biens matériels, l\'héritage spirituel (valeurs, foi, connaissances islamiques) est ce qui perdure.',
  96: 'La maîtrise de l\'arabe coranique permet de comprendre le Coran dans sa langue originale.',
  100: 'Aspirer à être un couple exemplaire dans la foi reflète votre désir d\'inspirer et de représenter les valeurs islamiques.'
}

// Fonction helper pour obtenir un hint
export function getQuestionHint(questionId: number): string | undefined {
  return QUESTION_HINTS[questionId]
}
