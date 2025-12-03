'use client'

import { Question, Answer } from '@/types/questionnaire'
import { useQuestionnaireStore } from '@/store/questionnaireStore'
import { motion } from 'framer-motion'

interface QuestionRendererProps {
  question: Question
}

export default function QuestionRenderer({ question }: QuestionRendererProps) {
  const setAnswer = useQuestionnaireStore(state => state.setAnswer)
  const answers = useQuestionnaireStore(state => state.answers)
  const currentAnswer = answers.get(question.id)?.value

  const handleAnswer = (value: Answer['value']) => {
    setAnswer(question.id, value)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          {question.text}
        </h2>
        {question.description && (
          <p className="text-gray-600 text-sm mb-4">{question.description}</p>
        )}
        {question.required && (
          <span className="text-red-500 text-sm">* Обязательный вопрос</span>
        )}
      </div>

      <div className="space-y-3">
        {question.type === 'single-choice' && question.options && (
          <div className="space-y-2">
            {question.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswer(option.value)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  currentAnswer === option.value
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                {option.text}
              </button>
            ))}
          </div>
        )}

        {question.type === 'multiple-choice' && question.options && (
          <div className="space-y-2">
            {question.options.map((option) => {
              const selectedValues = Array.isArray(currentAnswer) 
                ? currentAnswer 
                : []
              const isSelected = selectedValues.includes(String(option.value))
              
              return (
                <button
                  key={option.id}
                  onClick={() => {
                    const newValues = isSelected
                      ? selectedValues.filter(v => v !== String(option.value))
                      : [...selectedValues, String(option.value)]
                    handleAnswer(newValues)
                  }}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">{isSelected ? '✓' : '○'}</span>
                  {option.text}
                </button>
              )
            })}
          </div>
        )}

        {question.type === 'text' && (
          <textarea
            value={String(currentAnswer || '')}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder="Введите ваш ответ..."
            className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
            rows={5}
          />
        )}

        {question.type === 'scale' && (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{question.min || 0}</span>
              <span className="text-lg font-semibold text-gray-900">
                {currentAnswer !== undefined ? currentAnswer : '—'}
              </span>
              <span>{question.max || 10}</span>
            </div>
            <input
              type="range"
              min={question.min || 0}
              max={question.max || 10}
              step={question.step || 1}
              value={Number(currentAnswer) || question.min || 0}
              onChange={(e) => handleAnswer(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Минимум</span>
              <span>Максимум</span>
            </div>
          </div>
        )}

        {question.type === 'yes-no' && (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleAnswer(true)}
              className={`p-4 rounded-lg border-2 transition-all ${
                currentAnswer === true
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              Да
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className={`p-4 rounded-lg border-2 transition-all ${
                currentAnswer === false
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              Нет
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

