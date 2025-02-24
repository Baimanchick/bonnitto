import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cart/`, {
      cache: 'no-store',
      method: 'GET',
    })

    const data = await res.json()

    return NextResponse.json({ success: true, data: data.results })
  } catch (error) {
    console.log('error', error)

    return NextResponse.json({ success: false, error: error }, { status: 500 })
  }
}
