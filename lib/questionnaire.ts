import { Question, QuestionCategory, Answer, AnalysisResult, PersonalityType, PsychologicalIndicators, Recommendation, PatientResult, PsychologistResult } from '@/types/questionnaire'

// База вопросов анкеты
export const questionnaireQuestions: Question[] = [
  // Демография
  {
    id: 'demo-name',
    type: 'text',
    text: 'Ваше ФИО (Фамилия Имя Отчество)?',
    required: true,
    category: 'demographics',
    order: 1,
  },
  {
    id: 'demo-age',
    type: 'text',
    text: 'Ваш возраст?',
    required: true,
    category: 'demographics',
    order: 2,
  },
  {
    id: 'demo-gender',
    type: 'single-choice',
    text: 'Ваш пол?',
    required: true,
    category: 'demographics',
    options: [
      { id: 'male', text: 'Мужской', value: 'male' },
      { id: 'female', text: 'Женский', value: 'female' },
      { id: 'other', text: 'Другой', value: 'other' },
    ],
    order: 3,
  },
  {
    id: 'demo-education',
    type: 'single-choice',
    text: 'Ваше образование?',
    required: true,
    category: 'demographics',
    options: [
      { id: 'school', text: 'Среднее', value: 'school' },
      { id: 'college', text: 'Среднее специальное', value: 'college' },
      { id: 'bachelor', text: 'Высшее (бакалавриат)', value: 'bachelor' },
      { id: 'master', text: 'Высшее (магистратура)', value: 'master' },
      { id: 'phd', text: 'Ученая степень', value: 'phd' },
    ],
    order: 4,
  },
  {
    id: 'demo-employment',
    type: 'single-choice',
    text: 'Ваш статус занятости?',
    required: true,
    category: 'demographics',
    options: [
      { id: 'employed', text: 'Работаю', value: 'employed' },
      { id: 'student', text: 'Учусь', value: 'student' },
      { id: 'unemployed', text: 'Не работаю', value: 'unemployed' },
      { id: 'retired', text: 'На пенсии', value: 'retired' },
      { id: 'freelance', text: 'Фриланс/самозанятый', value: 'freelance' },
    ],
    order: 5,
  },
  {
    id: 'demo-relationship-status',
    type: 'single-choice',
    text: 'Ваше семейное положение?',
    required: true,
    category: 'demographics',
    options: [
      { id: 'single', text: 'Сейчас не состою в отношениях', value: 'single' },
      { id: 'dating', text: 'В отношениях', value: 'dating' },
      { id: 'married', text: 'В браке', value: 'married' },
      { id: 'divorced', text: 'В разводе', value: 'divorced' },
      { id: 'widowed', text: 'Вдовец/вдова', value: 'widowed' },
    ],
    order: 5,
  },
  
  // Истинный запрос
  {
    id: 'presenting-complaint',
    type: 'text',
    text: 'Что привело вас к психологу? Опишите вашу ситуацию своими словами.',
    description: 'Постарайтесь быть максимально честными и подробными',
    required: true,
    category: 'presenting-complaint',
    order: 10,
  },
  
  // Текущие симптомы
  {
    id: 'symptoms-anxiety',
    type: 'scale',
    text: 'Как часто вы испытываете тревогу или беспокойство?',
    description: '0 - Никогда не испытываю тревогу. 5 - Иногда чувствую тревогу. 10 - Постоянно испытываю сильную тревогу.',
    required: true,
    category: 'current-symptoms',
    min: 0,
    max: 10,
    step: 1,
    scaleDirection: 'negative', // Высокое значение = плохо
    order: 20,
  },
  {
    id: 'symptoms-depression',
    type: 'scale',
    text: 'Насколько часто вы чувствуете подавленность или грусть?',
    description: '0 - Никогда не чувствую подавленность. 5 - Иногда чувствую грусть. 10 - Постоянно испытываю сильную подавленность.',
    required: true,
    category: 'current-symptoms',
    min: 0,
    max: 10,
    step: 1,
    scaleDirection: 'negative', // Высокое значение = плохо
    order: 21,
  },
  {
    id: 'symptoms-sleep',
    type: 'single-choice',
    text: 'Как вы оцениваете качество своего сна?',
    required: true,
    category: 'current-symptoms',
    options: [
      { id: 'excellent', text: 'Отлично', value: 'excellent' },
      { id: 'good', text: 'Хорошо', value: 'good' },
      { id: 'fair', text: 'Удовлетворительно', value: 'fair' },
      { id: 'poor', text: 'Плохо', value: 'poor' },
    ],
    order: 22,
  },
  {
    id: 'symptoms-appetite',
    type: 'scale',
    text: 'Как изменился ваш аппетит за последний месяц?',
    description: '0 - значительно снизился, 5 - без изменений, 10 - значительно увеличился',
    required: true,
    category: 'current-symptoms',
    min: 0,
    max: 10,
    step: 1,
    scaleDirection: 'neutral', // Среднее значение (5) оптимально
    order: 23,
  },
  {
    id: 'symptoms-concentration',
    type: 'scale',
    text: 'Как вы оцениваете свою способность концентрироваться?',
    description: '0 - Совсем не могу концентрироваться. 5 - Средняя способность к концентрации. 10 - Отличная способность концентрироваться.',
    required: true,
    category: 'current-symptoms',
    min: 0,
    max: 10,
    step: 1,
    scaleDirection: 'positive', // Высокое значение = хорошо
    order: 24,
  },
  {
    id: 'symptoms-fatigue',
    type: 'scale',
    text: 'Как часто вы чувствуете усталость или отсутствие энергии?',
    description: '0 - Никогда не чувствую усталость, полон энергии. 5 - Иногда чувствую усталость. 10 - Постоянно чувствую сильную усталость.',
    required: true,
    category: 'current-symptoms',
    min: 0,
    max: 10,
    step: 1,
    scaleDirection: 'negative', // Высокое значение = плохо
    order: 25,
  },
  {
    id: 'symptoms-irritability',
    type: 'scale',
    text: 'Насколько часто вы чувствуете раздражительность или гнев?',
    description: '0 - Никогда не чувствую раздражительность. 5 - Иногда раздражаюсь. 10 - Постоянно испытываю сильную раздражительность и гнев.',
    required: true,
    category: 'current-symptoms',
    min: 0,
    max: 10,
    step: 1,
    scaleDirection: 'negative', // Высокое значение = плохо
    order: 26,
  },
  {
    id: 'symptoms-physical-pain',
    type: 'yes-no',
    text: 'Испытываете ли вы физические боли без видимой причины?',
    required: true,
    category: 'current-symptoms',
    order: 27,
  },
  
  // Черты личности
  {
    id: 'personality-social',
    type: 'scale',
    text: 'Насколько вы общительны?',
    description: '0 - Полностью интроверт, предпочитаю одиночество. 5 - Умеренная общительность. 10 - Очень общительный, люблю быть в компании.',
    required: true,
    category: 'personality-traits',
    min: 0,
    max: 10,
    step: 1,
    scaleDirection: 'positive', // Высокое значение = хорошо
    order: 30,
  },
  {
    id: 'personality-emotional',
    type: 'scale',
    text: 'Насколько вы эмоциональны?',
    description: '0 - Очень сдержанный, редко показываю эмоции. 5 - Умеренная эмоциональность. 10 - Очень эмоциональный, ярко выражаю чувства.',
    required: true,
    category: 'personality-traits',
    min: 0,
    max: 10,
    step: 1,
    scaleDirection: 'positive', // Высокое значение = хорошо (нейтрально, но склоняемся к положительному)
    order: 31,
  },
  {
    id: 'personality-energy',
    type: 'scale',
    text: 'Как вы оцениваете свой уровень энергии?',
    description: '0 - Очень низкий уровень энергии, часто чувствую усталость. 5 - Средний уровень энергии. 10 - Высокий уровень энергии, всегда активен.',
    required: true,
    category: 'personality-traits',
    min: 0,
    max: 10,
    step: 1,
    scaleDirection: 'positive', // Высокое значение = хорошо
    order: 32,
  },
  {
    id: 'personality-openness',
    type: 'scale',
    text: 'Насколько вы открыты новому опыту?',
    description: '0 - Консервативен, не люблю перемены. 5 - Умеренно открыт новому. 10 - Очень открыт, люблю экспериментировать и пробовать новое.',
    required: true,
    category: 'personality-traits',
    min: 0,
    max: 10,
    step: 1,
    scaleDirection: 'positive', // Высокое значение = хорошо
    order: 33,
  },
  {
    id: 'personality-conscientiousness',
    type: 'scale',
    text: 'Насколько вы организованы и дисциплинированы?',
    description: '0 - Неорганизован, часто откладываю дела. 5 - Умеренная организованность. 10 - Очень организован, всегда планирую и выполняю задачи.',
    required: true,
    category: 'personality-traits',
    min: 0,
    max: 10,
    step: 1,
    scaleDirection: 'positive', // Высокое значение = хорошо
    order: 34,
  },
  {
    id: 'personality-agreeableness',
    type: 'scale',
    text: 'Насколько вы склонны к сотрудничеству и доверию?',
    description: '0 - Скептичен, не доверяю людям. 5 - Умеренное доверие. 10 - Очень доверчив, легко иду на сотрудничество.',
    required: true,
    category: 'personality-traits',
    min: 0,
    max: 10,
    step: 1,
    scaleDirection: 'positive', // Высокое значение = хорошо
    order: 35,
  },
  {
    id: 'personality-neuroticism',
    type: 'scale',
    text: 'Насколько вы склонны к переживаниям и беспокойству?',
    description: '0 - Очень спокоен, редко переживаю. 5 - Умеренная склонность к переживаниям. 10 - Очень тревожен, часто беспокоюсь.',
    required: true,
    category: 'personality-traits',
    min: 0,
    max: 10,
    step: 1,
    scaleDirection: 'negative', // Высокое значение = плохо
    order: 36,
  },
  
  // Семейный анамнез
  {
    id: 'family-mental-health',
    type: 'yes-no',
    text: 'Были ли в вашей семье случаи психических расстройств или обращения к психологам/психиатрам?',
    required: true,
    category: 'family-history',
    order: 40,
  },
  {
    id: 'family-substance-abuse',
    type: 'yes-no',
    text: 'Были ли в вашей семье проблемы с алкоголем или наркотиками?',
    required: true,
    category: 'family-history',
    order: 41,
  },
  {
    id: 'family-relationships',
    type: 'scale',
    text: 'Как вы оцениваете отношения в вашей семье в детстве?',
    description: '0 - Очень плохие отношения, много конфликтов. 5 - Средние отношения. 10 - Отличные, теплые и поддерживающие отношения.',
    required: true,
    category: 'family-history',
    min: 0,
    max: 10,
    step: 1,
    scaleDirection: 'positive', // Высокое значение = хорошо
    order: 42,
  },
  {
    id: 'family-trauma',
    type: 'yes-no',
    text: 'Переживали ли вы в детстве серьезные травмирующие события?',
    description: 'Это может включать физическое или эмоциональное насилие, потерю близких, развод родителей и т.д.',
    required: true,
    category: 'family-history',
    order: 43,
  },
  
  // Отношения
  {
    id: 'relationships-quality',
    type: 'scale',
    text: 'Как вы оцениваете качество ваших отношений с близкими?',
    description: '0 - Очень плохие отношения. 5 - Средние отношения. 10 - Отличные, доверительные и поддерживающие отношения.',
    required: true,
    category: 'relationships',
    min: 0,
    max: 10,
    step: 1,
    scaleDirection: 'positive', // Высокое значение = хорошо
    order: 50,
  },
  {
    id: 'relationships-partner',
    type: 'scale',
    text: 'Как вы оцениваете качество отношений с партнером?',
    description: 'Оцените качество ваших романтических отношений с партнером.',
    required: true,
    category: 'relationships',
    min: 0,
    max: 10,
    step: 1,
    scaleDirection: 'positive', // Высокое значение = хорошо
    conditional: {
      questionId: 'demo-relationship-status',
      values: ['dating', 'married'], // Показывать только если в отношениях или в браке
    },
    order: 51,
  },
  {
    id: 'relationships-single-satisfaction',
    type: 'scale',
    text: 'Как вы оцениваете свое удовлетворение от жизни без романтических отношений?',
    description: 'Оцените, насколько вы удовлетворены своей жизнью в данный момент, не имея романтических отношений.',
    required: true,
    category: 'relationships',
    min: 0,
    max: 10,
    step: 1,
    scaleDirection: 'positive', // Высокое значение = хорошо
    conditional: {
      questionId: 'demo-relationship-status',
      values: ['single', 'divorced', 'widowed'], // Показывать только если не в отношениях
    },
    order: 51, // Тот же порядок, но показывается условно
  },
  {
    id: 'relationships-friends',
    type: 'scale',
    text: 'Как вы оцениваете качество ваших дружеских отношений?',
    description: '0 - Нет друзей или очень плохие отношения. 5 - Есть друзья, отношения средние. 10 - Отличные дружеские отношения, много близких друзей.',
    required: true,
    category: 'relationships',
    min: 0,
    max: 10,
    step: 1,
    scaleDirection: 'positive', // Высокое значение = хорошо
    order: 52,
  },
  {
    id: 'relationships-loneliness',
    type: 'scale',
    text: 'Как часто вы чувствуете одиночество?',
    description: '0 - Никогда не чувствую одиночество. 5 - Иногда чувствую одиночество. 10 - Постоянно чувствую сильное одиночество.',
    required: true,
    category: 'relationships',
    min: 0,
    max: 10,
    step: 1,
    scaleDirection: 'negative', // Высокое значение = плохо
    order: 53,
  },
  {
    id: 'relationships-conflict',
    type: 'scale',
    text: 'Как часто у вас возникают конфликты с близкими?',
    description: '0 - Никогда не бывает конфликтов. 5 - Иногда возникают конфликты. 10 - Постоянные и серьезные конфликты.',
    required: true,
    category: 'relationships',
    min: 0,
    max: 10,
    step: 1,
    scaleDirection: 'negative', // Высокое значение = плохо
    order: 54,
  },
  
  // Работа и стресс
  {
    id: 'work-satisfaction',
    type: 'scale',
    text: 'Насколько вы удовлетворены своей работой/учебой?',
    description: '0 - Полностью неудовлетворен. 5 - Умеренная удовлетворенность. 10 - Полностью удовлетворен, люблю свою работу/учебу.',
    required: true,
    category: 'work-stress',
    min: 0,
    max: 10,
    step: 1,
    scaleDirection: 'positive', // Высокое значение = хорошо
    order: 60,
  },
  {
    id: 'work-stress',
    type: 'scale',
    text: 'Какой уровень стресса вы испытываете на работе/учебе?',
    description: '0 - Вообще нет стресса. 5 - Умеренный уровень стресса. 10 - Очень высокий уровень стресса, постоянное напряжение.',
    required: true,
    category: 'work-stress',
    min: 0,
    max: 10,
    step: 1,
    scaleDirection: 'negative', // Высокое значение = плохо
    order: 61,
  },
  {
    id: 'work-balance',
    type: 'scale',
    text: 'Как вы оцениваете баланс между работой и личной жизнью?',
    description: '0 - Полностью отсутствует баланс, работа занимает всё время. 5 - Умеренный баланс. 10 - Идеальный баланс, достаточно времени и для работы, и для личной жизни.',
    required: true,
    category: 'work-stress',
    min: 0,
    max: 10,
    step: 1,
    scaleDirection: 'positive', // Высокое значение = хорошо
    order: 62,
  },
  {
    id: 'work-burnout',
    type: 'scale',
    text: 'Испытываете ли вы симптомы выгорания (эмоциональное истощение, цинизм, снижение эффективности)?',
    description: '0 - Нет симптомов выгорания. 5 - Умеренные симптомы. 10 - Сильное выгорание, полное эмоциональное истощение.',
    required: true,
    category: 'work-stress',
    min: 0,
    max: 10,
    step: 1,
    scaleDirection: 'negative', // Высокое значение = плохо
    order: 63,
  },
  {
    id: 'work-future',
    type: 'scale',
    text: 'Как вы видите свое профессиональное будущее?',
    description: '0 - Очень пессимистично, не вижу перспектив. 5 - Нейтрально. 10 - Очень оптимистично, вижу много возможностей.',
    required: true,
    category: 'work-stress',
    min: 0,
    max: 10,
    step: 1,
    scaleDirection: 'positive', // Высокое значение = хорошо
    order: 64,
  },
  
  // Механизмы совладания
  {
    id: 'coping-strategies',
    type: 'multiple-choice',
    text: 'Какие способы вы используете для снятия стресса? (можно выбрать несколько)',
    required: false,
    category: 'coping-mechanisms',
    options: [
      { id: 'sport', text: 'Спорт/физическая активность', value: 'sport' },
      { id: 'hobbies', text: 'Хобби', value: 'hobbies' },
      { id: 'friends', text: 'Общение с друзьями', value: 'friends' },
      { id: 'alcohol', text: 'Алкоголь', value: 'alcohol' },
      { id: 'meditation', text: 'Медитация/релаксация', value: 'meditation' },
      { id: 'therapy', text: 'Психолог/терапия', value: 'therapy' },
      { id: 'reading', text: 'Чтение', value: 'reading' },
      { id: 'music', text: 'Музыка', value: 'music' },
      { id: 'sleep', text: 'Сон/отдых', value: 'sleep' },
      { id: 'shopping', text: 'Шопинг', value: 'shopping' },
      { id: 'food', text: 'Еда', value: 'food' },
      { id: 'other', text: 'Другое', value: 'other' },
    ],
    order: 70,
  },
  {
    id: 'coping-effectiveness',
    type: 'scale',
    text: 'Насколько эффективны ваши способы совладания со стрессом?',
    required: true,
    category: 'coping-mechanisms',
    min: 0,
    max: 10,
    step: 1,
    scaleDirection: 'positive', // Высокое значение = хорошо
    order: 71,
  },
  
  // Жизненные события
  {
    id: 'life-events-recent',
    type: 'multiple-choice',
    text: 'Какие значимые события произошли в вашей жизни за последний год? (можно выбрать несколько)',
    required: false,
    category: 'life-events',
    options: [
      { id: 'job-change', text: 'Смена работы', value: 'job-change' },
      { id: 'relationship-start', text: 'Начало отношений', value: 'relationship-start' },
      { id: 'relationship-end', text: 'Окончание отношений', value: 'relationship-end' },
      { id: 'marriage', text: 'Брак', value: 'marriage' },
      { id: 'divorce', text: 'Развод', value: 'divorce' },
      { id: 'birth', text: 'Рождение ребенка', value: 'birth' },
      { id: 'death', text: 'Потеря близкого', value: 'death' },
      { id: 'move', text: 'Переезд', value: 'move' },
      { id: 'illness', text: 'Серьезная болезнь', value: 'illness' },
      { id: 'financial', text: 'Финансовые проблемы', value: 'financial' },
      { id: 'none', text: 'Ничего значимого', value: 'none' },
    ],
    order: 80,
  },
  {
    id: 'life-events-stress',
    type: 'scale',
    text: 'Насколько стрессовыми были эти события для вас?',
    required: true,
    category: 'life-events',
    min: 0,
    max: 10,
    step: 1,
    scaleDirection: 'negative', // Высокое значение = плохо
    order: 81,
  },
  
  // Медицинский анамнез
  {
    id: 'medical-chronic',
    type: 'yes-no',
    text: 'Есть ли у вас хронические заболевания?',
    required: true,
    category: 'medical-history',
    order: 90,
  },
  {
    id: 'medical-medications',
    type: 'yes-no',
    text: 'Принимаете ли вы какие-либо лекарства регулярно?',
    required: true,
    category: 'medical-history',
    order: 91,
  },
  {
    id: 'medical-psychiatric',
    type: 'yes-no',
    text: 'Обращались ли вы ранее к психологу или психиатру?',
    required: true,
    category: 'medical-history',
    order: 92,
  },
  {
    id: 'medical-therapy',
    type: 'yes-no',
    text: 'Проходили ли вы психотерапию ранее?',
    required: true,
    category: 'medical-history',
    order: 93,
  },
]

// Функция анализа ответов с улучшенным алгоритмом
export function analyzeResponses(answers: Answer[]): AnalysisResult {
  const answerMap = new Map(answers.map(a => [a.questionId, a.value]))
  
  // Извлекаем значения симптомов
  const anxietyLevel = Number(answerMap.get('symptoms-anxiety') || 0)
  const depressionLevel = Number(answerMap.get('symptoms-depression') || 0)
  const sleepQuality = String(answerMap.get('symptoms-sleep') || 'fair')
  const appetiteChange = Number(answerMap.get('symptoms-appetite') || 5)
  const concentration = Number(answerMap.get('symptoms-concentration') || 5)
  const fatigue = Number(answerMap.get('symptoms-fatigue') || 5)
  const irritability = Number(answerMap.get('symptoms-irritability') || 5)
  const physicalPain = Boolean(answerMap.get('symptoms-physical-pain'))
  
  // Черты личности (Big Five + темперамент)
  const socialLevel = Number(answerMap.get('personality-social') || 5)
  const emotionalLevel = Number(answerMap.get('personality-emotional') || 5)
  const energyLevel = Number(answerMap.get('personality-energy') || 5)
  const openness = Number(answerMap.get('personality-openness') || 5)
  const conscientiousness = Number(answerMap.get('personality-conscientiousness') || 5)
  const agreeableness = Number(answerMap.get('personality-agreeableness') || 5)
  const neuroticism = Number(answerMap.get('personality-neuroticism') || 5)
  
  // Отношения
  const relationshipsQuality = Number(answerMap.get('relationships-quality') || 5)
  // Для partnerQuality проверяем оба вопроса (для тех, кто в отношениях и кто не в отношениях)
  const partnerQualityRaw = answerMap.get('relationships-partner') || answerMap.get('relationships-single-satisfaction') || 0
  const partnerQuality = Number(partnerQualityRaw)
  const friendsQuality = Number(answerMap.get('relationships-friends') || 5)
  const loneliness = Number(answerMap.get('relationships-loneliness') || 5)
  const conflictFrequency = Number(answerMap.get('relationships-conflict') || 5)
  
  // Работа и стресс
  const workSatisfaction = Number(answerMap.get('work-satisfaction') || 5)
  const workStress = Number(answerMap.get('work-stress') || 5)
  const workBalance = Number(answerMap.get('work-balance') || 5)
  const workBurnout = Number(answerMap.get('work-burnout') || 0)
  const workFuture = Number(answerMap.get('work-future') || 5)
  
  // Семейный анамнез
  const familyMentalHealth = Boolean(answerMap.get('family-mental-health'))
  const familySubstanceAbuse = Boolean(answerMap.get('family-substance-abuse'))
  const familyRelationships = Number(answerMap.get('family-relationships') || 5)
  const familyTrauma = Boolean(answerMap.get('family-trauma'))
  
  // Жизненные события
  const lifeEventsStress = Number(answerMap.get('life-events-stress') || 0)
  const lifeEvents = Array.isArray(answerMap.get('life-events-recent')) 
    ? answerMap.get('life-events-recent') as string[]
    : []
  
  // Механизмы совладания
  const copingStrategies = Array.isArray(answerMap.get('coping-strategies'))
    ? answerMap.get('coping-strategies') as string[]
    : []
  const copingEffectiveness = Number(answerMap.get('coping-effectiveness') || 5)
  
  // Медицинский анамнез
  const medicalChronic = Boolean(answerMap.get('medical-chronic'))
  const medicalMedications = Boolean(answerMap.get('medical-medications'))
  const medicalPsychiatric = Boolean(answerMap.get('medical-psychiatric'))
  const medicalTherapy = Boolean(answerMap.get('medical-therapy'))
  
  const presentingComplaint = String(answerMap.get('presenting-complaint') || '')
  
  // Улучшенный алгоритм определения типа личности
  // Используем взвешенную модель на основе темперамента и Big Five
  let personalityType: PersonalityType = 'mixed'
  let confidence = 50
  
  // Вычисляем веса для каждого типа
  const weights = {
    melancholic: 0,
    choleric: 0,
    sanguine: 0,
    phlegmatic: 0,
  }
  
  // Меланхолик: низкая энергия, высокая эмоциональность/нейротизм, низкая общительность
  weights.melancholic = 
    (10 - energyLevel) * 0.3 +
    emotionalLevel * 0.2 +
    neuroticism * 0.3 +
    (10 - socialLevel) * 0.2
  
  // Холерик: высокая энергия, высокая эмоциональность, средняя-высокая общительность
  weights.choleric =
    energyLevel * 0.3 +
    emotionalLevel * 0.3 +
    (socialLevel >= 5 ? socialLevel : 0) * 0.2 +
    (neuroticism >= 6 ? neuroticism : 0) * 0.2
  
  // Сангвиник: высокая энергия, средняя эмоциональность, высокая общительность, низкий нейротизм
  weights.sanguine =
    energyLevel * 0.3 +
    (emotionalLevel >= 4 && emotionalLevel <= 7 ? emotionalLevel : 0) * 0.2 +
    socialLevel * 0.3 +
    (10 - neuroticism) * 0.2
  
  // Флегматик: средняя энергия, низкая эмоциональность, средняя общительность, низкий нейротизм
  weights.phlegmatic =
    (energyLevel >= 4 && energyLevel <= 7 ? energyLevel : 0) * 0.25 +
    (10 - emotionalLevel) * 0.25 +
    (socialLevel >= 4 && socialLevel <= 7 ? socialLevel : 0) * 0.25 +
    (10 - neuroticism) * 0.25
  
  // Находим максимальный вес
  const maxWeight = Math.max(...Object.values(weights))
  const maxType = Object.entries(weights).find(([_, w]) => w === maxWeight)?.[0] as PersonalityType
  
  if (maxWeight >= 6) {
    personalityType = maxType
    confidence = Math.min(95, Math.round(maxWeight * 10))
  } else {
    personalityType = 'mixed'
    confidence = 50
  }
  
  // Определяем доминирующие черты (расширенный список)
  const dominantTraits: string[] = []
  if (socialLevel >= 7) dominantTraits.push('Общительность')
  if (socialLevel <= 3) dominantTraits.push('Интроверсия')
  if (emotionalLevel >= 7) dominantTraits.push('Эмоциональность')
  if (emotionalLevel <= 3) dominantTraits.push('Сдержанность')
  if (energyLevel >= 7) dominantTraits.push('Активность')
  if (energyLevel <= 3) dominantTraits.push('Низкая энергия')
  if (openness >= 7) dominantTraits.push('Открытость новому')
  if (conscientiousness >= 7) dominantTraits.push('Организованность')
  if (agreeableness >= 7) dominantTraits.push('Доброжелательность')
  if (neuroticism >= 7) dominantTraits.push('Высокая чувствительность')
  if (neuroticism <= 3) dominantTraits.push('Эмоциональная стабильность')
  
  // Улучшенные психологические индикаторы с учетом всех факторов
  const sleepScore = sleepQuality === 'excellent' ? 9 : sleepQuality === 'good' ? 7 : sleepQuality === 'fair' ? 5 : 2
  const appetiteScore = Math.abs(appetiteChange - 5) <= 2 ? 7 : Math.abs(appetiteChange - 5) <= 4 ? 5 : 3
  
  // Комплексная оценка самооценки
  const selfEsteemBase = 10 - depressionLevel - anxietyLevel / 2 - neuroticism / 3
  const selfEsteemAdjusted = Math.max(0, Math.min(10, 
    selfEsteemBase + 
    (relationshipsQuality - 5) * 0.2 +
    (workSatisfaction - 5) * 0.1 +
    (friendsQuality - 5) * 0.1
  ))
  
  // Оценка социальной поддержки
  const socialSupportScore = Math.round(
    (relationshipsQuality * 0.4 + 
     partnerQuality * 0.2 + 
     friendsQuality * 0.3 + 
     (10 - loneliness) * 0.1)
  )
  
  // Оценка навыков совладания
  const positiveCoping = ['sport', 'hobbies', 'friends', 'meditation', 'therapy', 'reading', 'music']
  const negativeCoping = ['alcohol', 'food', 'sleep']
  const positiveCopingCount = copingStrategies.filter(c => positiveCoping.includes(c)).length
  const negativeCopingCount = copingStrategies.filter(c => negativeCoping.includes(c)).length
  const copingSkillsScore = Math.min(10, Math.max(0,
    copingEffectiveness * 0.6 +
    positiveCopingCount * 0.8 -
    negativeCopingCount * 0.5
  ))
  
  // Общий уровень стресса
  const overallStress = Math.min(10, (
    workStress * 0.3 +
    anxietyLevel * 0.25 +
    depressionLevel * 0.2 +
    lifeEventsStress * 0.15 +
    conflictFrequency * 0.1
  ))
  
  const psychologicalIndicators: PsychologicalIndicators = {
    anxietyLevel,
    depressionLevel,
    stressLevel: overallStress,
    selfEsteem: Math.round(selfEsteemAdjusted * 10) / 10,
    socialSupport: Math.max(0, Math.min(10, socialSupportScore)),
    copingSkills: Math.round(copingSkillsScore * 10) / 10,
    sleepQuality: sleepScore,
    appetite: appetiteScore,
    concentration: concentration,
    fatigue: fatigue,
    irritability: irritability,
  }
  
  // Выявляем истинный запрос через анализ текста
  const trueRequest = analyzeTrueRequest(presentingComplaint, psychologicalIndicators)
  
  // Расширенный анализ факторов риска
  const riskFactors: string[] = []
  if (anxietyLevel >= 7) riskFactors.push('Высокий уровень тревоги')
  if (depressionLevel >= 7) riskFactors.push('Высокий уровень депрессии')
  if (overallStress >= 8) riskFactors.push('Высокий общий уровень стресса')
  if (workBurnout >= 7) riskFactors.push('Признаки профессионального выгорания')
  if (relationshipsQuality <= 3) riskFactors.push('Низкое качество отношений')
  if (loneliness >= 7) riskFactors.push('Высокий уровень одиночества')
  const sleepScoreNum = sleepQuality === 'excellent' ? 9 : sleepQuality === 'good' ? 7 : sleepQuality === 'fair' ? 5 : 2
  if (sleepScoreNum <= 3) riskFactors.push('Проблемы со сном')
  if (fatigue >= 7) riskFactors.push('Высокая усталость')
  if (concentration <= 3) riskFactors.push('Проблемы с концентрацией')
  if (familyMentalHealth) riskFactors.push('Семейный анамнез психических расстройств')
  if (familySubstanceAbuse) riskFactors.push('Семейный анамнез зависимости')
  if (familyTrauma) riskFactors.push('Травматический опыт в детстве')
  if (lifeEventsStress >= 7 && lifeEvents.length > 0) riskFactors.push('Недавние стрессовые жизненные события')
  if (negativeCopingCount > positiveCopingCount) riskFactors.push('Использование неадаптивных стратегий совладания')
  if (physicalPain) riskFactors.push('Психосоматические симптомы')
  if (suicidalIdeation(answers, answerMap)) riskFactors.push('⚠️ КРИТИЧЕСКИЙ РИСК: Суицидальные мысли')
  
  // Расширенный анализ сильных сторон
  const strengths: string[] = []
  if (relationshipsQuality >= 7) strengths.push('Хорошие отношения с близкими')
  if (partnerQuality >= 7) strengths.push('Качественные отношения с партнером')
  if (friendsQuality >= 7) strengths.push('Хорошие дружеские отношения')
  if (workSatisfaction >= 7) strengths.push('Удовлетворенность работой')
  if (workFuture >= 7) strengths.push('Оптимистичный взгляд на профессиональное будущее')
  if (socialLevel >= 7) strengths.push('Хорошие социальные навыки')
  if (conscientiousness >= 7) strengths.push('Высокая организованность')
  if (openness >= 7) strengths.push('Открытость новому опыту')
  if (copingEffectiveness >= 7) strengths.push('Эффективные стратегии совладания')
  if (positiveCopingCount >= 3) strengths.push('Использование здоровых способов снятия стресса')
  if (sleepScore >= 7) strengths.push('Хорошее качество сна')
  if (concentration >= 7) strengths.push('Хорошая способность к концентрации')
  if (agreeableness >= 7) strengths.push('Доброжелательность и сотрудничество')
  
  // Вспомогательная функция для выявления суицидальных мыслей
  function suicidalIdeation(answers: Answer[], answerMap: Map<string, any>): boolean {
    const complaint = String(answerMap.get('presenting-complaint') || '').toLowerCase()
    const depressionLevelCheck = Number(answerMap.get('symptoms-depression') || 0)
    const anxietyLevelCheck = Number(answerMap.get('symptoms-anxiety') || 0)
    
    const suicidalKeywords = ['суицид', 'самоубийств', 'не хочу жить', 'лучше умереть', 'конец всему', 'покончить', 'убить себя']
    const hasKeywords = suicidalKeywords.some(keyword => complaint.includes(keyword))
    
    return hasKeywords || (depressionLevelCheck >= 9 && anxietyLevelCheck >= 8)
  }
  
  // Генерируем рекомендации
  const recommendations = generateRecommendations(
    psychologicalIndicators, 
    riskFactors, 
    personalityType,
    {
      loneliness,
      sleepScore,
      concentration,
      workBurnout,
      familyTrauma,
      negativeCopingCount,
      positiveCopingCount
    }
  )
  
  // Краткое резюме
  const summary = generateSummary(personalityType, psychologicalIndicators, trueRequest, riskFactors)
  
  // Генерируем два варианта результатов
  const patientResult = generatePatientResult(
    personalityType,
    psychologicalIndicators,
    dominantTraits,
    strengths,
    recommendations,
    summary
  )
  
  const psychologistResult = generatePsychologistResult(
    answers,
    answerMap,
    personalityType,
    confidence,
    dominantTraits,
    psychologicalIndicators,
    trueRequest,
    riskFactors,
    strengths,
    recommendations,
    summary,
    {
      anxietyLevel,
      depressionLevel,
      overallStress,
      sleepScore,
      concentration,
      fatigue,
      irritability,
      socialLevel,
      emotionalLevel,
      energyLevel,
      openness,
      conscientiousness,
      agreeableness,
      neuroticism,
      relationshipsQuality,
      partnerQuality,
      friendsQuality,
      loneliness,
      workStress,
      workSatisfaction,
      workBurnout,
      copingStrategies,
      copingEffectiveness,
      positiveCopingCount,
      negativeCopingCount,
      familyMentalHealth,
      familySubstanceAbuse,
      familyTrauma,
      lifeEvents,
      lifeEventsStress,
      presentingComplaint
    }
  )
  
  return {
    personalityType,
    personalityTypeConfidence: confidence,
    dominantTraits,
    psychologicalIndicators,
    trueRequest,
    riskFactors,
    strengths,
    recommendations,
    summary,
    patientResult,
    psychologistResult,
  }
}

// Анализ истинного запроса через ключевые слова и контекст
function analyzeTrueRequest(text: string, indicators: PsychologicalIndicators): string {
  const lowerText = text.toLowerCase()
  
  // Ключевые слова для разных запросов
  if (lowerText.includes('тревог') || lowerText.includes('беспокойств') || lowerText.includes('паник')) {
    return 'Работа с тревогой и беспокойством'
  }
  if (lowerText.includes('депресс') || lowerText.includes('груст') || lowerText.includes('подавлен')) {
    return 'Работа с депрессивными состояниями'
  }
  if (lowerText.includes('отношен') || lowerText.includes('семь') || lowerText.includes('партнер')) {
    return 'Проблемы в отношениях'
  }
  if (lowerText.includes('работ') || lowerText.includes('карьер') || lowerText.includes('учеба')) {
    return 'Профессиональные трудности и стресс'
  }
  if (lowerText.includes('самооценк') || lowerText.includes('уверен') || lowerText.includes('ценност')) {
    return 'Проблемы с самооценкой и уверенностью'
  }
  if (lowerText.includes('страх') || lowerText.includes('фоби')) {
    return 'Работа со страхами и фобиями'
  }
  
  // Если высокие показатели тревоги/депрессии, но запрос неясен
  if (indicators.anxietyLevel >= 7) {
    return 'Работа с тревожными состояниями'
  }
  if (indicators.depressionLevel >= 7) {
    return 'Работа с депрессивными состояниями'
  }
  
  return 'Общее улучшение психологического благополучия'
}

// Генерация рекомендаций на основе данных
function generateRecommendations(
  indicators: PsychologicalIndicators,
  riskFactors: string[],
  personalityType: PersonalityType,
  additional: {
    loneliness: number
    sleepScore: number
    concentration: number
    workBurnout: number
    familyTrauma: boolean
    negativeCopingCount: number
    positiveCopingCount: number
  }
): Recommendation[] {
  const recommendations: Recommendation[] = []
  
  // Немедленные рекомендации при высоких рисках
  if (indicators.anxietyLevel >= 8 || indicators.depressionLevel >= 8) {
    recommendations.push({
      category: 'immediate',
      title: 'Консультация специалиста',
      description: 'Рекомендуется срочная консультация с психологом или психиатром для оценки состояния.',
      priority: 'high',
      scientificBasis: 'Высокие показатели тревоги/депрессии требуют профессиональной оценки (DSM-5, МКБ-11)',
    })
  }
  
  // Рекомендации по тревоге
  if (indicators.anxietyLevel >= 6) {
    recommendations.push({
      category: 'short-term',
      title: 'Техники управления тревогой',
      description: 'Изучите техники глубокого дыхания, прогрессивной мышечной релаксации и mindfulness.',
      priority: 'high',
      scientificBasis: 'Когнитивно-поведенческая терапия и техники релаксации эффективны при тревожных расстройствах',
    })
  }
  
  // Рекомендации по депрессии
  if (indicators.depressionLevel >= 6) {
    recommendations.push({
      category: 'short-term',
      title: 'Физическая активность',
      description: 'Регулярные физические упражнения (минимум 30 минут 3 раза в неделю) помогают снизить симптомы депрессии.',
      priority: 'high',
      scientificBasis: 'Исследования показывают, что физическая активность повышает уровень серотонина и эндорфинов',
    })
  }
  
  // Рекомендации по социальной поддержке
  if (indicators.socialSupport <= 4 || additional.loneliness >= 7) {
    recommendations.push({
      category: 'long-term',
      title: 'Развитие социальных связей',
      description: 'Постепенно расширяйте круг общения, участвуйте в групповых активностях или сообществах по интересам.',
      priority: additional.loneliness >= 7 ? 'high' : 'medium',
      scientificBasis: 'Социальная поддержка является важным фактором психологического благополучия (исследования показывают связь между одиночеством и депрессией)',
    })
  }
  
  // Рекомендации по сну
  if (additional.sleepScore <= 4) {
    recommendations.push({
      category: 'short-term',
      title: 'Улучшение гигиены сна',
      description: 'Соблюдайте режим сна (ложитесь и вставайте в одно время), избегайте экранов за час до сна, создайте комфортную обстановку для сна.',
      priority: 'high',
      scientificBasis: 'Нарушения сна тесно связаны с тревогой и депрессией. Когнитивно-поведенческая терапия бессонницы (CBT-I) эффективна в 70-80% случаев',
    })
  }
  
  // Рекомендации по концентрации
  if (additional.concentration <= 4) {
    recommendations.push({
      category: 'short-term',
      title: 'Улучшение концентрации внимания',
      description: 'Практикуйте техники mindfulness, разбивайте задачи на меньшие части, минимизируйте отвлекающие факторы.',
      priority: 'medium',
      scientificBasis: 'Проблемы с концентрацией часто связаны с тревогой и депрессией. Техники mindfulness улучшают внимание',
    })
  }
  
  // Рекомендации по выгоранию
  if (additional.workBurnout >= 7) {
    recommendations.push({
      category: 'immediate',
      title: 'Профилактика профессионального выгорания',
      description: 'Обратитесь к психологу, рассмотрите возможность отпуска или изменения рабочих обязанностей.',
      priority: 'high',
      scientificBasis: 'Выгорание требует профессионального вмешательства. Раннее обращение предотвращает развитие депрессии',
    })
  }
  
  // Рекомендации по травме
  if (additional.familyTrauma) {
    recommendations.push({
      category: 'professional',
      title: 'Работа с травматическим опытом',
      description: 'Рекомендуется работа с психологом, специализирующимся на травме (EMDR, соматическая терапия).',
      priority: 'high',
      scientificBasis: 'Детская травма влияет на развитие и требует специализированного подхода',
    })
  }
  
  // Рекомендации по неадаптивным стратегиям совладания
  if (additional.negativeCopingCount > additional.positiveCopingCount) {
    recommendations.push({
      category: 'short-term',
      title: 'Развитие здоровых стратегий совладания',
      description: 'Изучите и практикуйте здоровые способы управления стрессом вместо неадаптивных (алкоголь, переедание).',
      priority: 'high',
      scientificBasis: 'Неадаптивные стратегии совладания могут усугублять проблемы и приводить к зависимости',
    })
  }
  
  // Рекомендации по самооценке
  if (indicators.selfEsteem <= 4) {
    recommendations.push({
      category: 'self-help',
      title: 'Работа с самооценкой',
      description: 'Ведите дневник достижений, практикуйте самосострадание и избегайте самокритики.',
      priority: 'medium',
      scientificBasis: 'Когнитивные техники помогают изменить негативные паттерны мышления',
    })
  }
  
  // Рекомендации в зависимости от типа личности
  if (personalityType === 'melancholic') {
    recommendations.push({
      category: 'self-help',
      title: 'Регулярный режим дня',
      description: 'Меланхоликам важно поддерживать стабильный режим дня и достаточный сон.',
      priority: 'medium',
    })
  }
  
  if (personalityType === 'choleric') {
    recommendations.push({
      category: 'self-help',
      title: 'Техники управления гневом',
      description: 'Изучите техники паузы перед реакцией и конструктивного выражения эмоций.',
      priority: 'medium',
    })
  }
  
  return recommendations
}

// Генерация краткого резюме
function generateSummary(
  personalityType: PersonalityType,
  indicators: PsychologicalIndicators,
  trueRequest: string,
  riskFactors: string[]
): string {
  const personalityNames = {
    melancholic: 'меланхолик',
    choleric: 'холерик',
    sanguine: 'сангвиник',
    phlegmatic: 'флегматик',
    mixed: 'смешанный тип',
  }
  
  let summary = `Ваш доминирующий тип личности: ${personalityNames[personalityType]}. `
  
  summary += `Основной запрос: ${trueRequest}. `
  
  if (riskFactors.length > 0) {
    summary += `Выявленные факторы риска: ${riskFactors.join(', ')}. `
  }
  
  if (indicators.anxietyLevel >= 7 || indicators.depressionLevel >= 7) {
    summary += 'Рекомендуется консультация со специалистом для более глубокой оценки состояния.'
  } else {
    summary += 'Общее психологическое состояние в пределах нормы, но есть области для улучшения.'
  }
  
  return summary
}

// Генерация упрощенного результата для пациента
function generatePatientResult(
  personalityType: PersonalityType,
  indicators: PsychologicalIndicators,
  dominantTraits: string[],
  strengths: string[],
  recommendations: Recommendation[],
  summary: string
): PatientResult {
  const personalityDescriptions = {
    melancholic: 'Вы склонны к глубоким переживаниям, аналитическому мышлению и внимательности к деталям. Вы цените качество и глубину в отношениях.',
    choleric: 'Вы энергичны, решительны и склонны к лидерству. Эмоциональны и активны, предпочитаете действовать, а не размышлять.',
    sanguine: 'Вы общительны, оптимистичны и легко адаптируетесь к новым ситуациям. Обладаете хорошим чувством юмора и любите общение.',
    phlegmatic: 'Вы спокойны, уравновешены и надежны. Предпочитаете стабильность и порядок, цените гармонию в отношениях.',
    mixed: 'У вас сочетаются черты разных типов личности, что делает вас гибким и многогранным человеком.',
  }

  // Выбираем основные индикаторы для показа пациенту
  const mainIndicators: Array<{
    label: string
    value: number
    status: 'good' | 'moderate' | 'needs_attention'
  }> = [
    {
      label: 'Уровень тревоги',
      value: indicators.anxietyLevel,
      status: indicators.anxietyLevel >= 7 ? 'needs_attention' : indicators.anxietyLevel >= 4 ? 'moderate' : 'good'
    },
    {
      label: 'Уровень стресса',
      value: indicators.stressLevel as number,
      status: (indicators.stressLevel as number) >= 7 ? 'needs_attention' : (indicators.stressLevel as number) >= 4 ? 'moderate' : 'good'
    },
    {
      label: 'Самооценка',
      value: indicators.selfEsteem as number,
      status: indicators.selfEsteem as number >= 7 ? 'good' : indicators.selfEsteem as number >= 4 ? 'moderate' : 'needs_attention'
    },
    {
      label: 'Качество сна',
      value: indicators.sleepQuality as number,
      status: indicators.sleepQuality as number >= 7 ? 'good' : indicators.sleepQuality as number >= 4 ? 'moderate' : 'needs_attention'
    },
  ]

  // Упрощенные рекомендации (только основные)
  const generalRecommendations = recommendations
    .filter(rec => rec.priority === 'high' || rec.category === 'self-help')
    .slice(0, 5)
    .map(rec => rec.title)

  return {
    personalityType,
    personalityDescription: personalityDescriptions[personalityType],
    mainIndicators,
    keyStrengths: strengths.slice(0, 5),
    generalRecommendations,
    summary,
  }
}

// Генерация расширенного результата для психолога
function generatePsychologistResult(
  answers: Answer[],
  answerMap: Map<string, any>,
  personalityType: PersonalityType,
  confidence: number,
  dominantTraits: string[],
  indicators: PsychologicalIndicators,
  trueRequest: string,
  riskFactors: string[],
  strengths: string[],
  recommendations: Recommendation[],
  summary: string,
  context: {
    anxietyLevel: number
    depressionLevel: number
    overallStress: number
    sleepScore: number
    concentration: number
    fatigue: number
    irritability: number
    socialLevel: number
    emotionalLevel: number
    energyLevel: number
    openness: number
    conscientiousness: number
    agreeableness: number
    neuroticism: number
    relationshipsQuality: number
    partnerQuality: number
    friendsQuality: number
    loneliness: number
    workStress: number
    workSatisfaction: number
    workBurnout: number
    copingStrategies: string[]
    copingEffectiveness: number
    positiveCopingCount: number
    negativeCopingCount: number
    familyMentalHealth: boolean
    familySubstanceAbuse: boolean
    familyTrauma: boolean
    lifeEvents: string[]
    lifeEventsStress: number
    presentingComplaint: string
  }
): PsychologistResult {
  const personalityDescriptions = {
    melancholic: 'Меланхолический тип характеризуется глубокой чувствительностью, склонностью к рефлексии и аналитическому мышлению. Пациенты этого типа часто имеют высокую эмпатию, но могут быть склонны к перфекционизму и самокритике. В стрессовых ситуациях могут проявлять тревожность и склонность к депрессивным состояниям.',
    choleric: 'Холерический тип отличается высокой энергией, решительностью и склонностью к лидерству. Пациенты этого типа активны, эмоциональны и могут быть импульсивными. В стрессовых ситуациях могут проявлять агрессию и раздражительность. Требуют структурированного подхода и работы с эмоциональной регуляцией.',
    sanguine: 'Сангвинический тип характеризуется общительностью, оптимизмом и адаптивностью. Пациенты этого типа легко устанавливают контакты, но могут иметь трудности с концентрацией и завершением задач. В стрессовых ситуациях могут избегать проблем. Требуют работы с фокусом и завершением начатого.',
    phlegmatic: 'Флегматический тип отличается спокойствием, стабильностью и надежностью. Пациенты этого типа предпочитают рутину и избегают изменений. В стрессовых ситуациях могут проявлять пассивность. Требуют мотивации и работы с инициативностью.',
    mixed: 'Смешанный тип личности сочетает черты разных темпераментов, что создает более сложный профиль. Требует индивидуального подхода с учетом доминирующих черт.',
  }

  // Big Five профиль
  const bigFiveProfile = {
    openness: context.openness,
    conscientiousness: context.conscientiousness,
    extraversion: (context.socialLevel + context.energyLevel) / 2,
    agreeableness: context.agreeableness,
    neuroticism: context.neuroticism,
  }

  // Детальные черты личности с оценками
  const detailedTraits = dominantTraits.map(trait => {
    let score = 5
    if (trait.includes('Открытость')) score = context.openness
    else if (trait.includes('Организованность')) score = context.conscientiousness
    else if (trait.includes('Доброжелательность')) score = context.agreeableness
    else if (trait.includes('Эмоциональная стабильность')) score = 10 - context.neuroticism
    else if (trait.includes('Чувствительность')) score = context.neuroticism
    else if (trait.includes('Общительность')) score = context.socialLevel
    else if (trait.includes('Энергичность')) score = context.energyLevel

    return {
      trait,
      score,
      description: getTraitDescription(trait, score),
    }
  })

  // Сильные стороны и вызовы личности
  const personalityStrengths = strengths.filter(s => 
    !s.includes('риск') && !s.includes('проблем')
  )
  const personalityChallenges = riskFactors.filter(r => 
    !r.includes('⚠️') && !r.includes('КРИТИЧЕСКИЙ')
  )

  // Клиническая оценка
  const getSeverity = (value: number): 'mild' | 'moderate' | 'severe' => {
    if (value >= 8) return 'severe'
    if (value >= 5) return 'moderate'
    return 'mild'
  }

  const clinicalAssessment = {
    anxietyLevel: {
      value: context.anxietyLevel,
      severity: getSeverity(context.anxietyLevel),
      notes: context.anxietyLevel >= 7 
        ? 'Высокий уровень тревоги требует внимания. Возможны панические атаки или генерализованное тревожное расстройство.'
        : context.anxietyLevel >= 4
        ? 'Умеренный уровень тревоги. Рекомендуется работа с техниками релаксации и когнитивной реструктуризацией.'
        : 'Низкий уровень тревоги. В пределах нормы.'
    },
    depressionLevel: {
      value: context.depressionLevel,
      severity: getSeverity(context.depressionLevel),
      notes: context.depressionLevel >= 7
        ? 'Высокий уровень депрессии. Возможна клиническая депрессия. Требуется оценка суицидального риска.'
        : context.depressionLevel >= 4
        ? 'Умеренный уровень депрессии. Рекомендуется работа с депрессивными мыслями и поведенческая активация.'
        : 'Низкий уровень депрессии. В пределах нормы.'
    },
    stressLevel: {
      value: context.overallStress,
      severity: getSeverity(context.overallStress),
      notes: context.overallStress >= 7
        ? 'Высокий уровень стресса. Возможны симптомы выгорания. Требуется работа со стресс-менеджментом.'
        : context.overallStress >= 4
        ? 'Умеренный уровень стресса. Рекомендуется работа с техниками совладания.'
        : 'Низкий уровень стресса. В пределах нормы.'
    },
    overallMentalHealth: 
      (context.anxietyLevel >= 8 || context.depressionLevel >= 8 || riskFactors.some(r => r.includes('КРИТИЧЕСКИЙ'))) ? 'critical' as const
      : (context.anxietyLevel >= 6 || context.depressionLevel >= 6 || context.overallStress >= 7) ? 'concerning' as const
      : (context.anxietyLevel >= 4 || context.depressionLevel >= 4 || context.overallStress >= 5) ? 'fair' as const
      : 'good' as const
  }

  // Детальные индикаторы с интерпретацией
  const detailedIndicators = [
    {
      name: 'Уровень тревоги',
      value: indicators.anxietyLevel,
      interpretation: context.anxietyLevel >= 7 
        ? 'Высокий уровень тревоги может указывать на тревожное расстройство'
        : context.anxietyLevel >= 4
        ? 'Умеренный уровень тревоги, требует внимания'
        : 'Низкий уровень тревоги, в пределах нормы',
      clinicalSignificance: 'Тревога может влиять на качество жизни, сон и социальное функционирование. Высокий уровень требует клинической оценки.'
    },
    {
      name: 'Уровень депрессии',
      value: indicators.depressionLevel,
      interpretation: context.depressionLevel >= 7
        ? 'Высокий уровень депрессии, возможна клиническая депрессия'
        : context.depressionLevel >= 4
        ? 'Умеренный уровень депрессии'
        : 'Низкий уровень депрессии',
      clinicalSignificance: 'Депрессия влияет на мотивацию, сон, аппетит и общее функционирование. Высокий уровень требует немедленного внимания.'
    },
    {
      name: 'Самооценка',
      value: indicators.selfEsteem as number,
      interpretation: (indicators.selfEsteem as number) >= 7
        ? 'Хорошая самооценка'
        : (indicators.selfEsteem as number) >= 4
        ? 'Умеренная самооценка'
        : 'Низкая самооценка',
      clinicalSignificance: 'Самооценка связана с депрессией, тревогой и качеством отношений. Низкая самооценка требует работы с когнитивными искажениями.'
    },
    {
      name: 'Социальная поддержка',
      value: indicators.socialSupport as number,
      interpretation: (indicators.socialSupport as number) >= 7
        ? 'Хорошая социальная поддержка'
        : (indicators.socialSupport as number) >= 4
        ? 'Умеренная социальная поддержка'
        : 'Низкая социальная поддержка',
      clinicalSignificance: 'Социальная поддержка является защитным фактором против депрессии и стресса. Низкая поддержка увеличивает риск.'
    },
    {
      name: 'Навыки совладания',
      value: indicators.copingSkills as number,
      interpretation: (indicators.copingSkills as number) >= 7
        ? 'Хорошие навыки совладания'
        : (indicators.copingSkills as number) >= 4
        ? 'Умеренные навыки совладания'
        : 'Слабые навыки совладания',
      clinicalSignificance: 'Эффективные стратегии совладания защищают от стресса и депрессии. Неадаптивные стратегии могут усугублять проблемы.'
    },
  ]

  // Оценка рисков
  const immediateRisks = riskFactors.filter(r => 
    r.includes('КРИТИЧЕСКИЙ') || r.includes('суицид') || 
    context.anxietyLevel >= 9 || context.depressionLevel >= 9
  )
  const longTermRisks = riskFactors.filter(r => 
    r.includes('семейный анамнез') || r.includes('травма') ||
    r.includes('выгорание') || r.includes('неадаптивных')
  )
  const protectiveFactors = strengths.filter(s => 
    s.includes('отношения') || s.includes('поддержка') || 
    s.includes('навыки') || s.includes('эффектив')
  )

  const riskLevel = immediateRisks.length > 0 ? 'critical' as const
    : (context.anxietyLevel >= 7 || context.depressionLevel >= 7 || riskFactors.length >= 5) ? 'high' as const
    : (context.anxietyLevel >= 5 || context.depressionLevel >= 5 || riskFactors.length >= 3) ? 'moderate' as const
    : 'low' as const

  // Механизмы совладания
  const adaptiveCoping = context.copingStrategies.filter(c => 
    ['sport', 'hobbies', 'friends', 'meditation', 'therapy', 'reading', 'music'].includes(c)
  )
  const maladaptiveCoping = context.copingStrategies.filter(c => 
    ['alcohol', 'food', 'sleep'].includes(c)
  )

  // Рекомендации по терапевтическому подходу
  const recommendedApproach: string[] = []
  if (context.anxietyLevel >= 6) recommendedApproach.push('Когнитивно-поведенческая терапия (КПТ)')
  if (context.depressionLevel >= 6) recommendedApproach.push('КПТ', 'Поведенческая активация')
  if (context.familyTrauma) recommendedApproach.push('EMDR', 'Соматическая терапия травмы')
  if (context.workBurnout >= 6) recommendedApproach.push('Терапия принятия и ответственности (ACT)')
  if (context.relationshipsQuality <= 4) recommendedApproach.push('Межличностная терапия (IPT)')
  if (context.neuroticism >= 7) recommendedApproach.push('Диалектическая поведенческая терапия (ДПТ)')
  if (recommendedApproach.length === 0) recommendedApproach.push('Интегративный подход', 'КПТ')

  // Фокусные области
  const focusAreas: string[] = []
  if (context.anxietyLevel >= 5) focusAreas.push('Работа с тревогой и беспокойством')
  if (context.depressionLevel >= 5) focusAreas.push('Работа с депрессивными состояниями')
  if (context.overallStress >= 6) focusAreas.push('Стресс-менеджмент')
  if (context.relationshipsQuality <= 5) focusAreas.push('Межличностные отношения')
  if (context.workBurnout >= 6) focusAreas.push('Профессиональное выгорание')
  if ((indicators.selfEsteem as number) <= 5) focusAreas.push('Самооценка и самопринятие')
  if (context.loneliness >= 6) focusAreas.push('Социальная изоляция и одиночество')

  // Структура сессий
  const sessionStructure: string[] = [
    'Установление терапевтического альянса (первые 2-3 сессии)',
    'Оценка и формулирование целей терапии',
    'Работа с основными проблемными областями',
    'Развитие навыков совладания',
    'Поддержание прогресса и профилактика рецидивов'
  ]

  // Вмешательства
  const interventions = recommendations
    .filter(rec => rec.category === 'professional' || rec.priority === 'high')
    .map(rec => ({
      intervention: rec.title,
      description: rec.description,
      timing: rec.category === 'immediate' ? 'immediate' as const
        : rec.category === 'short-term' ? 'short-term' as const
        : 'long-term' as const,
      evidence: rec.scientificBasis || 'Подтверждено исследованиями в области клинической психологии'
    }))

  // Противопоказания
  const contraindications: string[] = []
  if (context.anxietyLevel >= 8) contraindications.push('Избегать чрезмерной экспозиции без подготовки')
  if (context.depressionLevel >= 8) contraindications.push('Требуется оценка суицидального риска перед глубокой работой')
  if (context.familyTrauma) contraindications.push('Избегать преждевременной работы с травмой без стабилизации')

  // Прогноз
  const prognosis = 
    (context.anxietyLevel <= 4 && context.depressionLevel <= 4 && riskFactors.length <= 2) ? 'good' as const
    : (context.anxietyLevel <= 6 && context.depressionLevel <= 6 && riskFactors.length <= 4) ? 'moderate' as const
    : 'guarded' as const

  // Дополнительная информация
  const familyHistory = [
    context.familyMentalHealth ? 'Семейный анамнез психических расстройств' : null,
    context.familySubstanceAbuse ? 'Семейный анамнез зависимости' : null,
    context.familyTrauma ? 'Травматический опыт в детстве' : null,
  ].filter(Boolean).join('; ') || 'Не выявлено'

  const medicalHistory = answers
    .filter(a => a.questionId.startsWith('medical-'))
    .map(a => {
      const q = questionnaireQuestions.find(q => q.id === a.questionId)
      return q ? `${q.text}: ${a.value === true ? 'Да' : 'Нет'}` : null
    })
    .filter(Boolean)
    .join('; ') || 'Не указано'

  return {
    personalityProfile: {
      type: personalityType,
      confidence,
      detailedDescription: personalityDescriptions[personalityType],
      bigFiveProfile,
      dominantTraits: detailedTraits,
      personalityStrengths,
      personalityChallenges: personalityChallenges,
    },
    psychologicalAnalysis: {
      clinicalAssessment,
      detailedIndicators,
      riskAssessment: {
        immediateRisks,
        longTermRisks,
        protectiveFactors,
        riskLevel,
      },
      copingMechanisms: {
        adaptive: adaptiveCoping,
        maladaptive: maladaptiveCoping,
        effectiveness: context.copingEffectiveness,
        recommendations: recommendations
          .filter(r => r.category === 'self-help' && r.title.includes('совлада'))
          .map(r => r.description),
      },
    },
    therapeuticRecommendations: {
      recommendedApproach: [...new Set(recommendedApproach)],
      focusAreas,
      sessionStructure,
      interventions,
      contraindications,
      prognosis,
    },
    additionalNotes: {
      presentingComplaint: context.presentingComplaint,
      trueRequest,
      familyHistory,
      medicalHistory,
      lifeEvents: context.lifeEvents.join('; ') || 'Не указано',
    },
  }
}

// Вспомогательная функция для описания черт
function getTraitDescription(trait: string, score: number): string {
  if (score >= 7) {
    return `Высокий уровень ${trait.toLowerCase()}. Это сильная сторона личности.`
  } else if (score >= 4) {
    return `Умеренный уровень ${trait.toLowerCase()}. В пределах нормы.`
  } else {
    return `Низкий уровень ${trait.toLowerCase()}. Может требовать внимания.`
  }
}

