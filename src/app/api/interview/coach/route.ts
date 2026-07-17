import { NextRequest, NextResponse } from 'next/server'
import { ai } from '@/lib/ai/provider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { question, userAnswer, role } = body

    if (!question || !userAnswer) {
      return NextResponse.json(
        { error: 'Missing required fields: question, userAnswer' },
        { status: 400 }
      )
    }

    const result = await ai.coachInterview(question, userAnswer, role || 'professional')

    return NextResponse.json({
      success: true,
      feedback: result.content,
      model: result.model
    })
  } catch (error) {
    console.error('Interview coaching error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze interview answer' },
      { status: 500 }
    )
  }
}