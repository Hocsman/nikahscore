// Types TypeScript pour l'application NikahScore
// Définit les interfaces et types pour toute l'application

import { z } from 'zod'

// ================== TYPES DE BASE ==================

export type UserRole = 'user' | 'admin'
export type PairStatus = 'pending' | 'active' | 'completed' | 'expired'
export type AnswerChoice = 'A' | 'B' | 'C' | 'D'
export type QuestionCategory = 'faith' | 'lifestyle' | 'family' | 'education' | 'social' | 'personality'

// ================== TYPES DATABASE ==================

export interface User {
  id: string
  email: string
  email_hash: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Question {
  id: number
  category: QuestionCategory
  text: string
  choices: {
    A: string
    B: string
    C: string
    D: string
  }
  weights: {
    faith: number
    lifestyle: number
    family: number
    education: number
    social: number
    personality: number
  }
  is_dealbreaker: boolean
  order_index: number
  created_at: string
}

export interface Pair {
  id: string
  user_a_email: string
  user_b_email: string | null
  invite_token: string
  status: PairStatus
  created_at: string
  expires_at: string
  user_a_completed: boolean
  user_b_completed: boolean
  match_computed: boolean
}

export interface Answer {
  id: string
  user_id: string
  pair_id: string
  question_id: number
  choice: AnswerChoice
  created_at: string
}

export interface Match {
  id: string
  pair_id: string
  compatibility_score: number
  faith_score: number
  lifestyle_score: number
  family_score: number
  education_score: number
  social_score: number
  personality_score: number
  conflicts: number
  dealbreakers: number
  recommendations: string[]
  created_at: string
}

export interface Feedback {
  id: string
  pair_id: string
  user_email: string
  rating: number
  comment: string | null
  created_at: string
}

export interface Block {
  id: string
  email: string
  reason: string
  created_at: string
}

// ================== TYPES API ==================

export interface CreatePairRequest {
  userAEmail: string
  userBEmail?: string
}

export interface CreatePairResponse {
  pairId: string
  inviteUrl: string
  message: string
}

export interface SaveAnswersRequest {
  pairId: string
  answers: {
    questionId: number
    choice: AnswerChoice
  }[]
}

export interface SaveAnswersResponse {
  success: boolean
  message: string
  answersCount: number
}

export interface ComputeMatchRequest {
  pairId: string
}

export interface ComputeMatchResponse {
  success: boolean
  message: string
  match?: Match
}

export interface SendEmailRequest {
  type: 'invite' | 'results_ready' | 'reminder'
  email: string
  pairId: string
  data?: Record<string, any>
}

export interface SendEmailResponse {
  success: boolean
  message: string
  provider?: 'resend' | 'brevo'
}

// ================== TYPES COMPATIBILITÉ ==================

export interface CompatibilityScores {
  overall: number
  faith: number
  lifestyle: number
  family: number
  education: number
  social: number
  personality: number
}

export interface CompatibilityAnalysis {
  scores: CompatibilityScores
  conflicts: number
  dealbreakers: number
  strengths: string[]
  concerns: string[]
  recommendations: string[]
  detailedBreakdown: {
    category: QuestionCategory
    userAAnswers: AnswerChoice[]
    userBAnswers: AnswerChoice[]
    score: number
    agreements: number
    disagreements: number
  }[]
}

export interface MatchResult {
  pair: Pair
  analysis: CompatibilityAnalysis
  questionsData: Question[]
  userAAnswers: Answer[]
  userBAnswers: Answer[]
  completedAt: string
}

// ================== TYPES UI ==================

export interface QuestionnaireStep {
  questionId: number
  question: Question
  selectedChoice?: AnswerChoice
  isAnswered: boolean
}

export interface QuestionnaireProgress {
  currentStep: number
  totalSteps: number
  completedSteps: number
  percentageComplete: number
  categoryProgress: Record<QuestionCategory, {
    completed: number
    total: number
  }>
}

export interface ResultsDisplayData {
  overallScore: number
  categoryScores: Record<QuestionCategory, number>
  radarChartData: {
    category: string
    score: number
    fullMark: 100
  }[]
  strengthsAndConcerns: {
    strengths: string[]
    concerns: string[]
  }
  recommendations: string[]
  detailed: boolean
}

// ================== TYPES NAVIGATION ==================

export interface NavigationItem {
  label: string
  href: string
  icon?: string
  external?: boolean
}

export interface PageMetadata {
  title: string
  description: string
  keywords?: string[]
  image?: string
  canonical?: string
}

// ================== TYPES VALIDATION ==================

export interface ValidationResult {
  success: boolean
  error?: string
  data?: any
}

export interface FormErrors {
  [key: string]: string | undefined
}

// ================== TYPES EMAIL ==================

export interface EmailTemplate {
  subject: string
  html: string
  text?: string
}

export interface EmailConfig {
  provider: 'resend' | 'brevo'
  apiKey: string
  fromEmail: string
  fromName: string
}

export interface EmailSendResult {
  success: boolean
  messageId?: string
  error?: string
  provider: 'resend' | 'brevo'
}

// ================== TYPES CRYPTO ==================

export interface JwtPayload {
  pairId: string
  email: string
  iat: number
  exp: number
}

export interface TokenValidation {
  valid: boolean
  expired?: boolean
  payload?: JwtPayload
  error?: string
}

// ================== TYPES ANALYTICS ==================

export interface AnalyticsEvent {
  event: string
  pairId?: string
  userEmail?: string
  timestamp: string
  properties?: Record<string, any>
}

export interface UsageStatistics {
  totalPairs: number
  completedMatches: number
  averageScore: number
  averageCompletionTime: number
  categoryBreakdown: Record<QuestionCategory, {
    averageScore: number
    conflictRate: number
  }>
}

// ================== EXPORTS DES SCHÉMAS ZOD ==================

// Schémas de validation (définis dans validations.ts)
export type CreatePairSchema = z.infer<typeof import('./validations').createPairSchema>
export type SaveAnswersSchema = z.infer<typeof import('./validations').saveAnswersSchema>
export type ComputeMatchSchema = z.infer<typeof import('./validations').computeMatchSchema>
export type SendEmailSchema = z.infer<typeof import('./validations').sendEmailSchema>
export type FeedbackSchema = z.infer<typeof import('./validations').feedbackSchema>

// ================== TYPES UTILITAIRES ==================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// ================== CONSTANTES TYPES ==================

export const QUESTION_CATEGORIES: QuestionCategory[] = [
  'faith', 'lifestyle', 'family', 'education', 'social', 'personality'
]

export const ANSWER_CHOICES: AnswerChoice[] = ['A', 'B', 'C', 'D']

export const PAIR_STATUSES: PairStatus[] = ['pending', 'active', 'completed', 'expired']

export const USER_ROLES: UserRole[] = ['user', 'admin']

// ================== TYPES GUARDS ==================

export function isValidAnswerChoice(choice: string): choice is AnswerChoice {
  return ANSWER_CHOICES.includes(choice as AnswerChoice)
}

export function isValidQuestionCategory(category: string): category is QuestionCategory {
  return QUESTION_CATEGORIES.includes(category as QuestionCategory)
}

export function isValidPairStatus(status: string): status is PairStatus {
  return PAIR_STATUSES.includes(status as PairStatus)
}

export function isValidUserRole(role: string): role is UserRole {
  return USER_ROLES.includes(role as UserRole)
}

// ================== TYPES ERREURS ==================

export class NikahScoreError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message)
    this.name = 'NikahScoreError'
  }
}

export class ValidationError extends NikahScoreError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends NikahScoreError {
  constructor(message: string = 'Non autorisé') {
    super(message, 'AUTHENTICATION_ERROR', 401)
    this.name = 'AuthenticationError'
  }
}

export class NotFoundError extends NikahScoreError {
  constructor(message: string = 'Ressource non trouvée') {
    super(message, 'NOT_FOUND_ERROR', 404)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends NikahScoreError {
  constructor(message: string = 'Conflit de données') {
    super(message, 'CONFLICT_ERROR', 409)
    this.name = 'ConflictError'
  }
}

export class RateLimitError extends NikahScoreError {
  constructor(message: string = 'Trop de requêtes') {
    super(message, 'RATE_LIMIT_ERROR', 429)
    this.name = 'RateLimitError'
  }
}
