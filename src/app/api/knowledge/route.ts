import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Gulf country constants
const GULF_COUNTRIES = ['sa', 'ae', 'qa', 'kw', 'bh', 'om']

// Lazy Supabase client initialization
function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null
}

export async function GET(request: NextRequest) {
  try {
    // Check if supabase is configured
    const supabase = getSupabase()
    
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Database not configured',
        data: [] 
      })
    }

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
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Knowledge base error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch knowledge base' },
      { status: 500 }
    )
  }
}