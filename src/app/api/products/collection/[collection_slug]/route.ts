import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, context: { params: Promise<{ collection_slug: string }> }) {
  const { collection_slug } = await context.params

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/products?collection_slug=${collection_slug}`,
      {
        cache: 'no-store',
        method: 'GET',
      },
    )

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: 'Продукты не найден' },
        { status: res.status },
      )
    }

    const data = await res.json()

    return NextResponse.json({ success: true, data: data })
  } catch (error) {
    console.log('Ошибка при получении продуктов', error)

    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 },
    )
  }
}
