'use client'

import { useEffect, useState } from 'react'
import { isAuthenticated } from '@/lib/actions/auth'

export function useAuth() {
  const [isAuth, setIsAuth] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticated()
        setIsAuth(authenticated)
      } catch (error) {
        console.error('Auth check failed:', error)
        setIsAuth(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  return { isAuthenticated: isAuth, isLoading }
}
