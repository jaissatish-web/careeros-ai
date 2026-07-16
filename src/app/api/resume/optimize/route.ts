import { NextRequest, NextResponse } from 'next/server'
import { ai } from '@/lib/ai/provider'

export async function POST(request: NextRequest) {
  try {
    const { resumeText, jobDescription, country } = await request.json()

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: 'Missing required fields: resumeText, jobDescription' },
        { status: 400 }
      )
    }

    const result = await ai.optimizeResume(resumeText, jobDescription, country || 'ae')

    return NextResponse.json({
      success: true,
      suggestions: result.content,
      model: result.model
    })
  } catch (error) {
    console.error('Resume optimization error:', error)
    return NextResponse.json(
      { error: 'Failed to optimize resume' },
      { status: 500 }
    )
  }
}