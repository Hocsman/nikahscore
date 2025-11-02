// Explications (hints) pour aider les utilisateurs à mieux comprendre les questions
// Format: { questionId: hint }

export const QUESTION_HINTS: Record<number, string> = {
  // SPIRITUALITÉ
  1: 'Cette question évalue votre assiduité dans l\'accomplissement des prières obligatoires, pilier fondamental de l\'Islam.',
  2: 'Il s\'agit de mesurer votre engagement dans la lecture et la méditation du Coran, au-delà des prières.',
  3: 'Cette question évalue à quel point vous intégrez les principes islamiques dans vos choix de vie majeurs.',
  4: 'Le pèlerinage à La Mecque est un objectif spirituel important. Cette question mesure si c\'est un projet que vous souhaitez partager en couple.',
  5: 'Cette question concerne l\'importance que vous accordez à votre entourage social et son influence sur votre pratique religieuse.',
  
  11: 'Il s\'agit de savoir si vous souhaitez un mariage religieux conforme aux préceptes islamiques (walima, dot, témoins, etc.).',
  13: 'Question sur votre positionnement ferme concernant l\'interdiction de l\'alcool dans votre foyer et votre vie.',
  15: 'Certains couples aiment partager des moments spirituels comme la prière en commun. Cette question évalue si c\'est important pour vous.',

  // PERSONNALITÉ
  16: 'La patience est une qualité essentielle dans le mariage. Répondez honnêtement sur votre capacité à rester calme dans les situations difficiles.',
  19: 'Cette question évalue votre gestion de la colère et des frustrations quotidiennes. Soyez sincère pour une meilleure compatibilité.',
  22: 'Il s\'agit de comprendre votre rapport à l\'organisation et à la planification dans votre vie quotidienne.',

  // COMMUNICATION
  36: 'Cette question concerne votre style de communication : direct et franc vs. plus implicite et nuancé.',
  37: 'L\'écoute active est cruciale dans un couple. Évaluez votre capacité à vraiment écouter avant de répondre.',
  40: 'Il s\'agit de savoir si vous préférez résoudre les conflits immédiatement ou prendre du temps pour réfléchir.',
  45: 'Cette question mesure votre ouverture au dialogue et votre capacité à discuter de sujets sensibles sans vous braquer.',

  // FAMILLE
  51: 'Cette question concerne le nombre d\'enfants que vous envisagez. Soyez réaliste par rapport à vos souhaits actuels.',
  52: 'Il s\'agit de votre vision sur l\'éducation religieuse que vous souhaitez transmettre à vos futurs enfants.',
  54: 'Cette question évalue le rôle que vous envisagez pour vos parents dans votre vie de couple (proximité, décisions, etc.).',
  60: 'Il s\'agit de savoir si vous accepteriez de vivre sous le même toit que vos beaux-parents, une question importante culturellement.',

  // VALEURS ET PROJET DE VIE
  66: 'Cette question concerne vos ambitions professionnelles et leur place dans votre vie par rapport à la vie familiale.',
  67: 'Il s\'agit de vos priorités : carrière ambitieuse ou équilibre vie professionnelle/personnelle.',
  70: 'Cette question évalue votre rapport à l\'argent et aux dépenses dans un contexte de vie de couple.',
  76: 'Il s\'agit de savoir si vous êtes prêt(e) à déménager pour votre conjoint (opportunité professionnelle, famille, etc.).',

  // INTIMITÉ ET AFFECTION
  81: 'Cette question concerne votre besoin de moments de qualité en couple et leur fréquence.',
  85: 'Il s\'agit de votre style d\'expression de l\'affection : démonstratif ou plus réservé.',
  90: 'Cette question évalue vos attentes concernant les sorties en couple et les activités partagées.',

  // LIFESTYLE
  91: 'Il s\'agit de votre rapport au sport et à l\'activité physique dans votre routine quotidienne.',
  94: 'Cette question concerne vos habitudes alimentaires et leur importance dans votre mode de vie.',
  96: 'Il s\'agit de savoir si voyager et découvrir le monde est une priorité pour vous dans le couple.',
  100: 'Question sur votre capacité à accepter les différences et à faire des compromis, essentiel dans un mariage.'
}

// Fonction helper pour obtenir un hint
export function getQuestionHint(questionId: number): string | undefined {
  return QUESTION_HINTS[questionId]
}
