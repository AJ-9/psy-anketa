'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useQuestionnaireStore } from '@/store/questionnaireStore'
import { exportToPDF, exportToPDFFromElement } from '@/lib/pdfExport'

export default function ResultsPage() {
  const router = useRouter()
  const { analysis, reset } = useQuestionnaireStore()

  useEffect(() => {
    if (!analysis) {
      router.push('/')
    }
  }, [analysis, router])

  const handleRestart = () => {
    reset()
    router.push('/questionnaire')
  }

  const handleHome = () => {
    reset()
    router.push('/')
  }

  if (!analysis || !analysis.patientResult) {
    return null
  }

  const patientResult = analysis.patientResult

  const personalityNames = {
    melancholic: 'Меланхолик',
    choleric: 'Холерик',
    sanguine: 'Сангвиник',
    phlegmatic: 'Флегматик',
    mixed: 'Смешанный тип',
  }

  const personalityDescriptions = {
    melancholic: 'Вы склонны к глубоким переживаниям, аналитическому мышлению и внимательности к деталям.',
    choleric: 'Вы энергичны, решительны и склонны к лидерству. Эмоциональны и активны.',
    sanguine: 'Вы общительны, оптимистичны и легко адаптируетесь к новым ситуациям.',
    phlegmatic: 'Вы спокойны, уравновешены и надежны. Предпочитаете стабильность и порядок.',
    mixed: 'У вас сочетаются черты разных типов личности, что делает вас гибким и многогранным.',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6"
          id="results-content"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Результаты анализа
          </h1>
          <p className="text-gray-600 mb-6">
            Ваш психологический профиль готов
          </p>

          {/* Summary */}
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Краткое резюме
            </h2>
            <p className="text-gray-700">{patientResult.summary}</p>
          </div>

          {/* Personality Type */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Тип личности
            </h2>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {personalityNames[patientResult.personalityType]}
              </h3>
              <p className="text-gray-700 mb-4">
                {patientResult.personalityDescription}
              </p>
            </div>
          </div>

          {/* Main Indicators */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Основные показатели
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {patientResult.mainIndicators.map((indicator, index) => {
                const statusColors = {
                  good: 'bg-green-500',
                  moderate: 'bg-yellow-500',
                  needs_attention: 'bg-red-500',
                }
                const statusLabels = {
                  good: 'Хорошо',
                  moderate: 'Средне',
                  needs_attention: 'Требует внимания',
                }
                
                return (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {indicator.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700">
                          {statusLabels[indicator.status]}
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {indicator.value}/10
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${statusColors[indicator.status]}`}
                        style={{ width: `${(indicator.value / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Key Strengths */}
          {patientResult.keyStrengths.length > 0 && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Ваши сильные стороны
              </h2>
              <div className="bg-green-50 rounded-lg p-6">
                <ul className="space-y-2">
                  {patientResult.keyStrengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-800">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* General Recommendations */}
          {patientResult.generalRecommendations.length > 0 && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Рекомендации
              </h2>
              <div className="space-y-3">
                {patientResult.generalRecommendations.map((rec, index) => (
                  <div key={index} className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                    <p className="text-gray-800 font-medium">
                      {index + 1}. {rec}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={async () => {
              try {
                const resultsContent = document.getElementById('results-content')
                if (resultsContent) {
                  await exportToPDFFromElement('results-content')
                } else {
                  exportToPDF(analysis, undefined)
                }
              } catch (error) {
                console.error('PDF export error:', error)
                alert('Ошибка при экспорте PDF. Попробуйте еще раз.')
              }
            }}
            className="bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition-all"
          >
            📄 Скачать результаты (PDF)
          </button>
          <button
            onClick={handleRestart}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transition-all"
          >
            Пройти заново
          </button>
          <button
            onClick={handleHome}
            className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all"
          >
            На главную
          </button>
        </div>
      </div>
    </div>
  )
}
