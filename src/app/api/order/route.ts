import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log('body', body)

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders/from-cart/`, {
      method: 'POST',
      body: JSON.stringify(body),
    })

    const data = await response.json()

    return NextResponse.json({ success: true, data: data })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e }, { status: 500 })
  }
}
