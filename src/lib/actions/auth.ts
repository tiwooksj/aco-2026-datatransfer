'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { env } from '@/lib/env'

interface LoginResponse {
  success: boolean
  error?: string
}

/**
 * 관리자 로그인 처리
 * HTTP-only 쿠키에 인증 토큰을 저장합니다
 */
export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  // 입력값 검증
  if (!email || !password) {
    return {
      success: false,
      error: '이메일과 비밀번호를 입력해주세요',
    }
  }

  // 환경 변수의 관리자 자격증명과 비교
  if (email === env.ADMIN_EMAIL && password === env.ADMIN_PASSWORD) {
    // 쿠키 설정 (HTTP-only, 24시간)
    const cookieStore = await cookies()
    cookieStore.set('auth_token', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24시간
      path: '/',
    })

    return { success: true }
  }

  // 자격증명 불일치
  return {
    success: false,
    error: '이메일 또는 비밀번호가 일치하지 않습니다',
  }
}

/**
 * 관리자 로그아웃 처리
 * 인증 쿠키를 삭제하고 로그인 페이지로 리다이렉트합니다
 */
export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('auth_token')
  redirect('/login')
}

/**
 * 현재 인증 상태 확인 (선택사항)
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  return !!cookieStore.get('auth_token')?.value
}
