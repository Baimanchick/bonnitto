import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params, color_id, sized_id }: { params: { products_slug: string}, color_id?: string, sized_id?: string }) {
  const { products_slug } = params

  let query = ''

  if (color_id && sized_id) {
    query = `?color_id=${color_id}&size_id=${sized_id}`
  } else if (color_id) {
    query = `?color_id=${color_id}`
  } else if (sized_id) {
    query = `?size_id=${sized_id}`
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/products/${products_slug}/variants/${query}`,
      {
        cache: 'no-store',
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
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
    console.error('Ошибка при получении деталей продукта', error)

    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 },
    )
  }
}
