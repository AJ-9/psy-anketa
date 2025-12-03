'use client'

import React from 'react'
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

        {question.type === 'scale' && (() => {
          const currentValue = Number(currentAnswer) || question.min || 0
          const min = question.min || 0
          const max = question.max || 10
          const direction = question.scaleDirection || 'positive'
          
          // Определяем цветовую схему в зависимости от направления шкалы
          let gradientStyle: React.CSSProperties
          
          if (direction === 'negative') {
            // Отрицательная шкала: высокое значение = плохо (красный), низкое = хорошо (зеленый)
            gradientStyle = {
              background: `linear-gradient(to right, 
                #10b981 0%, 
                #10b981 ${(min / max) * 100}%, 
                #f59e0b ${(5 / max) * 100}%, 
                #ef4444 ${(max / max) * 100}%)`
            }
          } else if (direction === 'neutral') {
            // Нейтральная шкала: среднее значение оптимально (зеленый в центре)
            const midPoint = (min + max) / 2
            gradientStyle = {
              background: `linear-gradient(to right, 
                #ef4444 0%, 
                #f59e0b ${((midPoint - 2) / max) * 100}%, 
                #10b981 ${(midPoint / max) * 100}%, 
                #10b981 ${((midPoint + 1) / max) * 100}%, 
                #f59e0b ${((midPoint + 2) / max) * 100}%, 
                #ef4444 100%)`
            }
          } else {
            // Положительная шкала: высокое значение = хорошо (зеленый), низкое = плохо (красный)
            gradientStyle = {
              background: `linear-gradient(to right, 
                #ef4444 0%, 
                #f59e0b ${(5 / max) * 100}%, 
                #10b981 ${(max / max) * 100}%)`
            }
          }
          
          // Определяем цвет текущего значения
          let valueColor = 'text-blue-600'
          if (direction === 'negative') {
            if (currentValue >= 7) valueColor = 'text-red-600'
            else if (currentValue >= 4) valueColor = 'text-yellow-600'
            else valueColor = 'text-green-600'
          } else if (direction === 'neutral') {
            const deviation = Math.abs(currentValue - 5)
            if (deviation <= 1) valueColor = 'text-green-600'
            else if (deviation <= 3) valueColor = 'text-yellow-600'
            else valueColor = 'text-red-600'
          } else {
            if (currentValue >= 7) valueColor = 'text-green-600'
            else if (currentValue >= 4) valueColor = 'text-yellow-600'
            else valueColor = 'text-red-600'
          }
          
          return (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <div className="text-left">
                  <span className="text-sm font-medium text-gray-700">{min}</span>
                  <p className="text-xs text-gray-500">Минимум</p>
                </div>
                <div className="text-center">
                  <span className={`text-2xl font-bold ${valueColor}`}>
                    {currentAnswer !== undefined ? currentAnswer : '—'}
                  </span>
                  <p className="text-xs text-gray-500">Текущее значение</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-700">{max}</span>
                  <p className="text-xs text-gray-500">Максимум</p>
                </div>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                step={question.step || 1}
                value={currentValue}
                onChange={(e) => handleAnswer(Number(e.target.value))}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                style={gradientStyle}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>{direction === 'negative' ? 'Хорошо' : direction === 'neutral' ? 'Низко' : 'Плохо'}</span>
                <span>Средне</span>
                <span>{direction === 'negative' ? 'Плохо' : direction === 'neutral' ? 'Высоко' : 'Хорошо'}</span>
              </div>
            </div>
          )
        })()}

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

