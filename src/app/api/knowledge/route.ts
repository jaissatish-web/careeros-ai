import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic' // Prevent static generation

export async function GET(request: NextRequest) {
  // Return mock response during build when env vars not set
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ 
      success: true, 
      data: [
        { id: 'mock-1', category: 'visa', country: 'sa', title: 'Saudi Visa Guide', content: 'Mock data - configure Supabase' }
      ]
    })
  }

  try {
    const { createClient } = require('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const GULF_COUNTRIES = ['sa', 'ae', 'qa', 'kw', 'bh', 'om']
    const searchParams = request.nextUrl.searchParams
    const country = searchParams.get('country')
    const category = searchParams.get('category')

    let query = supabase.from('career_knowledge').select('*')

    if (country && GULF_COUNTRIES.includes(country)) {
      query = query.eq('country', country)
    }

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: String(error) }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ 
      success: true, 
      data: [],
      error: 'Using mock mode'
    })
  }
}