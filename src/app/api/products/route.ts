import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category_slug = searchParams.get('category_slug')
    const collection_slug = searchParams.get('collection_slug')
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '2'

    const offset = (parseInt(page) - 1) * parseInt(limit)

    const query =
    (category_slug ? `&category_slug=${category_slug}` : '') +
    (collection_slug ? `&collection_slug=${collection_slug}` : '')

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products/?offset=${offset}&limit=${limit}${query}`, {
      cache: 'no-store',
      method: 'GET',
    })

    const data = await res.json()

    return NextResponse.json({ success: true, data: data.results })
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 500 })
  }
}
