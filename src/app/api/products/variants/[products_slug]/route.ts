import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ products_slug: string }> }) {
  const { products_slug } = await params
  const url = new URL(request.url)
  const color_id = url.searchParams.get('color_id')
  const sized_id = url.searchParams.get('sized_id')

  let query = ''

  if (color_id && sized_id) {
    query = `?color_id=${color_id}&size_id=${sized_id}`
  } else if (color_id) {
    query = `?color_id=${color_id}`
  } else if (sized_id) {
    query = `?size_id=${sized_id}`
  }

  console.log('Fetching:', `${process.env.NEXT_PUBLIC_BASE_URL}/products/${products_slug}/variants/${query}`)
  try {

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/products/${products_slug}/variants/${query}`,
      {
        cache: 'no-store',
        method: 'GET',
      },
    )

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: 'Продукт не найден' },
        { status: res.status },
      )
    }

    const data = await res.json()

    return NextResponse.json({ success: true, data: data })
  } catch (error) {
    console.log('Ошибка при получении деталей продукта', error)

    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 },
    )
  }
}
