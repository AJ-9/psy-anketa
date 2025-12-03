import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { AnalysisResult } from '@/types/questionnaire'

// Функция для экспорта через html2canvas (поддерживает кириллицу)
export async function exportToPDFFromElement(elementId: string, patientName?: string) {
  const element = document.getElementById(elementId)
  if (!element) {
    console.error('Element not found for PDF export')
    return
  }

  try {
    // Создаем временный контейнер для PDF с оптимальной шириной
    const tempContainer = document.createElement('div')
    tempContainer.id = 'pdf-export-temp'
    tempContainer.style.position = 'absolute'
    tempContainer.style.left = '-9999px'
    tempContainer.style.top = '0'
    tempContainer.style.width = '600px' // Оптимальная ширина для PDF (A4 в пикселях при 96 DPI)
    tempContainer.style.backgroundColor = '#ffffff'
    tempContainer.style.padding = '40px'
    tempContainer.style.fontSize = '14px'
    tempContainer.style.lineHeight = '1.6'
    tempContainer.style.color = '#000000'
    
    // Клонируем содержимое и адаптируем для PDF
    const clonedElement = element.cloneNode(true) as HTMLElement
    clonedElement.style.width = '100%'
    clonedElement.style.maxWidth = '100%'
    clonedElement.style.margin = '0'
    clonedElement.style.padding = '0'
    
    // Увеличиваем размеры шрифтов для читаемости
    const allTextElements = clonedElement.querySelectorAll('*')
    allTextElements.forEach((el) => {
      const htmlEl = el as HTMLElement
      const computedStyle = window.getComputedStyle(el)
      const fontSize = parseFloat(computedStyle.fontSize)
      if (fontSize < 16) {
        htmlEl.style.fontSize = `${Math.max(fontSize * 1.2, 14)}px`
      }
    })
    
    // Убираем градиенты и сложные стили для лучшей читаемости
    const cards = clonedElement.querySelectorAll('[class*="bg-gradient"], [class*="rounded"]')
    cards.forEach((card) => {
      const htmlCard = card as HTMLElement
      htmlCard.style.backgroundColor = '#f9fafb'
      htmlCard.style.border = '1px solid #e5e7eb'
    })
    
    tempContainer.appendChild(clonedElement)
    document.body.appendChild(tempContainer)

    const canvas = await html2canvas(tempContainer, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: 600,
      windowWidth: 600,
    })

    // Удаляем временный контейнер
    document.body.removeChild(tempContainer)

    const imgData = canvas.toDataURL('image/png', 1.0)
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    
    // Рассчитываем размеры с учетом отступов
    const margin = 10 // мм
    const contentWidth = pdfWidth - 2 * margin
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const ratio = contentWidth / imgWidth
    const scaledHeight = imgHeight * ratio
    const scaledWidth = contentWidth
    
    let heightLeft = scaledHeight
    let position = margin

    pdf.addImage(imgData, 'PNG', margin, position, scaledWidth, scaledHeight)
    heightLeft -= (pdfHeight - 2 * margin)

    while (heightLeft > 0) {
      position = margin - (scaledHeight - heightLeft)
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', margin, position, scaledWidth, scaledHeight)
      heightLeft -= (pdfHeight - 2 * margin)
    }
    
    const fileName = patientName 
      ? `psy-anketa-${patientName.replace(/\s+/g, '-')}-${Date.now()}.pdf`
      : `psy-anketa-${Date.now()}.pdf`
    pdf.save(fileName)
  } catch (error) {
    console.error('Error exporting PDF:', error)
    alert('Ошибка при экспорте PDF. Попробуйте еще раз.')
  }
}

// Старая функция для совместимости (использует Unicode-совместимый подход)
export function exportToPDF(analysis: AnalysisResult, patientName?: string) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  let yPos = 20
  const margin = 20
  const lineHeight = 7
  const sectionSpacing = 10

  // Заголовок
  doc.setFontSize(18)
  doc.setTextColor(37, 99, 235) // blue-600
  doc.setFont('helvetica', 'bold')
  const titleLines = doc.splitTextToSize('Результаты психологического анкетирования', pageWidth - 2 * margin)
  doc.text(titleLines, margin, yPos)
  yPos += titleLines.length * 8 + 8

  if (patientName) {
    doc.setFontSize(13)
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'bold')
    doc.text(`Пациент: ${patientName}`, margin, yPos)
    yPos += 8
  }

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  doc.text(`Дата: ${new Date().toLocaleDateString('ru-RU')}`, margin, yPos)
  yPos += sectionSpacing

  // Резюме
  doc.setFontSize(15)
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'bold')
  doc.text('Краткое резюме', margin, yPos)
  yPos += lineHeight + 2

  doc.setFontSize(11) // Увеличили размер шрифта
  doc.setFont('helvetica', 'normal')
  const summaryLines = doc.splitTextToSize(analysis.summary, pageWidth - 2 * margin)
  doc.text(summaryLines, margin, yPos)
  yPos += summaryLines.length * lineHeight + sectionSpacing

  // Проверка на новую страницу
  if (yPos > pageHeight - 40) {
    doc.addPage()
    yPos = 20
  }

  // Тип личности
  doc.setFontSize(15)
  doc.setFont('helvetica', 'bold')
  doc.text('Тип личности', margin, yPos)
  yPos += lineHeight + 2

  const personalityNames = {
    melancholic: 'Меланхолик',
    choleric: 'Холерик',
    sanguine: 'Сангвиник',
    phlegmatic: 'Флегматик',
    mixed: 'Смешанный тип',
  }

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text(personalityNames[analysis.personalityType], margin, yPos)
  yPos += lineHeight

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text(`Уверенность: ${analysis.personalityTypeConfidence}%`, margin, yPos)
  yPos += lineHeight + 2

  if (analysis.dominantTraits.length > 0) {
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('Доминирующие черты:', margin, yPos)
    yPos += lineHeight
    doc.setFont('helvetica', 'normal')
    analysis.dominantTraits.forEach(trait => {
      doc.text(`• ${trait}`, margin + 5, yPos)
      yPos += lineHeight - 1
    })
  }
  yPos += sectionSpacing

  // Проверка на новую страницу
  if (yPos > pageHeight - 40) {
    doc.addPage()
    yPos = 20
  }

  // Истинный запрос
  doc.setFontSize(15)
  doc.setFont('helvetica', 'bold')
  doc.text('Истинный запрос', margin, yPos)
  yPos += lineHeight + 2

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  const requestLines = doc.splitTextToSize(analysis.trueRequest, pageWidth - 2 * margin)
  doc.text(requestLines, margin, yPos)
  yPos += requestLines.length * lineHeight + sectionSpacing

  // Психологические индикаторы
  doc.setFontSize(15)
  doc.setFont('helvetica', 'bold')
  doc.text('Психологические индикаторы', margin, yPos)
  yPos += lineHeight + 2

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
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
      yPos += lineHeight - 1
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
    doc.setFontSize(15)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(220, 38, 38) // red-600
    doc.text('Факторы риска', margin, yPos)
    yPos += lineHeight + 2

    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    analysis.riskFactors.forEach(factor => {
      const factorLines = doc.splitTextToSize(`⚠ ${factor}`, pageWidth - 2 * margin - 10)
      doc.text(factorLines, margin + 5, yPos)
      yPos += factorLines.length * lineHeight
    })
    yPos += sectionSpacing
  }

  // Сильные стороны
  if (analysis.strengths.length > 0) {
    doc.setFontSize(15)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(34, 197, 94) // green-600
    doc.text('Сильные стороны', margin, yPos)
    yPos += lineHeight + 2

    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    analysis.strengths.forEach(strength => {
      const strengthLines = doc.splitTextToSize(`✓ ${strength}`, pageWidth - 2 * margin - 10)
      doc.text(strengthLines, margin + 5, yPos)
      yPos += strengthLines.length * lineHeight
    })
    yPos += sectionSpacing
  }

  // Проверка на новую страницу
  if (yPos > pageHeight - 60) {
    doc.addPage()
    yPos = 20
  }

  // Рекомендации
  doc.setFontSize(15)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text('Рекомендации', margin, yPos)
  yPos += lineHeight + 2

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  analysis.recommendations.forEach((rec, index) => {
    // Проверка на новую страницу перед каждой рекомендацией
    if (yPos > pageHeight - 40) {
      doc.addPage()
      yPos = margin
    }

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    const titleLines = doc.splitTextToSize(`${index + 1}. ${rec.title}`, pageWidth - 2 * margin)
    doc.text(titleLines, margin, yPos)
    yPos += titleLines.length * lineHeight + 2

    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    const descLines = doc.splitTextToSize(rec.description, pageWidth - 2 * margin)
    doc.text(descLines, margin, yPos)
    yPos += descLines.length * lineHeight + 2

    if (rec.scientificBasis) {
      doc.setFontSize(9)
      doc.setTextColor(100, 100, 100)
      const basisLines = doc.splitTextToSize(rec.scientificBasis, pageWidth - 2 * margin - 5)
      doc.text(basisLines, margin + 5, yPos)
      yPos += basisLines.length * lineHeight + 4
      doc.setFontSize(11)
      doc.setTextColor(0, 0, 0)
    } else {
      yPos += 4
    }
  })

  // Сохраняем PDF
  const fileName = patientName 
    ? `psy-anketa-${patientName.replace(/\s+/g, '-')}-${Date.now()}.pdf`
    : `psy-anketa-${Date.now()}.pdf`
  doc.save(fileName)
}

