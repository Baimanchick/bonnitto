import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const variant_ids = searchParams.get('variant_ids')

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products/variants/bulk/?variant_ids=${variant_ids}`, {
      cache: 'no-store',
      method: 'GET',
    })

    const data = await res.json()

    return NextResponse.json({ success: true, data: data })
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 500 })
  }
}
