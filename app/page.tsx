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
              Постарайтесь отвечать честно и быстро - это поможет получить 
              более точные результаты и рекомендации.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          {/* Согласие на обработку персональных данных */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="mt-1 mr-3 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                required
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">
                  Я даю согласие на обработку персональных данных
                </span>
                <button
                  type="button"
                  onClick={() => setShowConsentModal(true)}
                  className="ml-2 text-blue-600 hover:text-blue-800 underline text-sm"
                >
                  (подробнее)
                </button>
                <p className="text-xs text-gray-600 mt-1">
                  В соответствии с Федеральным законом № 152-ФЗ «О персональных данных»
                </p>
              </div>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleStart}
              disabled={!consentChecked}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Начать анкетирование
            </button>
            <button
              onClick={() => router.push('/admin')}
              className="px-6 bg-gray-600 text-white font-semibold py-4 rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-700 transition-all duration-200"
            >
              Панель психолога
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Модальное окно с полным текстом согласия */}
      {showConsentModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowConsentModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Согласие на обработку персональных данных
              </h2>
              <button
                onClick={() => setShowConsentModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 text-sm text-gray-700">
                <p>
                  В соответствии с требованиями Федерального закона от 27.07.2006 № 152-ФЗ &laquo;О персональных данных&raquo;,
                  я даю свое согласие на обработку моих персональных данных.
                </p>

              <div>
                <h3 className="font-semibold mb-2">1. Персональные данные, на обработку которых дается согласие:</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Фамилия, имя, отчество</li>
                  <li>Возраст</li>
                  <li>Пол</li>
                  <li>Образование</li>
                  <li>Статус занятости</li>
                  <li>Семейное положение</li>
                  <li>Ответы на вопросы анкеты</li>
                  <li>Результаты психологического анализа</li>
                  <li>Контактные данные (при указании)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">2. Цели обработки персональных данных:</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Проведение психологического анкетирования</li>
                  <li>Анализ психологического состояния</li>
                  <li>Формирование рекомендаций</li>
                  <li>Ведение учета анкет в системе</li>
                  <li>Предоставление доступа психологу к результатам анкетирования</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. Способы обработки персональных данных:</h3>
                <p>
                  Обработка персональных данных осуществляется с использованием средств автоматизации и без использования таких средств,
                  включая сбор, запись, систематизацию, накопление, хранение, уточнение, извлечение, использование, передачу,
                  обезличивание, блокирование, удаление, уничтожение персональных данных.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">4. Срок действия согласия:</h3>
                <p>
                  Согласие действует до момента его отзыва субъектом персональных данных путем направления соответствующего уведомления.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">5. Права субъекта персональных данных:</h3>
                <p>
                  Я понимаю, что имею право на отзыв согласия на обработку персональных данных, право на доступ к своим персональным данным,
                  право на их исправление, удаление, а также другие права, предусмотренные Федеральным законом № 152-ФЗ &laquo;О персональных данных&raquo;.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mt-4">
                <p className="text-xs text-gray-600">
                  <strong>Важно:</strong> Нажимая кнопку &quot;Начать анкетирование&quot;, вы подтверждаете, что ознакомились с условиями
                  обработки персональных данных и даете свое согласие на их обработку.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setConsentChecked(true)
                  setShowConsentModal(false)
                }}
                className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-all"
              >
                Принимаю и даю согласие
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

