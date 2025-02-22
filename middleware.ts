import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = localStorage.getItem('token')

  // Если пользователь **авторизован** (есть токен в cookie)
  // и пытается зайти на /auth/...
  if (token && pathname.startsWith('/auth')) {
    // редиректим на главную (или куда нужно)
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Если пользователь **не авторизован** (нет токена)
  // и лезет в приватные роуты типа /cabinet/...
  if (!token && pathname.startsWith('/cabinet')) {
    // редиректим на /auth/login
    return NextResponse.redirect(new URL('/auth/register', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/auth/:path*',      // Все внутри /auth
  ],
}
