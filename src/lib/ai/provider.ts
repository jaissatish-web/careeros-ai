// AI Provider Abstraction Layer for CareerOS AI
// Supports OpenRouter (primary) and OpenAI with model routing

import OpenAI from 'openai'

// Configuration from environment
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

// Default to OpenRouter
const DEFAULT_PROVIDER = 'openrouter'

interface AIProviderConfig {
  provider: 'openrouter' | 'openai'
  model: string
  apiKey: string
}

interface CareerOSAIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface AIResponse {
  content: string
  model: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

class AIProvider {
  private providers: Map<string, AIProviderConfig>

  constructor() {
    this.providers = new Map()
    
    if (OPENROUTER_API_KEY) {
      this.providers.set('openrouter', {
        provider: 'openrouter',
        apiKey: OPENROUTER_API_KEY,
        model: 'deepseek/deepseek-chat'
      })
    }
    
    if (OPENAI_API_KEY) {
      this.providers.set('openai', {
        provider: 'openai',
        apiKey: OPENAI_API_KEY,
        model: 'gpt-4-turbo'
      })
    }
  }

  private getClient(provider: string): OpenAI {
    const config = this.providers.get(provider)
    if (!config) {
      throw new Error(`Provider ${provider} not configured`)
    }

    const baseURL = config.provider === 'openrouter' 
      ? 'https://openrouter.ai/api/v1' 
      : 'https://api.openai.com/v1'

    return new OpenAI({
      apiKey: config.apiKey,
      baseURL,
      defaultHeaders: config.provider === 'openrouter' 
        ? {
            'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://careeros.ai',
            'X-Title': 'CareerOS AI'
          }
        : undefined
    })
  }

  async chat(
    messages: CareerOSAIMessage[],
    options: {
      provider?: 'openrouter' | 'openai'
      model?: string
      temperature?: number
      maxTokens?: number
      json?: boolean
    } = {}
  ): Promise<AIResponse> {
    const provider = options.provider || DEFAULT_PROVIDER
    const config = this.providers.get(provider)
    
    if (!config) {
      throw new Error(`Provider ${provider} not configured`)
    }

    const client = this.getClient(provider)
    const model = options.model || config.model

    const completion = await client.chat.completions.create({
      model,
      messages: options.json 
        ? [...messages, { role: 'system', content: 'Respond in JSON format.' }]
        : messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 2000,
      response_format: options.json ? { type: 'json_object' } : undefined
    })

    return {
      content: completion.choices[0]?.message?.content || '',
      model: model,
      usage: completion.usage ? {
        prompt_tokens: completion.usage.prompt_tokens,
        completion_tokens: completion.usage.completion_tokens,
        total_tokens: completion.usage.total_tokens
      } : undefined
    }
  }

  // Resume optimization with DeepSeek
  async optimizeResume(
    resumeText: string,
    jobDescription: string,
    country: string
  ): Promise<AIResponse> {
    const systemPrompt = `You are CareerOS AI, an expert resume optimizer for Gulf careers.
    
    Focus on:
    - Gulf work culture and employer expectations
    - Regional industry keywords (${country} context)
    - ATS optimization for Gulf employers (Aramco, ADNOC, Qatari Diar, etc.)
    - Visa sponsorship highlighting where relevant
    
    Return actionable suggestions with specific improvements.`

    return this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Resume:\n${resumeText}\n\nJob Description:\n${jobDescription}` }
    ], { model: 'deepseek/deepseek-chat', temperature: 0.3 })
  }

  // Cover letter with Gulf context
  async generateCoverLetter(
    resumeText: string,
    jobDescription: string,
    company: string,
    country: string,
    tone: string = 'professional'
  ): Promise<AIResponse> {
    const systemPrompt = `You are CareerOS AI, generating Gulf-focused cover letters.
    
    Consider:
    - Gulf business culture and communication style
    - Visa/work permit context if relevant
    - Regional salary expectations transparency
    - Arabic/English bilingual skills as assets
    
    Tone: ${tone}`

    return this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Resume:\n${resumeText}\n\nJob:\n${jobDescription}\n\nCompany: ${company}` }
    ], { model: 'deepseek/deepseek-chat', temperature: 0.7 })
  }

  // Interview coaching
  async interviewCoaching(
    question: string,
    userAnswer: string,
    role: string
  ): Promise<AIResponse> {
    const systemPrompt = `You are CareerOS AI, providing interview feedback for Gulf job seekers.
    
    Evaluate:
    - Content relevance and impact
    - Cultural fit for Gulf employers
    - STAR method usage
    - Confidence indicators
    
    Provide specific improvement suggestions.`

    return this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Question: ${question}\n\nAnswer:\n${userAnswer}` }
    ], { model: 'deepseek/deepseek-chat', temperature: 0.5 })
  }

  // Career advice with Gulf context
  async careerAdvice(
    question: string,
    userProfile: any
  ): Promise<AIResponse> {
    const systemPrompt = `You are CareerOS AI, providing Gulf career guidance.
    
    Consider:
    - Visa processes and labor laws
    - Salary benchmarks by country
    - Industry growth sectors in Gulf
    - Cultural adaptation advice
    - Networking in Gulf business environment`

    return this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: question }
    ], { model: 'deepseek/deepseek-chat', temperature: 0.6 })
  }
}

export const ai = new AIProvider()
export default ai