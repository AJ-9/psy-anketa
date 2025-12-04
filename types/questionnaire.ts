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
  // Направление шкалы для цветовой кодировки
  scaleDirection?: 'positive' | 'negative' | 'neutral' // positive = высокое значение хорошо (зеленый), negative = высокое значение плохо (красный), neutral = среднее значение оптимально
  // Условное отображение вопроса
  conditional?: {
    questionId: string // ID вопроса, от которого зависит показ
    values: (string | number | boolean)[] // Значения, при которых вопрос показывается
  }
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
  | 'personality-traits'    // Черты личности (темперамент)
  | 'mbti'                  // MBTI (16 типов)
  | 'big-five'              // Big Five
  | 'holland'               // Типы Холланда (профориентация)
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

// Типы личности (темпераменты)
export type PersonalityType = 
  | 'melancholic'      // Меланхолик
  | 'choleric'         // Холерик
  | 'sanguine'         // Сангвиник
  | 'phlegmatic'       // Флегматик
  | 'mixed'            // Смешанный тип

// MBTI типы (16 типов по Юнгу)
export type MBTIType = 
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'  // Аналитики
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'  // Дипломаты
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'  // Хранители
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP'  // Искатели

// Типы Холланда (профориентация)
export type HollandType = 
  | 'realistic'      // Реалистичный (R)
  | 'investigative'  // Исследовательский (I)
  | 'artistic'       // Артистический (A)
  | 'social'         // Социальный (S)
  | 'enterprising'   // Предпринимательский (E)
  | 'conventional'   // Конвенциональный (C)

// Big Five профиль
export interface BigFiveProfile {
  openness: number           // Открытость опыту (0-100)
  conscientiousness: number  // Добросовестность (0-100)
  extraversion: number       // Экстраверсия (0-100)
  agreeableness: number      // Доброжелательность (0-100)
  neuroticism: number        // Нейротизм (0-100)
}

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

// Результат анализа (базовый)
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
  // Расширенные типологии
  mbtiType?: MBTIType              // MBTI тип
  mbtiConfidence?: number          // Уверенность в MBTI (0-100%)
  bigFive?: BigFiveProfile         // Big Five профиль
  hollandTypes?: Array<{           // Типы Холланда (топ 3)
    type: HollandType
    score: number
    description: string
  }>
  // Два варианта результатов
  patientResult?: PatientResult    // Упрощенный результат для пациента
  psychologistResult?: PsychologistResult  // Расширенный результат для психолога
}

// Упрощенный результат для пациента
export interface PatientResult {
  personalityType: PersonalityType
  personalityDescription: string
  mainIndicators: {
    label: string
    value: number
    status: 'good' | 'moderate' | 'needs_attention'
  }[]
  keyStrengths: string[]
  generalRecommendations: string[]  // Упрощенные рекомендации
  summary: string
  trueRequest?: string  // Истинный запрос пациента
  patientName?: string  // Имя пациента для отображения
  // Расширенные типологии (упрощенные для пациента)
  mbtiType?: MBTIType
  mbtiDescription?: string
  bigFive?: BigFiveProfile
  hollandTypes?: Array<{
    type: HollandType
    score: number
    description: string
  }>
}

// Расширенный результат для психолога
export interface PsychologistResult {
  // Расширенная характеристика личности
  personalityProfile: {
    type: PersonalityType
    confidence: number
    detailedDescription: string
    bigFiveProfile: {
      openness: number
      conscientiousness: number
      extraversion: number
      agreeableness: number
      neuroticism: number
    }
    dominantTraits: Array<{
      trait: string
      score: number
      description: string
    }>
    personalityStrengths: string[]
    personalityChallenges: string[]
  }
  
  // Глубокий психологический анализ
  psychologicalAnalysis: {
    clinicalAssessment: {
      anxietyLevel: { value: number; severity: 'mild' | 'moderate' | 'severe'; notes: string }
      depressionLevel: { value: number; severity: 'mild' | 'moderate' | 'severe'; notes: string }
      stressLevel: { value: number; severity: 'mild' | 'moderate' | 'severe'; notes: string }
      overallMentalHealth: 'good' | 'fair' | 'concerning' | 'critical'
    }
    detailedIndicators: Array<{
      name: string
      value: number
      interpretation: string
      clinicalSignificance: string
    }>
    riskAssessment: {
      immediateRisks: string[]
      longTermRisks: string[]
      protectiveFactors: string[]
      riskLevel: 'low' | 'moderate' | 'high' | 'critical'
    }
    copingMechanisms: {
      adaptive: string[]
      maladaptive: string[]
      effectiveness: number
      recommendations: string[]
    }
  }
  
  // Рекомендации для работы психолога
  therapeuticRecommendations: {
    recommendedApproach: string[]  // КПТ, ДПТ, гештальт и т.д.
    focusAreas: string[]
    sessionStructure: string[]
    interventions: Array<{
      intervention: string
      description: string
      timing: 'immediate' | 'short-term' | 'long-term'
      evidence: string
    }>
    contraindications: string[]
    prognosis: 'good' | 'moderate' | 'guarded'
  }
  
  // Дополнительная информация
  additionalNotes: {
    presentingComplaint: string
    trueRequest: string
    familyHistory: string
    medicalHistory: string
    lifeEvents: string
  }
}

export interface Recommendation {
  category: 'immediate' | 'short-term' | 'long-term' | 'self-help' | 'professional'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  scientificBasis?: string        // Ссылка на научное обоснование
}

