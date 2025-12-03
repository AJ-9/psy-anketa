import { create } from 'zustand'
import { Answer, QuestionnaireResponse, AnalysisResult, Question } from '@/types/questionnaire'
import { questionnaireQuestions, analyzeResponses } from '@/lib/questionnaire'

// Функция для фильтрации вопросов на основе условной логики
function getFilteredQuestions(answers: Map<string, Answer>): Question[] {
  return questionnaireQuestions
    .sort((a, b) => a.order - b.order)
    .filter((question) => {
      // Если вопрос имеет условие, проверяем его
      if (question.conditional) {
        const dependentAnswer = answers.get(question.conditional.questionId)
        if (!dependentAnswer) {
          // Если зависимый вопрос еще не отвечен, не показываем этот вопрос
          return false
        }
        const answerValue = dependentAnswer.value
        // Проверяем, соответствует ли ответ условию (игнорируем массивы)
        if (Array.isArray(answerValue)) {
          return false // Для multiple-choice вопросов не используем условную логику
        }
        return question.conditional.values.includes(answerValue as string | number | boolean)
      }
      // Если условия нет, показываем вопрос
      return true
    })
}

interface QuestionnaireState {
  currentQuestionIndex: number
  answers: Map<string, Answer>
  isCompleted: boolean
  analysis: AnalysisResult | null
  personalDataConsent: boolean
  consentDate: Date | null
  
  // Actions
  setAnswer: (questionId: string, value: Answer['value']) => void
  setPersonalDataConsent: (consent: boolean) => void
  nextQuestion: () => void
  previousQuestion: () => void
  goToQuestion: (index: number) => void
  completeQuestionnaire: () => Promise<void>
  reset: () => void
  
  // Getters
  getCurrentQuestion: () => Question | null
  getProgress: () => number
  getAllQuestions: () => Question[]
}

export const useQuestionnaireStore = create<QuestionnaireState>((set, get) => ({
  currentQuestionIndex: 0,
  answers: new Map(),
  isCompleted: false,
  analysis: null,
  personalDataConsent: false,
  consentDate: null,
  
  setAnswer: (questionId, value) => {
    const state = get()
    const answers = new Map(state.answers)
    answers.set(questionId, {
      questionId,
      value,
      timestamp: new Date(),
    })
    set({ answers })
    
    // После изменения ответа проверяем, нужно ли перейти к следующему вопросу
    // если текущий вопрос стал невидимым из-за условной логики
    const filteredQuestions = getFilteredQuestions(answers)
    const currentQuestion = filteredQuestions[state.currentQuestionIndex]
    
    // Если текущий вопрос больше не виден, переходим к следующему
    if (!currentQuestion && filteredQuestions.length > 0) {
      const nextIndex = Math.min(state.currentQuestionIndex, filteredQuestions.length - 1)
      set({ currentQuestionIndex: nextIndex })
    }
  },
  
  setPersonalDataConsent: (consent) => {
    set({ 
      personalDataConsent: consent,
      consentDate: consent ? new Date() : null
    })
  },
  
  nextQuestion: () => {
    const state = get()
    const filteredQuestions = getFilteredQuestions(state.answers)
    if (state.currentQuestionIndex < filteredQuestions.length - 1) {
      set({ currentQuestionIndex: state.currentQuestionIndex + 1 })
    }
  },
  
  previousQuestion: () => {
    const state = get()
    if (state.currentQuestionIndex > 0) {
      set({ currentQuestionIndex: state.currentQuestionIndex - 1 })
    }
  },
  
  goToQuestion: (index) => {
    const state = get()
    const filteredQuestions = getFilteredQuestions(state.answers)
    if (index >= 0 && index < filteredQuestions.length) {
      set({ currentQuestionIndex: index })
    }
  },
  
  completeQuestionnaire: async () => {
    const state = get()
    const answersArray = Array.from(state.answers.values())
    const analysis = analyzeResponses(answersArray)
    
    // Сохраняем в БД
    try {
      const demographics = {
        name: String(state.answers.get('demo-name')?.value || ''),
        age: String(state.answers.get('demo-age')?.value || ''),
        gender: String(state.answers.get('demo-gender')?.value || ''),
        education: String(state.answers.get('demo-education')?.value || ''),
        employment: String(state.answers.get('demo-employment')?.value || ''),
        relationshipStatus: String(state.answers.get('demo-relationship-status')?.value || ''),
      }
      
      await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: answersArray,
          analysis,
          demographics,
          personalDataConsent: state.personalDataConsent,
          consentDate: state.consentDate?.toISOString() || null,
          startedAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
        }),
      })
    } catch (error) {
      console.error('Failed to save response:', error)
      // Продолжаем даже если сохранение не удалось
    }
    
    set({ isCompleted: true, analysis })
  },
  
  reset: () => {
    set({
      currentQuestionIndex: 0,
      answers: new Map(),
      isCompleted: false,
      analysis: null,
      personalDataConsent: false,
      consentDate: null,
    })
  },
  
  getCurrentQuestion: () => {
    const state = get()
    const filteredQuestions = getFilteredQuestions(state.answers)
    return filteredQuestions[state.currentQuestionIndex] || null
  },
  
  getProgress: () => {
    const state = get()
    const filteredQuestions = getFilteredQuestions(state.answers)
    const answeredCount = filteredQuestions.filter(q => state.answers.has(q.id)).length
    return Math.round((answeredCount / filteredQuestions.length) * 100)
  },
  
  getAllQuestions: () => {
    const state = get()
    return getFilteredQuestions(state.answers)
  },
}))

