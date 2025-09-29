import { PERSONALITY_QUESTIONS } from '@/data/personality-questions'

export interface CompatibilityAnalysis {
  overall_score: number
  dimension_scores: {
    [dimension: string]: {
      score: number
      weight: number
      questions_count: number
      strengths: string[]
      concerns: string[]
    }
  }
  dealbreaker_conflicts: number
  compatibility_level: 'Excellente' | 'Bonne' | 'Modérée' | 'Faible'
  detailed_analysis: {
    strengths: string[]
    areas_to_discuss: string[]
    recommendations: string[]
  }
  question_matches: {
    perfect_matches: number
    good_matches: number
    minor_differences: number
    major_differences: number
  }
}

export interface UserResponses {
  [questionId: number]: boolean | number
}

// Algorithme sophistiqué de compatibilité pour 100 questions
export class CompatibilityCalculator {
  
  // Pondération des dimensions (importance relative)
  private static DIMENSION_WEIGHTS = {
    'Spiritualité': 2.0,        // Le plus important dans un mariage islamique
    'Famille': 1.8,             // Projets de vie très importants
    'Personnalité': 1.5,        // Compatibilité caractérielle
    'Communication': 1.4,       // Base de la relation
    'Ambitions': 1.2,          // Projets communs
    'Style de vie': 1.0         // Ajustable avec compromis
  }

  // Seuils pour les types de matches
  private static MATCH_THRESHOLDS = {
    PERFECT: 0.95,     // Réponses quasi-identiques
    GOOD: 0.75,        // Très compatible
    MINOR: 0.50,       // Différences mineures
    MAJOR: 0.25        // Différences importantes
  }

  static calculateCompatibility(
    responses1: UserResponses, 
    responses2: UserResponses
  ): CompatibilityAnalysis {
    
    const dimensionScores = this.calculateDimensionScores(responses1, responses2)
    const questionMatches = this.analyzeQuestionMatches(responses1, responses2)
    const dealbreakerConflicts = this.countDealbreakerConflicts(responses1, responses2)
    
    // Score global pondéré par dimensions
    const overallScore = this.calculateOverallScore(dimensionScores)
    
    // Analyse qualitative
    const detailedAnalysis = this.generateDetailedAnalysis(
      dimensionScores, 
      questionMatches, 
      dealbreakerConflicts
    )
    
    const compatibilityLevel = this.getCompatibilityLevel(overallScore, dealbreakerConflicts)

    return {
      overall_score: Math.round(overallScore * 100) / 100,
      dimension_scores: dimensionScores,
      dealbreaker_conflicts: dealbreakerConflicts,
      compatibility_level: compatibilityLevel,
      detailed_analysis: detailedAnalysis,
      question_matches: questionMatches
    }
  }

  private static calculateDimensionScores(
    responses1: UserResponses, 
    responses2: UserResponses
  ) {
    const dimensionScores: any = {}
    
    // Grouper les questions par dimension
    const questionsByDimension = this.groupQuestionsByDimension()
    
    Object.entries(questionsByDimension).forEach(([dimension, questions]) => {
      let totalScore = 0
      let totalWeight = 0
      let matchCount = 0
      
      questions.forEach(question => {
        const response1 = responses1[question.id]
        const response2 = responses2[question.id]
        
        if (response1 !== undefined && response2 !== undefined) {
          const questionScore = this.calculateQuestionCompatibility(
            response1, response2, question.category, question.weight
          )
          
          totalScore += questionScore * question.weight
          totalWeight += question.weight
          matchCount++
        }
      })
      
      const dimensionScore = totalWeight > 0 ? totalScore / totalWeight : 0
      
      dimensionScores[dimension] = {
        score: Math.round(dimensionScore * 100) / 100,
        weight: this.DIMENSION_WEIGHTS[dimension as keyof typeof this.DIMENSION_WEIGHTS] || 1.0,
        questions_count: matchCount,
        strengths: this.getDimensionStrengths(dimension, dimensionScore),
        concerns: this.getDimensionConcerns(dimension, dimensionScore)
      }
    })
    
    return dimensionScores
  }

  private static calculateQuestionCompatibility(
    response1: boolean | number,
    response2: boolean | number,
    category: 'bool' | 'scale',
    weight: number
  ): number {
    
    if (category === 'bool') {
      // Questions booléennes : compatibilité parfaite ou incompatibilité
      return response1 === response2 ? 1.0 : 0.0
    } else {
      // Questions d'échelle (1-5) : compatibilité graduelle
      const diff = Math.abs((response1 as number) - (response2 as number))
      const maxDiff = 4 // Différence maximale sur échelle 1-5
      
      // Fonction de compatibilité non-linéaire (plus sévère pour les grandes différences)
      const compatibility = Math.max(0, 1 - Math.pow(diff / maxDiff, 1.5))
      return compatibility
    }
  }

  private static analyzeQuestionMatches(
    responses1: UserResponses,
    responses2: UserResponses
  ) {
    let perfectMatches = 0
    let goodMatches = 0
    let minorDifferences = 0
    let majorDifferences = 0
    
    PERSONALITY_QUESTIONS.forEach(question => {
      const response1 = responses1[question.id]
      const response2 = responses2[question.id]
      
      if (response1 !== undefined && response2 !== undefined) {
        const compatibility = this.calculateQuestionCompatibility(
          response1, response2, question.category, question.weight
        )
        
        if (compatibility >= this.MATCH_THRESHOLDS.PERFECT) {
          perfectMatches++
        } else if (compatibility >= this.MATCH_THRESHOLDS.GOOD) {
          goodMatches++
        } else if (compatibility >= this.MATCH_THRESHOLDS.MINOR) {
          minorDifferences++
        } else {
          majorDifferences++
        }
      }
    })
    
    return {
      perfect_matches: perfectMatches,
      good_matches: goodMatches,
      minor_differences: minorDifferences,
      major_differences: majorDifferences
    }
  }

  private static countDealbreakerConflicts(
    responses1: UserResponses,
    responses2: UserResponses
  ): number {
    let conflicts = 0
    
    PERSONALITY_QUESTIONS
      .filter(q => q.is_dealbreaker)
      .forEach(question => {
        const response1 = responses1[question.id]
        const response2 = responses2[question.id]
        
        if (response1 !== undefined && response2 !== undefined) {
          const compatibility = this.calculateQuestionCompatibility(
            response1, response2, question.category, question.weight
          )
          
          // Seuil strict pour les deal-breakers
          if (compatibility < 0.8) {
            conflicts++
          }
        }
      })
    
    return conflicts
  }

  private static calculateOverallScore(dimensionScores: any): number {
    let weightedSum = 0
    let totalWeight = 0
    
    Object.entries(dimensionScores).forEach(([dimension, data]: [string, any]) => {
      const dimensionWeight = this.DIMENSION_WEIGHTS[dimension as keyof typeof this.DIMENSION_WEIGHTS] || 1.0
      weightedSum += data.score * dimensionWeight
      totalWeight += dimensionWeight
    })
    
    return totalWeight > 0 ? weightedSum / totalWeight : 0
  }

  private static getCompatibilityLevel(
    score: number, 
    dealbreakerConflicts: number
  ): 'Excellente' | 'Bonne' | 'Modérée' | 'Faible' {
    // Les deal-breakers impactent significativement le niveau
    if (dealbreakerConflicts >= 3) return 'Faible'
    
    if (score >= 0.85 && dealbreakerConflicts === 0) return 'Excellente'
    if (score >= 0.70 && dealbreakerConflicts <= 1) return 'Bonne'
    if (score >= 0.50 && dealbreakerConflicts <= 2) return 'Modérée'
    return 'Faible'
  }

  private static groupQuestionsByDimension() {
    const groups: { [key: string]: typeof PERSONALITY_QUESTIONS } = {}
    
    PERSONALITY_QUESTIONS.forEach(question => {
      if (!groups[question.axis]) {
        groups[question.axis] = []
      }
      groups[question.axis].push(question)
    })
    
    return groups
  }

  private static getDimensionStrengths(dimension: string, score: number): string[] {
    const strengths: { [key: string]: string[] } = {
      'Spiritualité': [
        'Pratique religieuse harmonieuse',
        'Valeurs spirituelles partagées',
        'Projets religieux communs',
        'Éducation islamique des enfants alignée'
      ],
      'Personnalité': [
        'Tempéraments complémentaires',
        'Gestion émotionnelle compatible',
        'Traits de caractère harmonieux',
        'Approches de vie similaires'
      ],
      'Communication': [
        'Styles de communication alignés',
        'Résolution de conflits efficace',
        'Expression émotionnelle équilibrée',
        'Écoute mutuelle développée'
      ],
      'Famille': [
        'Projets familiaux partagés',
        'Vision éducative commune',
        'Relations familiales harmonieuses',
        'Traditions culturelles alignées'
      ],
      'Style de vie': [
        'Habitudes quotidiennes compatibles',
        'Valeurs sociales partagées',
        'Organisation de vie similaire',
        'Loisirs et activités complémentaires'
      ],
      'Ambitions': [
        'Objectifs professionnels alignés',
        'Projets de vie communs',
        'Équilibre travail-famille partagé',
        'Aspirations spirituelles communes'
      ]
    }
    
    if (score >= 0.8) {
      return strengths[dimension] || [`Excellente compatibilité en ${dimension}`]
    } else if (score >= 0.6) {
      return [strengths[dimension]?.[0] || `Bonne base en ${dimension}`]
    }
    
    return []
  }

  private static getDimensionConcerns(dimension: string, score: number): string[] {
    const concerns: { [key: string]: string[] } = {
      'Spiritualité': [
        'Différences dans la pratique religieuse',
        'Approches spirituelles divergentes',
        'Projets religieux non alignés'
      ],
      'Personnalité': [
        'Tempéraments potentiellement conflictuels',
        'Gestion du stress différente',
        'Traits de caractère opposés'
      ],
      'Communication': [
        'Styles de communication incompatibles',
        'Difficulté dans la résolution de conflits',
        'Expression émotionnelle déséquilibrée'
      ],
      'Famille': [
        'Visions familiales divergentes',
        'Approches éducatives différentes',
        'Relations familiales tendues'
      ],
      'Style de vie': [
        'Habitudes de vie incompatibles',
        'Valeurs sociales opposées',
        'Organisation quotidienne conflictuelle'
      ],
      'Ambitions': [
        'Objectifs professionnels contradictoires',
        'Projets de vie incompatibles',
        'Priorités de vie différentes'
      ]
    }
    
    if (score < 0.4) {
      return concerns[dimension] || [`Incompatibilités importantes en ${dimension}`]
    } else if (score < 0.6) {
      return [concerns[dimension]?.[0] || `Points à discuter en ${dimension}`]
    }
    
    return []
  }

  private static generateDetailedAnalysis(
    dimensionScores: any,
    questionMatches: any,
    dealbreakerConflicts: number
  ) {
    const strengths: string[] = []
    const areasToDiscuss: string[] = []
    const recommendations: string[] = []
    
    // Analyser les forces
    Object.entries(dimensionScores).forEach(([dimension, data]: [string, any]) => {
      if (data.score >= 0.8) {
        strengths.push(`Excellente harmonie en ${dimension} (${Math.round(data.score * 100)}%)`)
      } else if (data.score >= 0.6) {
        strengths.push(`Bonne compatibilité en ${dimension} (${Math.round(data.score * 100)}%)`)
      }
      
      if (data.score < 0.6) {
        areasToDiscuss.push(`${dimension} nécessite des discussions approfondies`)
      }
    })
    
    // Recommandations basées sur l'analyse
    if (dealbreakerConflicts === 0) {
      recommendations.push('Aucun conflit majeur détecté - excellent potentiel de mariage')
    } else if (dealbreakerConflicts <= 2) {
      recommendations.push('Quelques points fondamentaux à clarifier avant le mariage')
    } else {
      recommendations.push('Différences importantes nécessitant une réflexion approfondie')
    }
    
    if (questionMatches.perfect_matches >= 50) {
      recommendations.push('Très forte harmonie sur la majorité des aspects')
    }
    
    if (dimensionScores.Spiritualité?.score >= 0.9) {
      recommendations.push('Base spirituelle solide pour construire un mariage islamique épanouissant')
    }
    
    return {
      strengths,
      areas_to_discuss: areasToDiscuss,
      recommendations
    }
  }
}