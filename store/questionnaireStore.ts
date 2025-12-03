import { create } from 'zustand'
import { Answer, QuestionnaireResponse, AnalysisResult, Question } from '@/types/questionnaire'
import { questionnaireQuestions, analyzeResponses } from '@/lib/questionnaire'

interface QuestionnaireState {
  currentQuestionIndex: number
  answers: Map<string, Answer>
  isCompleted: boolean
  analysis: AnalysisResult | null
  
  // Actions
  setAnswer: (questionId: string, value: Answer['value']) => void
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
  
  setAnswer: (questionId, value) => {
    const answers = new Map(get().answers)
    answers.set(questionId, {
      questionId,
      value,
      timestamp: new Date(),
    })
    set({ answers })
  },
  
  nextQuestion: () => {
    const state = get()
    const questions = questionnaireQuestions.sort((a, b) => a.order - b.order)
    if (state.currentQuestionIndex < questions.length - 1) {
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
    const questions = questionnaireQuestions.sort((a, b) => a.order - b.order)
    if (index >= 0 && index < questions.length) {
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
    })
  },
  
  getCurrentQuestion: () => {
    const state = get()
    const questions = questionnaireQuestions.sort((a, b) => a.order - b.order)
    return questions[state.currentQuestionIndex] || null
  },
  
  getProgress: () => {
    const state = get()
    const questions = questionnaireQuestions.sort((a, b) => a.order - b.order)
    const answeredCount = questions.filter(q => state.answers.has(q.id)).length
    return Math.round((answeredCount / questions.length) * 100)
  },
  
  getAllQuestions: () => {
    return questionnaireQuestions.sort((a, b) => a.order - b.order)
  },
}))

