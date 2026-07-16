import { NextRequest, NextResponse } from 'next/server'
import { ai } from '@/lib/ai/provider'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { resumeText, jobDescription, company, country, tone } = body

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: 'Missing required fields: resumeText, jobDescription' },
        { status: 400 }
      )
    }

    const result = await ai.generateCoverLetter(
      resumeText,
      jobDescription,
      company || 'Gulf Company',
      country || 'ae',
      tone || 'professional'
    )

    return NextResponse.json({
      success: true,
      coverLetter: result.content,
      model: result.model
    })
  } catch (error) {
    console.error('Cover letter generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate cover letter' },
      { status: 500 }
    )
  }
}