import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''

    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/product-variants-list/search/?search=${encodeURIComponent(query)}`

    const res = await fetch(apiUrl, {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!res.ok) {
      throw new Error(`API responded with status: ${res.status}`)
    }

    const data = await res.json()

    return NextResponse.json({
      success: true,
      data: {
        results: data.results || [],
      },
    })
  } catch (error) {
    console.error('Search API error:', error)

    return NextResponse.json({
      success: false,
      error: 'Ошибка поиска',
      data: {
        results: [],
      },
    }, { status: 500 })
  }
}
