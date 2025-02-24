import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, context: { params: Promise<{ products_slug: string }> }) {
  const { products_slug } = await context.params

  try {
    console.log('request' ,`${process.env.NEXT_PUBLIC_BASE_URL}/products/${products_slug}/`)
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/products/${products_slug}/`,
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
