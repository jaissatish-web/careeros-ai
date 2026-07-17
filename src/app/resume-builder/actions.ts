'use server'

import { ai } from '@/lib/ai/provider'
import { revalidatePath } from 'next/cache'

export async function optimizeResumeAction(formData: FormData) {
  const resumeText = formData.get('resume') as string
  const jobDescription = formData.get('jobDescription') as string
  const country = formData.get('country') as string || 'ae'

  if (!resumeText || !jobDescription) {
    return { error: 'Missing resume or job description' }
  }

  try {
    const result = await ai.optimizeResume(resumeText, jobDescription, country)
    
    revalidatePath('/resume-builder')
    
    return {
      success: true,
      suggestions: result.content,
      model: result.model
    }
  } catch (error) {
    console.error('Resume optimization failed:', error)
    return { error: 'Failed to optimize resume. Please try again.' }
  }
}