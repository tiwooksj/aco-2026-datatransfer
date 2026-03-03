import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 금액을 USD 형식으로 포맷팅
 * @example formatCost(1234.56) // "$1,234.56"
 */
export function formatCost(amount: number): string {
  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

/**
 * ISO 8601 날짜를 "YYYY-MM-DD HH:mm" 형식으로 변환
 * @example formatDate("2026-03-01T09:15:00Z") // "2026-03-01 09:15"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

/**
 * 증가율을 백분율 형식으로 포맷팅
 * @example formatIncreaseRate(719) // "719%"
 */
export function formatIncreaseRate(rate: number): string {
  return `${Math.round(rate)}%`
}
