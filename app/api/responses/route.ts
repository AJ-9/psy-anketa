import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { Answer, AnalysisResult } from '@/types/questionnaire'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { answers, analysis, demographics, personalDataConsent, consentDate } = body

    console.log('Saving questionnaire response:', {
      answersCount: answers?.length,
      hasAnalysis: !!analysis,
      patientName: demographics?.name,
      hasPatientResult: !!(analysis as any)?.patientResult,
      hasPsychologistResult: !!(analysis as any)?.psychologistResult,
    })

    const response = await prisma.questionnaireResponse.create({
      data: {
        startedAt: new Date(body.startedAt || new Date()),
        completedAt: body.completedAt ? new Date(body.completedAt) : null,
        answers: JSON.stringify(answers),
        analysis: analysis ? JSON.stringify(analysis) : null,
        psychologistResult: (analysis as any)?.psychologistResult ? JSON.stringify((analysis as any).psychologistResult) : null,
        patientResult: (analysis as any)?.patientResult ? JSON.stringify((analysis as any).patientResult) : null,
        age: demographics?.age,
        gender: demographics?.gender,
        education: demographics?.education,
        employment: demographics?.employment,
        relationshipStatus: demographics?.relationshipStatus,
        patientName: demographics?.name,
        patientEmail: demographics?.email,
        notes: demographics?.notes,
        personalDataConsent: Boolean(personalDataConsent),
        consentDate: consentDate ? new Date(consentDate) : null,
      },
    })

    console.log('Response saved successfully:', response.id)
    return NextResponse.json({ id: response.id, success: true })
  } catch (error) {
    console.error('Error saving response:', error)
    // Более детальная информация об ошибке
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error details:', errorMessage)
    return NextResponse.json(
      { error: 'Failed to save response', details: errorMessage },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const completed = searchParams.get('completed')

    const where: any = {}
    if (completed === 'true') {
      where.completedAt = { not: null }
    } else if (completed === 'false') {
      where.completedAt = null
    }

    console.log('Fetching responses:', { where, limit, offset })

    const [responses, total] = await Promise.all([
      prisma.questionnaireResponse.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.questionnaireResponse.count({ where }),
    ])

    console.log(`Found ${responses.length} responses (total: ${total})`)

    const parsedResponses = responses.map((r) => ({
      ...r,
      answers: JSON.parse(r.answers),
      analysis: r.analysis ? JSON.parse(r.analysis) : null,
      psychologistResult: r.psychologistResult ? JSON.parse(r.psychologistResult) : null,
      patientResult: r.patientResult ? JSON.parse(r.patientResult) : null,
    }))

    return NextResponse.json({
      responses: parsedResponses,
      total,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Error fetching responses:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error details:', errorMessage)
    return NextResponse.json(
      { error: 'Failed to fetch responses', details: errorMessage },
      { status: 500 }
    )
  }
}

