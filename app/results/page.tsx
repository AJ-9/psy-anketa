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

  if (!analysis) {
    return null
  }

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
            <p className="text-gray-700">{analysis.summary}</p>
          </div>

          {/* Personality Type */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Тип личности
            </h2>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-900">
                  {personalityNames[analysis.personalityType]}
                </h3>
                <span className="text-sm text-gray-600">
                  Уверенность: {analysis.personalityTypeConfidence}%
                </span>
              </div>
              <p className="text-gray-700 mb-4">
                {personalityDescriptions[analysis.personalityType]}
              </p>
              {analysis.dominantTraits.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Доминирующие черты:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.dominantTraits.map((trait, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* True Request */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Истинный запрос
            </h2>
            <div className="bg-green-50 rounded-lg p-6">
              <p className="text-lg text-gray-800">{analysis.trueRequest}</p>
            </div>
          </div>

          {/* Psychological Indicators */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Психологические индикаторы
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(analysis.psychologicalIndicators).map(([key, value]) => {
                if (typeof value !== 'number') return null
                const labels: Record<string, string> = {
                  anxietyLevel: 'Уровень тревоги',
                  depressionLevel: 'Уровень депрессии',
                  stressLevel: 'Уровень стресса',
                  selfEsteem: 'Самооценка',
                  socialSupport: 'Социальная поддержка',
                  copingSkills: 'Навыки совладания',
                  sleepQuality: 'Качество сна',
                  appetite: 'Аппетит',
                  concentration: 'Концентрация',
                  fatigue: 'Усталость',
                  irritability: 'Раздражительность',
                }
                
                // Определяем, является ли метрика "положительной" (высокое значение = хорошо)
                const positiveMetrics = [
                  'selfEsteem',
                  'socialSupport',
                  'copingSkills',
                  'sleepQuality',
                  'concentration',
                ]
                
                // Для аппетита: значение уже нормализовано (7 = хорошо, 5 = средне, 3 = плохо)
                const isPositive = positiveMetrics.includes(key)
                const isAppetite = key === 'appetite'
                
                // Определяем цвет
                let colorClass = 'bg-gray-500'
                if (isAppetite) {
                  // Для аппетита: 7 = хорошо (зеленый), 5 = средне (желтый), 3 = плохо (красный)
                  if (value >= 7) {
                    colorClass = 'bg-green-500'
                  } else if (value >= 5) {
                    colorClass = 'bg-yellow-500'
                  } else {
                    colorClass = 'bg-red-500'
                  }
                } else if (isPositive) {
                  // Для положительных метрик: высокое = хорошо (зеленый), низкое = плохо (красный)
                  if (value >= 7) {
                    colorClass = 'bg-green-500'
                  } else if (value >= 4) {
                    colorClass = 'bg-yellow-500'
                  } else {
                    colorClass = 'bg-red-500' // Низкие значения положительных метрик = плохо
                  }
                } else {
                  // Для отрицательных метрик: высокое = плохо (красный), низкое = хорошо (зеленый)
                  if (value >= 7) {
                    colorClass = 'bg-red-500'
                  } else if (value >= 4) {
                    colorClass = 'bg-yellow-500'
                  } else {
                    colorClass = 'bg-green-500'
                  }
                }
                
                return (
                  <div key={key} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {labels[key] || key}
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {value}/10
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${colorClass}`}
                        style={{ width: `${(value / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Risk Factors */}
          {analysis.riskFactors.length > 0 && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Факторы риска
              </h2>
              <div className="bg-red-50 rounded-lg p-6">
                <ul className="space-y-2">
                  {analysis.riskFactors.map((factor, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-500 mr-2">⚠</span>
                      <span className="text-gray-800">{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Strengths */}
          {analysis.strengths.length > 0 && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Сильные стороны
              </h2>
              <div className="bg-green-50 rounded-lg p-6">
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-800">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Рекомендации
            </h2>
            <div className="space-y-4">
              {analysis.recommendations.map((rec, index) => {
                const priorityColors = {
                  high: 'border-red-200 bg-red-50',
                  medium: 'border-yellow-200 bg-yellow-50',
                  low: 'border-blue-200 bg-blue-50',
                }
                const categoryLabels = {
                  immediate: 'Немедленные',
                  'short-term': 'Краткосрочные',
                  'long-term': 'Долгосрочные',
                  'self-help': 'Самостоятельная работа',
                  professional: 'Профессиональная помощь',
                }
                return (
                  <div
                    key={index}
                    className={`border-2 rounded-lg p-5 ${priorityColors[rec.priority]}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {rec.title}
                      </h3>
                      <span className="text-xs px-2 py-1 bg-white rounded-full text-gray-600">
                        {categoryLabels[rec.category]}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{rec.description}</p>
                    {rec.scientificBasis && (
                      <p className="text-xs text-gray-500 italic">
                        {rec.scientificBasis}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={async () => {
                try {
                  const resultsContent = document.getElementById('results-content')
                  if (resultsContent) {
                    await exportToPDFFromElement('results-content')
                  } else {
                    // Fallback к текстовому экспорту
                    exportToPDF(analysis)
                  }
                } catch (error) {
                  console.error('PDF export error:', error)
                  alert('Ошибка при экспорте PDF. Попробуйте еще раз.')
                }
              }}
              className="bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition-all"
            >
              📄 Экспорт в PDF
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
        </motion.div>
      </div>
    </div>
  )
}

