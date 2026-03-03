'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { LogOut, Menu, ShieldAlert } from 'lucide-react'
import { logout } from '@/lib/actions/auth'
import { useAuth } from '@/lib/hooks/useAuth'
import { FAKE_ANOMALY_ALERTS } from '@/lib/fake/data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Container } from './container'
import { cn } from '@/lib/utils'

// 승인 대기 중인 이상 감지 항목 개수 계산
const PENDING_COUNT = FAKE_ANOMALY_ALERTS.filter(
  alert => alert.status === 'pending'
).length

const NAV_ITEMS: Array<{ href: string; label: string; badge?: number }> = [
  { href: '/anomalies', label: '이상 감지 목록' },
  { href: '/approvals', label: '관리자 승인', badge: PENDING_COUNT },
  { href: '/reports', label: '장애 리포트' },
]

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isAuthenticated } = useAuth()

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/anomalies" className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-500" />
              <span className="text-lg font-bold">AWS Cost Monitor</span>
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              {NAV_ITEMS.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    pathname === item.href ||
                      pathname.startsWith(item.href + '/')
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  {item.label}
                  {item.badge && item.badge > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="hidden md:block">
                  <Button variant="outline" size="sm">
                    관리자
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    disabled
                    className="text-muted-foreground text-xs"
                  >
                    admin@example.com
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={async () => {
                      await logout()
                    }}
                    className="cursor-pointer text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login" className="hidden md:block">
                <Button variant="outline" size="sm">
                  로그인
                </Button>
              </Link>
            )}

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">메뉴 열기</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <div className="flex flex-col gap-1 pt-6">
                  {NAV_ITEMS.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'relative rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        pathname === item.href
                          ? 'bg-muted text-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      {item.label}
                      {item.badge && item.badge > 0 && (
                        <Badge
                          variant="destructive"
                          className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  ))}
                  <div className="mt-4 border-t pt-4">
                    {isAuthenticated ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-red-600"
                        onClick={async () => {
                          setMobileMenuOpen(false)
                          await logout()
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        로그아웃
                      </Button>
                    ) : (
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button variant="outline" size="sm" className="w-full">
                          로그인
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Container>
    </header>
  )
}
