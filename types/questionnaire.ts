// Типы вопросов анкеты
export type QuestionType = 
  | 'single-choice'      // Один вариант ответа
  | 'multiple-choice'    // Несколько вариантов
  | 'text'               // Текстовый ответ
  | 'scale'              // Шкала (1-10, например)
  | 'yes-no'             // Да/Нет

export interface QuestionOption {
  id: string
  text: string
  value: string | number
  // Для анализа - какие типы личности/состояния связаны с этим ответом
  personalityTraits?: string[]
  psychologicalIndicators?: string[]
}

export interface Question {
  id: string
  type: QuestionType
  text: string
  description?: string
  required: boolean
  options?: QuestionOption[]
  // Для шкалы
  min?: number
  max?: number
  step?: number
  // Категория вопроса (для группировки)
  category: QuestionCategory
  // Порядок отображения
  order: number
}

export type QuestionCategory = 
  | 'demographics'           // Демография
  | 'family-history'        // Семейный анамнез
  | 'medical-history'       // Медицинский анамнез
  | 'current-symptoms'     // Текущие симптомы
  | 'personality-traits'    // Черты личности
  | 'relationships'         // Отношения
  | 'work-stress'           // Работа и стресс
  | 'life-events'           // Жизненные события
  | 'coping-mechanisms'     // Механизмы совладания
  | 'presenting-complaint'  // Истинный запрос

export interface Answer {
  questionId: string
  value: string | number | string[] | boolean
  timestamp: Date
}

export interface QuestionnaireResponse {
  id: string
  answers: Answer[]
  startedAt: Date
  completedAt?: Date
  // Результаты анализа
  analysis?: AnalysisResult
}

// Типы личности (можно расширить)
export type PersonalityType = 
  | 'melancholic'      // Меланхолик
  | 'choleric'         // Холерик
  | 'sanguine'         // Сангвиник
  | 'phlegmatic'       // Флегматик
  | 'mixed'            // Смешанный тип

// Психологические индикаторы
export interface PsychologicalIndicators {
  anxietyLevel: number          // 0-10
  depressionLevel: number       // 0-10
  stressLevel: number           // 0-10
  selfEsteem: number            // 0-10
  socialSupport: number         // 0-10
  copingSkills: number          // 0-10
  // Дополнительные индикаторы
  [key: string]: number | string
}

// Результат анализа
export interface AnalysisResult {
  personalityType: PersonalityType
  personalityTypeConfidence: number  // 0-100%
  dominantTraits: string[]
  psychologicalIndicators: PsychologicalIndicators
  trueRequest: string              // Выявленный истинный запрос
  riskFactors: string[]            // Факторы риска
  strengths: string[]              // Сильные стороны
  recommendations: Recommendation[]
  summary: string                  // Краткое резюме
}

export interface Recommendation {
  category: 'immediate' | 'short-term' | 'long-term' | 'self-help' | 'professional'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  scientificBasis?: string        // Ссылка на научное обоснование
}

