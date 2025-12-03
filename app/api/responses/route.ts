import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { Answer, AnalysisResult } from '@/types/questionnaire'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { answers, analysis, demographics } = body

    const response = await prisma.questionnaireResponse.create({
      data: {
        startedAt: new Date(body.startedAt || new Date()),
        completedAt: body.completedAt ? new Date(body.completedAt) : null,
        answers: JSON.stringify(answers),
        analysis: analysis ? JSON.stringify(analysis) : null,
        age: demographics?.age,
        gender: demographics?.gender,
        education: demographics?.education,
        employment: demographics?.employment,
        relationshipStatus: demographics?.relationshipStatus,
        patientName: demographics?.name,
        patientEmail: demographics?.email,
        notes: demographics?.notes,
      },
    })

    return NextResponse.json({ id: response.id, success: true })
  } catch (error) {
    console.error('Error saving response:', error)
    return NextResponse.json(
      { error: 'Failed to save response' },
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

    const [responses, total] = await Promise.all([
      prisma.questionnaireResponse.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.questionnaireResponse.count({ where }),
    ])

    const parsedResponses = responses.map((r) => ({
      ...r,
      answers: JSON.parse(r.answers),
      analysis: r.analysis ? JSON.parse(r.analysis) : null,
    }))

    return NextResponse.json({
      responses: parsedResponses,
      total,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Error fetching responses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch responses' },
      { status: 500 }
    )
  }
}

