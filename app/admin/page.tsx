'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { exportToPDF } from '@/lib/pdfExport'
import { AnalysisResult } from '@/types/questionnaire'

interface Response {
  id: string
  createdAt: string
  completedAt: string | null
  answers: any[]
  analysis: AnalysisResult | null
  age?: string
  gender?: string
  patientName?: string
  patientEmail?: string
}

export default function AdminPage() {
  const router = useRouter()
  const [responses, setResponses] = useState<Response[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all')
  const [selectedResponse, setSelectedResponse] = useState<Response | null>(null)

  useEffect(() => {
    fetchResponses()
  }, [filter])

  const fetchResponses = async () => {
    try {
      setLoading(true)
      const completed = filter === 'completed' ? 'true' : filter === 'incomplete' ? 'false' : undefined
      const url = `/api/responses${completed ? `?completed=${completed}` : ''}`
      const res = await fetch(url)
      const data = await res.json()
      setResponses(data.responses || [])
    } catch (error) {
      console.error('Error fetching responses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportPDF = (response: Response) => {
    if (response.analysis) {
      exportToPDF(response.analysis, response.patientName || undefined)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Загрузка...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Панель психолога
              </h1>
              <p className="text-gray-600">
                Управление анкетами и результатами пациентов
              </p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
            >
              На главную
            </button>
          </div>

          {/* Фильтры */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Все ({responses.length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === 'completed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Завершенные ({responses.filter(r => r.completedAt).length})
            </button>
            <button
              onClick={() => setFilter('incomplete')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === 'incomplete'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Незавершенные ({responses.filter(r => !r.completedAt).length})
            </button>
          </div>

          {/* Список анкет */}
          <div className="space-y-4">
            {responses.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                Нет данных для отображения
              </div>
            ) : (
              responses.map((response) => (
                <motion.div
                  key={response.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all cursor-pointer"
                  onClick={() => setSelectedResponse(response)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {response.patientName || 'Анонимный пациент'}
                        </h3>
                        {response.completedAt ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Завершено
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            В процессе
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        {response.age && <p>Возраст: {response.age}</p>}
                        {response.gender && (
                          <p>
                            Пол:{' '}
                            {response.gender === 'male'
                              ? 'Мужской'
                              : response.gender === 'female'
                              ? 'Женский'
                              : 'Другой'}
                          </p>
                        )}
                        <p>Создано: {formatDate(response.createdAt)}</p>
                        {response.completedAt && (
                          <p>Завершено: {formatDate(response.completedAt)}</p>
                        )}
                        {response.analysis && (
                          <p className="text-blue-600 font-medium">
                            Тип личности:{' '}
                            {response.analysis.personalityType === 'melancholic'
                              ? 'Меланхолик'
                              : response.analysis.personalityType === 'choleric'
                              ? 'Холерик'
                              : response.analysis.personalityType === 'sanguine'
                              ? 'Сангвиник'
                              : response.analysis.personalityType === 'phlegmatic'
                              ? 'Флегматик'
                              : 'Смешанный'}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {response.analysis && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleExportPDF(response)
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm"
                        >
                          📄 PDF
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedResponse(response)
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm"
                      >
                        Подробнее
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Модальное окно с деталями */}
        {selectedResponse && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedResponse(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Детали анкеты
                </h2>
                <button
                  onClick={() => setSelectedResponse(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {selectedResponse.analysis ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Резюме</h3>
                    <p className="text-gray-700">
                      {selectedResponse.analysis.summary}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Истинный запрос
                    </h3>
                    <p className="text-gray-700">
                      {selectedResponse.analysis.trueRequest}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Психологические индикаторы
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(
                        selectedResponse.analysis.psychologicalIndicators
                      ).map(([key, value]) => {
                        if (typeof value !== 'number') return null
                        const labels: Record<string, string> = {
                          anxietyLevel: 'Уровень тревоги',
                          depressionLevel: 'Уровень депрессии',
                          stressLevel: 'Уровень стресса',
                          selfEsteem: 'Самооценка',
                          socialSupport: 'Социальная поддержка',
                          copingSkills: 'Навыки совладания',
                        }
                        return (
                          <div key={key} className="bg-gray-50 p-3 rounded">
                            <p className="text-sm text-gray-600">
                              {labels[key] || key}
                            </p>
                            <p className="text-lg font-bold">{value}/10</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {selectedResponse.analysis.riskFactors.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-red-600">
                        Факторы риска
                      </h3>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedResponse.analysis.riskFactors.map(
                          (factor, i) => (
                            <li key={i} className="text-gray-700">
                              {factor}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      onClick={() => handleExportPDF(selectedResponse)}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                    >
                      Экспорт в PDF
                    </button>
                    <button
                      onClick={() => setSelectedResponse(null)}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
                    >
                      Закрыть
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">
                    Анкета еще не завершена. Ответов: {selectedResponse.answers.length}
                  </p>
                  <button
                    onClick={() => setSelectedResponse(null)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
                  >
                    Закрыть
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

