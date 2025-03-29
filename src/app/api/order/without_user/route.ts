import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    console.log('data', data)

    return NextResponse.json({ success: true, data: data })
  } catch (e: any) {
    console.log('error', e)

    return NextResponse.json({ success: false, error: e }, { status: 500 })
  }
}
