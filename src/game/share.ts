import type { GameMode, TileResult } from './types'
import { puzzleNumber } from './daily'

export const MODE_LABELS: Record<GameMode, string> = {
  classic: 'คลาสสิก',
  emoji: 'อิโมจิ',
  quote: 'วลีเด็ด',
  silhouette: 'รูปเบลอ',
}

const SQUARE: Record<TileResult['state'], string> = {
  hit: '🟩',
  near: '🟨',
  miss: '🟥',
}

export function tilesToSquares(row: TileResult[]): string {
  return row.map((t) => SQUARE[t.state]).join('')
}

export interface ShareInput {
  mode: GameMode
  dayIndex: number
  guessCount: number
  /** โหมดคลาสสิกส่งผลทุกแถวมา โหมดอื่นส่ง [] แล้วจะได้แถบง่ายๆ แทน */
  rows: TileResult[][]
  url: string
}

/** ข้อความแชร์ — ห้ามมีชื่อคำตอบหลุดไปด้วย */
export function buildShareText({ mode, dayIndex, guessCount, rows, url }: ShareInput): string {
  const head = `navendle #${puzzleNumber(dayIndex)} · ${MODE_LABELS[mode]} · ${guessCount} ครั้ง`
  const body =
    rows.length > 0
      ? rows.map(tilesToSquares).join('\n')
      : Array.from({ length: guessCount }, (_, i) => (i === guessCount - 1 ? '🟩' : '🟥')).join('')
  return `${head}\n${body}\n${url}`
}

/** คัดลอกลงคลิปบอร์ด มี fallback สำหรับเบราว์เซอร์ที่ไม่ให้ใช้ Clipboard API */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      return ok
    } catch {
      return false
    }
  }
}
