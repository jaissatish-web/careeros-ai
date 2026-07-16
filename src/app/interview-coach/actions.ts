'use server'

import { ai } from '@/lib/ai/provider'

export async function interviewCoachAction(formData: FormData) {
  const question = formData.get('question') as string
  const userAnswer = formData.get('userAnswer') as string
  const role = formData.get('role') as string || 'professional'

  if (!question || !userAnswer) {
    return { error: 'Missing question or answer' }
  }

  try {
    const result = await ai.interviewCoaching(question, userAnswer, role)
    
    return {
      success: true,
      feedback: result.content,
      model: result.model
    }
  } catch (error) {
    console.error('Interview coaching error:', error)
    return { error: 'Failed to get feedback. Please try again.' }
  }
}