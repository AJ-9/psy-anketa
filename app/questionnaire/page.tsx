'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuestionnaireStore } from '@/store/questionnaireStore'
import QuestionRenderer from '@/components/QuestionRenderer'

export default function QuestionnairePage() {
  const router = useRouter()
  const {
    currentQuestionIndex,
    getCurrentQuestion,
    getAllQuestions,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    completeQuestionnaire,
    getProgress,
    answers,
    isCompleted,
    analysis,
  } = useQuestionnaireStore()

  const currentQuestion = getCurrentQuestion()
  const questions = getAllQuestions()
  const progress = getProgress()
  const currentAnswer = currentQuestion ? answers.get(currentQuestion.id) : null

  useEffect(() => {
    if (isCompleted && analysis) {
      router.push('/results')
    }
  }, [isCompleted, analysis, router])

  const handleNext = async () => {
    if (currentQuestionIndex === questions.length - 1) {
      await completeQuestionnaire()
    } else {
      nextQuestion()
    }
  }

  const handlePrevious = () => {
    previousQuestion()
  }

  const canProceed = currentQuestion 
    ? !currentQuestion.required || currentAnswer !== undefined
    : false

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Загрузка...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Вопрос {currentQuestionIndex + 1} из {questions.length}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6"
        >
          <QuestionRenderer question={currentQuestion} />
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              currentQuestionIndex === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ← Назад
          </button>

          {/* Question Navigation Dots */}
          <div className="flex gap-2 flex-wrap justify-center max-w-md">
            {questions.map((q, index) => {
              const isAnswered = answers.has(q.id)
              const isCurrent = index === currentQuestionIndex
              return (
                <button
                  key={q.id}
                  onClick={() => goToQuestion(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    isCurrent
                      ? 'bg-blue-500 scale-125'
                      : isAnswered
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                  title={`Вопрос ${index + 1}`}
                />
              )
            })}
          </div>

          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              canProceed
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transform hover:scale-105'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Завершить' : 'Далее →'}
          </button>
        </div>
      </div>
    </div>
  )
}

