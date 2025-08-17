// Types pour le système de questionnaire NikahScore

export interface Question {
  id: string
  axis: string
  label: string
  type: 'bool' | 'scale'
  weight: number
  is_dealbreaker: boolean
  order_index: number
  created_at: string
}

export interface QuestionAnswer {
  question_id: string
  value: number | boolean
  importance?: number
}

export interface SaveAnswerPayload {
  pair_id: string
  question_id: string
  respondent: 'A' | 'B'
  value: number | boolean
  importance?: number
}

export interface QuestionsApiResponse {
  success: boolean
  questions: Question[]
  total: number
}

export interface SaveAnswersApiResponse {
  success: boolean
  message: string
  saved_count: number
}
