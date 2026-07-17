// AI Provider Abstraction Layer for CareerOS AI
// Supports OpenRouter (primary) and OpenAI with model routing

import OpenAI from 'openai'

// Lazy initialization - only create client when needed
let openrouterClient: OpenAI | null = null
let openaiClient: OpenAI | null = null

function getOpenRouterClient() {
  if (!openrouterClient && process.env.OPENROUTER_API_KEY) {
    openrouterClient = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
    })
  }
  return openrouterClient
}

function getOpenAIClient() {
  if (!openaiClient && process.env.OPENAI_API_KEY) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return openaiClient
}

// Gulf-focused system prompts
const GULF_PROMPTS = {
  resumeOptimization: `You are CareerOS AI, an expert career advisor focused exclusively on Gulf careers. Optimize resumes for companies like Aramco, Emirates Group, QatarEnergy, etc. Focus on NOC codes, Nitaqat system (Saudi), labor law compliance, and Gulf compensation packages.`,
  coverLetter: `Write cover letters tailored for Gulf employers. Include references to Sharia compliance, family benefits, housing allowances, and regional business protocols.`,
  interviewCoach: `Provide interview feedback for Gulf companies. Reference cultural expectations, wasta concepts, and regional hiring practices.`
}

export const ai = {
  // Resume optimization with Gulf focus
  optimizeResume: async (resumeText: string, jobDescription: string, country = 'ae') => {
    const client = getOpenRouterClient()
    if (!client) {
      throw new Error('OpenRouter API key not configured')
    }
    
    const response = await client.chat.completions.create({
      model: 'deepseek/deepseek-chat',
      messages: [
        { role: 'system', content: GULF_PROMPTS.resumeOptimization },
        { role: 'user', content: `Optimize this resume for a ${country.toUpperCase()} job:\n\nRESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}` }
      ]
    })
    
    return { content: response.choices[0]?.message?.content || '', model: 'deepseek/deepseek-chat' }
  },

  // Cover letter generation
  generateCoverLetter: async (resumeText: string, jobDescription: string, company = '', country?: string) => {
    const client = getOpenRouterClient()
    if (!client) {
      throw new Error('OpenRouter API key not configured')
    }
    
    const countryContext = country ? ` for ${country}` : ''
    const companyContext = company ? ` at ${company}` : ''
    
    const response = await client.chat.completions.create({
      model: 'deepseek/deepseek-chat',
      messages: [
        { role: 'system', content: GULF_PROMPTS.coverLetter },
        { role: 'user', content: `Write a professional cover letter${countryContext}${companyContext}:\n\n${resumeText}` }
      ]
    })
    
    return { content: response.choices[0]?.message?.content || '', model: 'deepseek/deepseek-chat' }
  },

  // Interview coaching
  coachInterview: async (question: string, userAnswer: string, role?: string) => {
    const client = getOpenRouterClient()
    if (!client) {
      throw new Error('OpenRouter API key not configured')
    }
    
    const response = await client.chat.completions.create({
      model: 'deepseek/deepseek-chat',
      messages: [
        { role: 'system', content: GULF_PROMPTS.interviewCoach },
        { role: 'user', content: `Question: ${question}\n\nCandidate Answer: ${userAnswer}\n\nProvide concise feedback for Gulf job interview.` }
      ]
    })
    
    return { content: response.choices[0]?.message?.content || '', model: 'deepseek/deepseek-chat' }
  }
}