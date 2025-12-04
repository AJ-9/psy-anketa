'use client'

import { useEffect, useState, useCallback } from 'react'
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
  personalDataConsent?: boolean
  consentDate?: string | null
}

export default function AdminPage() {
  const router = useRouter()
  const [responses, setResponses] = useState<Response[]>([])
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedResponse, setSelectedResponse] = useState<Response | null>(null)

  const fetchResponses = useCallback(async () => {
    try {
      setLoading(true)
      const completed = filter === 'completed' ? 'true' : filter === 'incomplete' ? 'false' : undefined
      const url = `/api/responses${completed ? `?completed=${completed}` : ''}`
      console.log('Fetching responses from:', url)
      const res = await fetch(url)
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Failed to fetch responses:', res.status, errorData)
        
        // Показываем более понятное сообщение об ошибке
        let errorMessage = errorData.error || res.statusText
        if (errorData.details) {
          errorMessage += `: ${errorData.details}`
        }
        if (errorData.hint) {
          errorMessage += `\n\nПодсказка: ${errorData.hint}`
        }
        
        alert(`Ошибка при загрузке анкет: ${errorMessage}`)
        setResponses([]) // Очищаем список при ошибке
        return
      }
      
      const data = await res.json()
      console.log('Fetched responses:', data.responses?.length || 0, 'total:', data.total)
      setResponses(data.responses || [])
    } catch (error) {
      console.error('Error fetching responses:', error)
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка'
      alert(`Ошибка при загрузке анкет: ${errorMessage}\n\nВозможно, база данных не настроена. Проверьте настройки в Vercel Dashboard.`)
      setResponses([]) // Очищаем список при ошибке
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    // Проверяем аутентификацию
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check')
        const data = await res.json()
        if (data.authenticated) {
          setAuthenticated(true)
          fetchResponses()
        } else {
          setAuthenticated(false)
          router.push('/admin/login')
        }
      } catch (error) {
        console.error('Auth check error:', error)
        setAuthenticated(false)
        router.push('/admin/login')
      }
    }
    checkAuth()
  }, [router, fetchResponses])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (authenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Проверка доступа...</p>
      </div>
    )
  }

  if (authenticated === false) {
    return null
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
            <div className="flex gap-2">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
              >
                Выйти
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
              >
                На главную
              </button>
            </div>
          </div>

          {/* Поиск по ФИО */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск по ФИО пациента..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
                className="w-full px-4 py-3 pl-10 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-all text-gray-900 placeholder:text-gray-400 bg-white"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
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
            {(() => {
              // Фильтруем результаты по поисковому запросу и статусу
              let filteredResponses = responses
              
              // Фильтр по статусу
              if (filter === 'completed') {
                filteredResponses = filteredResponses.filter(r => r.completedAt !== null)
              } else if (filter === 'incomplete') {
                filteredResponses = filteredResponses.filter(r => r.completedAt === null)
              }
              
              // Фильтр по поисковому запросу (ФИО)
              if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase().trim()
                filteredResponses = filteredResponses.filter(r => {
                  const patientName = (r.patientName || '').toLowerCase()
                  return patientName.includes(query)
                })
              }
              
              if (filteredResponses.length === 0) {
                return (
                  <div className="text-center py-12 text-gray-500">
                    {searchQuery.trim() 
                      ? `Не найдено анкет по запросу "${searchQuery}"`
                      : 'Нет данных для отображения'}
                  </div>
                )
              }
              
              return (
                <>
                  {searchQuery.trim() && (
                    <div className="text-sm text-gray-600 mb-4 px-2">
                      Найдено анкет: <span className="font-semibold">{filteredResponses.length}</span>
                    </div>
                  )}
                  {filteredResponses.map((response) => (
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
                  ))}
                </>
              )
            })()}
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

              {/* Информация о согласии на обработку персональных данных */}
              <div className="mb-6 p-4 rounded-lg border-2">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  Согласие на обработку персональных данных
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                      selectedResponse.personalDataConsent ? 'bg-green-500' : 'bg-red-500'
                    }`}></span>
                    <span className="text-gray-700">
                      {selectedResponse.personalDataConsent 
                        ? 'Согласие получено' 
                        : 'Согласие не получено'}
                    </span>
                  </div>
                  {selectedResponse.consentDate && (
                    <p className="text-sm text-gray-600 ml-5">
                      Дата: {new Date(selectedResponse.consentDate).toLocaleString('ru-RU')}
                    </p>
                  )}
                  {!selectedResponse.personalDataConsent && (
                    <p className="text-sm text-red-600 ml-5">
                      ⚠️ Внимание: Согласие на обработку персональных данных не было получено
                    </p>
                  )}
                </div>
              </div>

              {selectedResponse.analysis ? (
                <div className="space-y-6">
                  {/* Показываем расширенный результат для психолога, если доступен */}
                  {selectedResponse.analysis.psychologistResult ? (
                    <>
                      {/* Расширенная характеристика личности */}
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
                        <h3 className="text-xl font-bold mb-4 text-gray-900">
                          Расширенная характеристика личности
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Тип личности</p>
                            <p className="text-lg font-semibold">
                              {selectedResponse.analysis.psychologistResult.personalityProfile.type === 'melancholic' ? 'Меланхолик' :
                               selectedResponse.analysis.psychologistResult.personalityProfile.type === 'choleric' ? 'Холерик' :
                               selectedResponse.analysis.psychologistResult.personalityProfile.type === 'sanguine' ? 'Сангвиник' :
                               selectedResponse.analysis.psychologistResult.personalityProfile.type === 'phlegmatic' ? 'Флегматик' :
                               'Смешанный тип'} ({selectedResponse.analysis.psychologistResult.personalityProfile.confidence}%)
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-2">Описание</p>
                            <p className="text-gray-700">
                              {selectedResponse.analysis.psychologistResult.personalityProfile.detailedDescription}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-2">Big Five профиль</p>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="bg-white p-2 rounded">
                                <p className="text-xs text-gray-600">Открытость</p>
                                <p className="font-bold">{selectedResponse.analysis.psychologistResult.personalityProfile.bigFiveProfile.openness.toFixed(1)}/10</p>
                              </div>
                              <div className="bg-white p-2 rounded">
                                <p className="text-xs text-gray-600">Добросовестность</p>
                                <p className="font-bold">{selectedResponse.analysis.psychologistResult.personalityProfile.bigFiveProfile.conscientiousness.toFixed(1)}/10</p>
                              </div>
                              <div className="bg-white p-2 rounded">
                                <p className="text-xs text-gray-600">Экстраверсия</p>
                                <p className="font-bold">{selectedResponse.analysis.psychologistResult.personalityProfile.bigFiveProfile.extraversion.toFixed(1)}/10</p>
                              </div>
                              <div className="bg-white p-2 rounded">
                                <p className="text-xs text-gray-600">Доброжелательность</p>
                                <p className="font-bold">{selectedResponse.analysis.psychologistResult.personalityProfile.bigFiveProfile.agreeableness.toFixed(1)}/10</p>
                              </div>
                              <div className="bg-white p-2 rounded">
                                <p className="text-xs text-gray-600">Нейротизм</p>
                                <p className="font-bold">{selectedResponse.analysis.psychologistResult.personalityProfile.bigFiveProfile.neuroticism.toFixed(1)}/10</p>
                              </div>
                            </div>
                          </div>
                          {selectedResponse.analysis.psychologistResult.personalityProfile.personalityStrengths.length > 0 && (
                            <div>
                              <p className="text-sm font-semibold text-gray-700 mb-2">Сильные стороны личности</p>
                              <ul className="list-disc list-inside space-y-1">
                                {selectedResponse.analysis.psychologistResult.personalityProfile.personalityStrengths.map((s, i) => (
                                  <li key={i} className="text-gray-700 text-sm">{s}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {selectedResponse.analysis.psychologistResult.personalityProfile.personalityChallenges.length > 0 && (
                            <div>
                              <p className="text-sm font-semibold text-gray-700 mb-2">Вызовы личности</p>
                              <ul className="list-disc list-inside space-y-1">
                                {selectedResponse.analysis.psychologistResult.personalityProfile.personalityChallenges.map((c, i) => (
                                  <li key={i} className="text-gray-700 text-sm">{c}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Клиническая оценка */}
                      <div className="bg-blue-50 rounded-lg p-6">
                        <h3 className="text-xl font-bold mb-4 text-gray-900">
                          Клиническая оценка
                        </h3>
                        <div className="space-y-4">
                          <div className="bg-white p-4 rounded">
                            <div className="flex justify-between items-center mb-2">
                              <p className="font-semibold">Тревога</p>
                              <span className={`px-3 py-1 rounded-full text-sm ${
                                selectedResponse.analysis.psychologistResult.psychologicalAnalysis.clinicalAssessment.anxietyLevel.severity === 'severe' ? 'bg-red-100 text-red-800' :
                                selectedResponse.analysis.psychologistResult.psychologicalAnalysis.clinicalAssessment.anxietyLevel.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {selectedResponse.analysis.psychologistResult.psychologicalAnalysis.clinicalAssessment.anxietyLevel.severity === 'severe' ? 'Высокая' :
                                 selectedResponse.analysis.psychologistResult.psychologicalAnalysis.clinicalAssessment.anxietyLevel.severity === 'moderate' ? 'Умеренная' :
                                 'Низкая'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {selectedResponse.analysis.psychologistResult.psychologicalAnalysis.clinicalAssessment.anxietyLevel.notes}
                            </p>
                          </div>
                          <div className="bg-white p-4 rounded">
                            <div className="flex justify-between items-center mb-2">
                              <p className="font-semibold">Депрессия</p>
                              <span className={`px-3 py-1 rounded-full text-sm ${
                                selectedResponse.analysis.psychologistResult.psychologicalAnalysis.clinicalAssessment.depressionLevel.severity === 'severe' ? 'bg-red-100 text-red-800' :
                                selectedResponse.analysis.psychologistResult.psychologicalAnalysis.clinicalAssessment.depressionLevel.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {selectedResponse.analysis.psychologistResult.psychologicalAnalysis.clinicalAssessment.depressionLevel.severity === 'severe' ? 'Высокая' :
                                 selectedResponse.analysis.psychologistResult.psychologicalAnalysis.clinicalAssessment.depressionLevel.severity === 'moderate' ? 'Умеренная' :
                                 'Низкая'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {selectedResponse.analysis.psychologistResult.psychologicalAnalysis.clinicalAssessment.depressionLevel.notes}
                            </p>
                          </div>
                          <div className="bg-white p-4 rounded">
                            <div className="flex justify-between items-center mb-2">
                              <p className="font-semibold">Общее психическое здоровье</p>
                              <span className={`px-3 py-1 rounded-full text-sm ${
                                selectedResponse.analysis.psychologistResult.psychologicalAnalysis.clinicalAssessment.overallMentalHealth === 'critical' ? 'bg-red-100 text-red-800' :
                                selectedResponse.analysis.psychologistResult.psychologicalAnalysis.clinicalAssessment.overallMentalHealth === 'concerning' ? 'bg-yellow-100 text-yellow-800' :
                                selectedResponse.analysis.psychologistResult.psychologicalAnalysis.clinicalAssessment.overallMentalHealth === 'fair' ? 'bg-orange-100 text-orange-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {selectedResponse.analysis.psychologistResult.psychologicalAnalysis.clinicalAssessment.overallMentalHealth === 'critical' ? 'Критическое' :
                                 selectedResponse.analysis.psychologistResult.psychologicalAnalysis.clinicalAssessment.overallMentalHealth === 'concerning' ? 'Вызывает беспокойство' :
                                 selectedResponse.analysis.psychologistResult.psychologicalAnalysis.clinicalAssessment.overallMentalHealth === 'fair' ? 'Удовлетворительное' :
                                 'Хорошее'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Оценка рисков */}
                      <div className="bg-red-50 rounded-lg p-6">
                        <h3 className="text-xl font-bold mb-4 text-gray-900">
                          Оценка рисков
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <p className="font-semibold mb-2">Уровень риска: 
                              <span className={`ml-2 px-3 py-1 rounded-full text-sm ${
                                selectedResponse.analysis.psychologistResult.psychologicalAnalysis.riskAssessment.riskLevel === 'critical' ? 'bg-red-500 text-white' :
                                selectedResponse.analysis.psychologistResult.psychologicalAnalysis.riskAssessment.riskLevel === 'high' ? 'bg-red-300 text-red-900' :
                                selectedResponse.analysis.psychologistResult.psychologicalAnalysis.riskAssessment.riskLevel === 'moderate' ? 'bg-yellow-300 text-yellow-900' :
                                'bg-green-300 text-green-900'
                              }`}>
                                {selectedResponse.analysis.psychologistResult.psychologicalAnalysis.riskAssessment.riskLevel === 'critical' ? 'КРИТИЧЕСКИЙ' :
                                 selectedResponse.analysis.psychologistResult.psychologicalAnalysis.riskAssessment.riskLevel === 'high' ? 'Высокий' :
                                 selectedResponse.analysis.psychologistResult.psychologicalAnalysis.riskAssessment.riskLevel === 'moderate' ? 'Умеренный' :
                                 'Низкий'}
                              </span>
                            </p>
                          </div>
                          {selectedResponse.analysis.psychologistResult.psychologicalAnalysis.riskAssessment.immediateRisks.length > 0 && (
                            <div>
                              <p className="font-semibold text-red-700 mb-2">Немедленные риски:</p>
                              <ul className="list-disc list-inside space-y-1">
                                {selectedResponse.analysis.psychologistResult.psychologicalAnalysis.riskAssessment.immediateRisks.map((r, i) => (
                                  <li key={i} className="text-gray-700">{r}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {selectedResponse.analysis.psychologistResult.psychologicalAnalysis.riskAssessment.longTermRisks.length > 0 && (
                            <div>
                              <p className="font-semibold text-orange-700 mb-2">Долгосрочные риски:</p>
                              <ul className="list-disc list-inside space-y-1">
                                {selectedResponse.analysis.psychologistResult.psychologicalAnalysis.riskAssessment.longTermRisks.map((r, i) => (
                                  <li key={i} className="text-gray-700">{r}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {selectedResponse.analysis.psychologistResult.psychologicalAnalysis.riskAssessment.protectiveFactors.length > 0 && (
                            <div>
                              <p className="font-semibold text-green-700 mb-2">Защитные факторы:</p>
                              <ul className="list-disc list-inside space-y-1">
                                {selectedResponse.analysis.psychologistResult.psychologicalAnalysis.riskAssessment.protectiveFactors.map((f, i) => (
                                  <li key={i} className="text-gray-700">{f}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Рекомендации для работы */}
                      <div className="bg-green-50 rounded-lg p-6">
                        <h3 className="text-xl font-bold mb-4 text-gray-900">
                          Рекомендации для работы
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <p className="font-semibold mb-2">Рекомендуемый подход:</p>
                            <ul className="list-disc list-inside space-y-1">
                              {selectedResponse.analysis.psychologistResult.therapeuticRecommendations.recommendedApproach.map((a, i) => (
                                <li key={i} className="text-gray-700">{a}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="font-semibold mb-2">Фокусные области:</p>
                            <ul className="list-disc list-inside space-y-1">
                              {selectedResponse.analysis.psychologistResult.therapeuticRecommendations.focusAreas.map((f, i) => (
                                <li key={i} className="text-gray-700">{f}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="font-semibold mb-2">Прогноз:</p>
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              selectedResponse.analysis.psychologistResult.therapeuticRecommendations.prognosis === 'good' ? 'bg-green-100 text-green-800' :
                              selectedResponse.analysis.psychologistResult.therapeuticRecommendations.prognosis === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {selectedResponse.analysis.psychologistResult.therapeuticRecommendations.prognosis === 'good' ? 'Благоприятный' :
                               selectedResponse.analysis.psychologistResult.therapeuticRecommendations.prognosis === 'moderate' ? 'Умеренный' :
                               'Осторожный'}
                            </span>
                          </div>
                          {selectedResponse.analysis.psychologistResult.therapeuticRecommendations.contraindications.length > 0 && (
                            <div>
                              <p className="font-semibold text-red-700 mb-2">Противопоказания:</p>
                              <ul className="list-disc list-inside space-y-1">
                                {selectedResponse.analysis.psychologistResult.therapeuticRecommendations.contraindications.map((c, i) => (
                                  <li key={i} className="text-gray-700">{c}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Дополнительная информация */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-xl font-bold mb-4 text-gray-900">
                          Дополнительная информация
                        </h3>
                        <div className="space-y-3 text-sm">
                          <div>
                            <p className="font-semibold text-gray-700">Истинный запрос:</p>
                            <p className="text-gray-600">{selectedResponse.analysis.psychologistResult.additionalNotes.trueRequest}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-700">Семейный анамнез:</p>
                            <p className="text-gray-600">{selectedResponse.analysis.psychologistResult.additionalNotes.familyHistory || 'Не указано'}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-700">Медицинский анамнез:</p>
                            <p className="text-gray-600">{selectedResponse.analysis.psychologistResult.additionalNotes.medicalHistory || 'Не указано'}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-700">Жизненные события:</p>
                            <p className="text-gray-600">{selectedResponse.analysis.psychologistResult.additionalNotes.lifeEvents || 'Не указано'}</p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Fallback к базовому результату, если расширенный недоступен */
                    <>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Резюме</h3>
                        <p className="text-gray-700">
                          {selectedResponse.analysis.summary}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Истинный запрос</h3>
                        <p className="text-gray-700">
                          {selectedResponse.analysis.trueRequest}
                        </p>
                      </div>
                    </>
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

