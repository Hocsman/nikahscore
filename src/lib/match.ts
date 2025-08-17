// Algorithme de calcul de compatibilité pour NikahScore
// Basé sur l'analyse des réponses aux questions et leurs pondérations

interface AnswerWithQuestion {
  question_id: string
  respondent: 'A' | 'B'
  value: number
  importance: number
  questions: {
    category: string
    axis: string
    is_dealbreaker: boolean
    weight: number
  }
}

interface CompatibilityResult {
  overallScore: number
  axisScores: Record<string, number>
  dealbreakerConflicts: number
  strengths: string[]
  frictions: string[]
  recommendations: string[]
}

/**
 * Calcule le score de compatibilité entre deux répondants
 */
export function calculateCompatibility(answers: AnswerWithQuestion[]): CompatibilityResult {
  // Grouper les réponses par question
  const answersByQuestion = groupAnswersByQuestion(answers)
  
  // Calculer les scores par axe
  const axisScores = calculateAxisScores(answersByQuestion)
  
  // Calculer le score global
  const overallScore = calculateOverallScore(axisScores)
  
  // Détecter les conflits sur les deal-breakers
  const dealbreakerConflicts = countDealbreakerConflicts(answersByQuestion)
  
  // Identifier les forces et frictions
  const { strengths, frictions } = identifyStrengthsAndFrictions(axisScores, answersByQuestion)
  
  // Générer des recommandations
  const recommendations = generateRecommendations(axisScores, dealbreakerConflicts, answersByQuestion)
  
  return {
    overallScore: Math.round(overallScore),
    axisScores: Object.fromEntries(
      Object.entries(axisScores).map(([axis, score]) => [axis, Math.round(score)])
    ),
    dealbreakerConflicts,
    strengths,
    frictions,
    recommendations
  }
}

/**
 * Groupe les réponses par question pour faciliter la comparaison
 */
function groupAnswersByQuestion(answers: AnswerWithQuestion[]): Map<string, AnswerWithQuestion[]> {
  const grouped = new Map<string, AnswerWithQuestion[]>()
  
  for (const answer of answers) {
    if (!grouped.has(answer.question_id)) {
      grouped.set(answer.question_id, [])
    }
    grouped.get(answer.question_id)!.push(answer)
  }
  
  return grouped
}

/**
 * Calcule les scores par axe de compatibilité
 */
function calculateAxisScores(answersByQuestion: Map<string, AnswerWithQuestion[]>): Record<string, number> {
  const axisScores: Record<string, number[]> = {}
  
  for (const [questionId, questionAnswers] of answersByQuestion) {
    if (questionAnswers.length !== 2) continue // Skip si pas les 2 réponses
    
    const [answerA, answerB] = questionAnswers.sort((a, b) => a.respondent.localeCompare(b.respondent))
    const axis = answerA.questions.axis
    const weight = answerA.questions.weight
    
    // Calculer la différence pondérée
    const difference = Math.abs(answerA.value - answerB.value)
    const maxDifference = 4 // Différence maximale possible (5-1)
    
    // Score de base inversé (plus la différence est petite, plus le score est élevé)
    let baseScore = (1 - difference / maxDifference) * 100
    
    // Ajustement selon l'importance accordée par chaque répondant
    const avgImportance = (answerA.importance + answerB.importance) / 2
    const importanceMultiplier = 0.5 + (avgImportance - 1) * 0.25 // 0.5 à 1.0
    
    // Score final avec pondération
    const finalScore = baseScore * importanceMultiplier * weight
    
    if (!axisScores[axis]) {
      axisScores[axis] = []
    }
    axisScores[axis].push(finalScore)
  }
  
  // Moyenne par axe
  const avgAxisScores: Record<string, number> = {}
  for (const [axis, scores] of Object.entries(axisScores)) {
    avgAxisScores[axis] = scores.reduce((sum, score) => sum + score, 0) / scores.length
  }
  
  return avgAxisScores
}

/**
 * Calcule le score global de compatibilité
 */
function calculateOverallScore(axisScores: Record<string, number>): number {
  const axes = Object.values(axisScores)
  if (axes.length === 0) return 0
  
  // Moyenne pondérée des axes avec importance différente
  const axisWeights: Record<string, number> = {
    spiritualite: 1.5,     // Très important dans le contexte islamique
    compatibilite: 1.4,    // Capacité à s'entendre
    tradition: 1.2,        // Respect des traditions
    stabilite: 1.1,        // Stabilité financière et émotionnelle
    ouverture: 1.0,        // Ouverture d'esprit
    ambition: 0.9          // Ambitions personnelles
  }
  
  let weightedSum = 0
  let totalWeight = 0
  
  for (const [axis, score] of Object.entries(axisScores)) {
    const weight = axisWeights[axis] || 1.0
    weightedSum += score * weight
    totalWeight += weight
  }
  
  return totalWeight > 0 ? weightedSum / totalWeight : 0
}

/**
 * Compte les conflits sur les questions deal-breaker
 */
function countDealbreakerConflicts(answersByQuestion: Map<string, AnswerWithQuestion[]>): number {
  let conflicts = 0
  
  for (const [questionId, questionAnswers] of answersByQuestion) {
    if (questionAnswers.length !== 2) continue
    
    const [answerA, answerB] = questionAnswers.sort((a, b) => a.respondent.localeCompare(b.respondent))
    
    if (answerA.questions.is_dealbreaker) {
      // Pour les deal-breakers, une différence de 2+ points est considérée comme un conflit
      const difference = Math.abs(answerA.value - answerB.value)
      if (difference >= 2) {
        conflicts++
      }
    }
  }
  
  return conflicts
}

/**
 * Identifie les forces et points de friction
 */
function identifyStrengthsAndFrictions(
  axisScores: Record<string, number>,
  answersByQuestion: Map<string, AnswerWithQuestion[]>
): { strengths: string[]; frictions: string[] } {
  const strengths: string[] = []
  const frictions: string[] = []
  
  // Analyse par axe
  for (const [axis, score] of Object.entries(axisScores)) {
    if (score >= 80) {
      strengths.push(getStrengthMessage(axis, score))
    } else if (score <= 50) {
      frictions.push(getFrictionMessage(axis, score))
    }
  }
  
  // Analyse des deal-breakers spécifiques
  for (const [questionId, questionAnswers] of answersByQuestion) {
    if (questionAnswers.length !== 2) continue
    
    const [answerA, answerB] = questionAnswers.sort((a, b) => a.respondent.localeCompare(b.respondent))
    
    if (answerA.questions.is_dealbreaker) {
      const difference = Math.abs(answerA.value - answerB.value)
      if (difference >= 2) {
        frictions.push(getDealbreakerConflictMessage(answerA.questions.category))
      } else if (difference === 0) {
        strengths.push(getDealbreakerAlignmentMessage(answerA.questions.category))
      }
    }
  }
  
  return { strengths, frictions }
}

/**
 * Génère des recommandations personnalisées
 */
function generateRecommendations(
  axisScores: Record<string, number>,
  dealbreakerConflicts: number,
  answersByQuestion: Map<string, AnswerWithQuestion[]>
): string[] {
  const recommendations: string[] = []
  
  // Recommandations basées sur les scores d'axes
  for (const [axis, score] of Object.entries(axisScores)) {
    if (score <= 60) {
      recommendations.push(getAxisRecommendation(axis))
    }
  }
  
  // Recommandations pour les deal-breakers
  if (dealbreakerConflicts > 0) {
    recommendations.push("Discutez en profondeur des points d'incompatibilité majeure identifiés")
    recommendations.push("Consultez un imam ou conseiller matrimonial pour vous accompagner")
  }
  
  // Recommandations générales selon le score global
  const overallScore = calculateOverallScore(axisScores)
  if (overallScore >= 80) {
    recommendations.push("Continuez à communiquer ouvertement pour maintenir cette belle harmonie")
  } else if (overallScore >= 60) {
    recommendations.push("Prenez le temps d'approfondir votre connaissance mutuelle")
  } else {
    recommendations.push("Réfléchissez sérieusement à vos différences avant l'engagement")
  }
  
  return recommendations.slice(0, 4) // Limiter à 4 recommandations
}

// Messages helpers
function getStrengthMessage(axis: string, score: number): string {
  const messages: Record<string, string> = {
    spiritualite: "Excellente harmonie dans vos pratiques religieuses",
    tradition: "Vision partagée des traditions islamiques",
    ouverture: "Belle complémentarité dans votre ouverture au monde",
    ambition: "Objectifs professionnels bien alignés",
    stabilite: "Recherche commune de stabilité et sécurité",
    compatibilite: "Excellente entente et communication naturelle"
  }
  return messages[axis] || `Très bonne compatibilité sur l'axe ${axis}`
}

function getFrictionMessage(axis: string, score: number): string {
  const messages: Record<string, string> = {
    spiritualite: "Différences importantes dans la pratique religieuse",
    tradition: "Visions différentes des traditions et du mode de vie",
    ouverture: "Approches différentes de l'ouverture culturelle",
    ambition: "Objectifs professionnels divergents",
    stabilite: "Attentes différentes en matière de stabilité",
    compatibilite: "Difficultés potentielles de communication et d'entente"
  }
  return messages[axis] || `Incompatibilité notable sur l'axe ${axis}`
}

function getDealbreakerConflictMessage(category: string): string {
  const messages: Record<string, string> = {
    valeurs_religieuses: "Incompatibilité majeure sur les valeurs religieuses essentielles",
    mode_de_vie: "Désaccord important sur le mode de vie souhaité",
    famille: "Visions divergentes sur la famille et les enfants",
    finances: "Approches incompatibles des questions financières",
    intimite: "Attentes différentes concernant la relation de couple",
    projets_avenir: "Projets d'avenir incompatibles"
  }
  return messages[category] || "Incompatibilité majeure identifiée"
}

function getDealbreakerAlignmentMessage(category: string): string {
  const messages: Record<string, string> = {
    valeurs_religieuses: "Parfait accord sur les valeurs religieuses fondamentales",
    mode_de_vie: "Vision commune du mode de vie idéal",
    famille: "Objectifs familiaux parfaitement alignés",
    finances: "Approche similaire des questions financières",
    intimite: "Attentes compatibles pour la vie de couple",
    projets_avenir: "Projets d'avenir harmonieusement partagés"
  }
  return messages[category] || "Accord parfait sur un point essentiel"
}

function getAxisRecommendation(axis: string): string {
  const recommendations: Record<string, string> = {
    spiritualite: "Explorez ensemble vos pratiques religieuses et trouvez un équilibre",
    tradition: "Discutez de vos attentes concernant les traditions familiales",
    ouverture: "Échangez sur vos visions du monde et votre ouverture culturelle",
    ambition: "Clarifiez vos objectifs professionnels et trouvez des compromis",
    stabilite: "Définissez ensemble vos priorités de stabilité financière et émotionnelle",
    compatibilite: "Travaillez sur votre communication et votre compréhension mutuelle"
  }
  return recommendations[axis] || `Approfondissez votre dialogue sur l'axe ${axis}`
}
