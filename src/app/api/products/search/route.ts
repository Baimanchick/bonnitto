import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''

    console.log('Received search request with query:', query)

    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/products/search/?search=${encodeURIComponent(query)}`

    console.log('Making request to:', apiUrl)

    const res = await fetch(apiUrl, {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!res.ok) {
      console.error('API responded with status:', res.status)
      throw new Error(`API responded with status: ${res.status}`)
    }

    const data = await res.json()

    console.log('Backend API response:', data)

    if (!data.results) {
      console.log('No results in response')

      return NextResponse.json({
        success: true,
        data: {
          results: [],
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        results: data.results,
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
