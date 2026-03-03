import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // 보호된 라우트 확인
  const isProtected =
    pathname.startsWith('/anomalies') ||
    pathname.startsWith('/approvals') ||
    pathname.startsWith('/reports')

  // 쿠키에서 인증 토큰 확인
  const authCookie = request.cookies.get('auth_token')?.value

  // 보호된 라우트 + 인증 없음 → 로그인 페이지로 리다이렉트
  if (isProtected && !authCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 로그인 페이지 + 인증 있음 → 대시보드로 리다이렉트
  if (pathname === '/login' && authCookie) {
    return NextResponse.redirect(new URL('/anomalies', request.url))
  }

  return NextResponse.next()
}

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: [
    /*
     * 다음과 같은 경로를 제외한 모든 요청 경로에 일치합니다:
     * - api (api routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
