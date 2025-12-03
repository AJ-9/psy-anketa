'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useQuestionnaireStore } from '@/store/questionnaireStore'

export default function Home() {
  const router = useRouter()
  const reset = useQuestionnaireStore(state => state.reset)
  const setPersonalDataConsent = useQuestionnaireStore(state => state.setPersonalDataConsent)
  const [consentChecked, setConsentChecked] = useState(false)
  const [showConsentModal, setShowConsentModal] = useState(false)

  const handleStart = () => {
    if (!consentChecked) {
      setShowConsentModal(true)
      return
    }
    reset()
    setPersonalDataConsent(true)
    router.push('/questionnaire')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            PsyAnketa
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Онлайн справочник-анкетирование для психолога
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-6 mb-8"
        >
          <div className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Что вас ждет:
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span>Сбор анамнеза и психологического профиля</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span>Определение доминирующего типа личности</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span>Выявление истинного запроса пациента</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span>Анализ психологического состояния</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span>Персонализированные рекомендации</span>
              </li>
            </ul>
          </div>

          <div className="bg-purple-50 rounded-lg p-6">
            <p className="text-sm text-gray-600">
              <strong>Важно:</strong> Анкета займет около 10-15 минут. 
              Постарайтесь отвечать честно и подробно - это поможет получить 
              более точные результаты и рекомендации.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-4"
        >
          <button
            onClick={handleStart}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Начать анкетирование
          </button>
          <button
            onClick={() => router.push('/admin')}
            className="px-6 bg-gray-600 text-white font-semibold py-4 rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-700 transition-all duration-200"
          >
            Панель психолога
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}

