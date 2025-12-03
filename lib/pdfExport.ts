import jsPDF from 'jspdf'
import { AnalysisResult } from '@/types/questionnaire'

export function exportToPDF(analysis: AnalysisResult, patientName?: string) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  let yPos = 20
  const margin = 20
  const lineHeight = 7
  const sectionSpacing = 10

  // Заголовок
  doc.setFontSize(20)
  doc.setTextColor(37, 99, 235) // blue-600
  doc.text('Результаты психологического анкетирования', margin, yPos)
  yPos += 10

  if (patientName) {
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text(`Пациент: ${patientName}`, margin, yPos)
    yPos += 8
  }

  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Дата: ${new Date().toLocaleDateString('ru-RU')}`, margin, yPos)
  yPos += sectionSpacing

  // Резюме
  doc.setFontSize(14)
  doc.setTextColor(0, 0, 0)
  doc.setFont(undefined, 'bold')
  doc.text('Краткое резюме', margin, yPos)
  yPos += lineHeight

  doc.setFontSize(10)
  doc.setFont(undefined, 'normal')
  const summaryLines = doc.splitTextToSize(analysis.summary, pageWidth - 2 * margin)
  doc.text(summaryLines, margin, yPos)
  yPos += summaryLines.length * lineHeight + sectionSpacing

  // Проверка на новую страницу
  if (yPos > pageHeight - 40) {
    doc.addPage()
    yPos = 20
  }

  // Тип личности
  doc.setFontSize(14)
  doc.setFont(undefined, 'bold')
  doc.text('Тип личности', margin, yPos)
  yPos += lineHeight

  const personalityNames = {
    melancholic: 'Меланхолик',
    choleric: 'Холерик',
    sanguine: 'Сангвиник',
    phlegmatic: 'Флегматик',
    mixed: 'Смешанный тип',
  }

  doc.setFontSize(11)
  doc.setFont(undefined, 'bold')
  doc.text(personalityNames[analysis.personalityType], margin, yPos)
  yPos += lineHeight

  doc.setFontSize(10)
  doc.setFont(undefined, 'normal')
  doc.text(`Уверенность: ${analysis.personalityTypeConfidence}%`, margin, yPos)
  yPos += lineHeight

  if (analysis.dominantTraits.length > 0) {
    doc.text('Доминирующие черты:', margin, yPos)
    yPos += lineHeight
    analysis.dominantTraits.forEach(trait => {
      doc.text(`• ${trait}`, margin + 5, yPos)
      yPos += lineHeight
    })
  }
  yPos += sectionSpacing

  // Проверка на новую страницу
  if (yPos > pageHeight - 40) {
    doc.addPage()
    yPos = 20
  }

  // Истинный запрос
  doc.setFontSize(14)
  doc.setFont(undefined, 'bold')
  doc.text('Истинный запрос', margin, yPos)
  yPos += lineHeight

  doc.setFontSize(10)
  doc.setFont(undefined, 'normal')
  doc.text(analysis.trueRequest, margin, yPos)
  yPos += lineHeight + sectionSpacing

  // Психологические индикаторы
  doc.setFontSize(14)
  doc.setFont(undefined, 'bold')
  doc.text('Психологические индикаторы', margin, yPos)
  yPos += lineHeight

  doc.setFontSize(10)
  doc.setFont(undefined, 'normal')
  Object.entries(analysis.psychologicalIndicators).forEach(([key, value]) => {
    if (typeof value === 'number') {
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
      const label = labels[key] || key
      doc.text(`${label}: ${value}/10`, margin, yPos)
      yPos += lineHeight
    }
  })
  yPos += sectionSpacing

  // Проверка на новую страницу
  if (yPos > pageHeight - 40) {
    doc.addPage()
    yPos = 20
  }

  // Факторы риска
  if (analysis.riskFactors.length > 0) {
    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.setTextColor(220, 38, 38) // red-600
    doc.text('Факторы риска', margin, yPos)
    yPos += lineHeight

    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    doc.setTextColor(0, 0, 0)
    analysis.riskFactors.forEach(factor => {
      doc.text(`⚠ ${factor}`, margin, yPos)
      yPos += lineHeight
    })
    yPos += sectionSpacing
  }

  // Сильные стороны
  if (analysis.strengths.length > 0) {
    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.setTextColor(34, 197, 94) // green-600
    doc.text('Сильные стороны', margin, yPos)
    yPos += lineHeight

    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    doc.setTextColor(0, 0, 0)
    analysis.strengths.forEach(strength => {
      doc.text(`✓ ${strength}`, margin, yPos)
      yPos += lineHeight
    })
    yPos += sectionSpacing
  }

  // Проверка на новую страницу
  if (yPos > pageHeight - 60) {
    doc.addPage()
    yPos = 20
  }

  // Рекомендации
  doc.setFontSize(14)
  doc.setFont(undefined, 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text('Рекомендации', margin, yPos)
  yPos += lineHeight

  doc.setFontSize(10)
  doc.setFont(undefined, 'normal')
  analysis.recommendations.forEach((rec, index) => {
    // Проверка на новую страницу перед каждой рекомендацией
    if (yPos > pageHeight - 30) {
      doc.addPage()
      yPos = 20
    }

    doc.setFont(undefined, 'bold')
    doc.text(`${index + 1}. ${rec.title}`, margin, yPos)
    yPos += lineHeight

    doc.setFont(undefined, 'normal')
    const descLines = doc.splitTextToSize(rec.description, pageWidth - 2 * margin)
    doc.text(descLines, margin, yPos)
    yPos += descLines.length * lineHeight

    if (rec.scientificBasis) {
      doc.setFontSize(8)
      doc.setTextColor(100, 100, 100)
      const basisLines = doc.splitTextToSize(rec.scientificBasis, pageWidth - 2 * margin)
      doc.text(basisLines, margin + 5, yPos)
      yPos += basisLines.length * lineHeight + 3
      doc.setFontSize(10)
      doc.setTextColor(0, 0, 0)
    } else {
      yPos += 3
    }
  })

  // Сохраняем PDF
  const fileName = patientName 
    ? `psy-anketa-${patientName.replace(/\s+/g, '-')}-${Date.now()}.pdf`
    : `psy-anketa-${Date.now()}.pdf`
  doc.save(fileName)
}

