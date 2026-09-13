import type { GameMode, GameStatus } from './types'

const PREFIX = 'navendle:v1'

export interface ModeProgress {
  dayIndex: number
  schemaVersion: number
  guesses: string[]
  status: GameStatus
}

export interface Stats {
  played: number
  wins: number
  streak: number
  maxStreak: number
  lastWonDayIndex: number | null
  /** จำนวนครั้งที่ใช้ทาย → นับรวมทุกโหมด (เกิน 8 รวมเป็นช่อง '8+') */
  distribution: Record<string, number>
}

export const EMPTY_STATS: Stats = {
  played: 0,
  wins: 0,
  streak: 0,
  maxStreak: 0,
  lastWonDayIndex: null,
  distribution: {},
}

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* โหมดส่วนตัวของบางเบราว์เซอร์เขียนไม่ได้ — ปล่อยให้เล่นต่อโดยไม่เซฟ */
  }
}

export function loadProgress(mode: GameMode, dayIndex: number, schemaVersion: number): ModeProgress | null {
  const saved = read<ModeProgress>(`${PREFIX}:progress:${mode}`)
  // คนละวัน หรือข้อมูลเพื่อนถูกแก้โครง → เริ่มใหม่ ไม่งั้นผลทายเก่าจะเทียบผิดคน
  if (!saved || saved.dayIndex !== dayIndex || saved.schemaVersion !== schemaVersion) return null
  return saved
}

export function saveProgress(mode: GameMode, progress: ModeProgress): void {
  write(`${PREFIX}:progress:${mode}`, progress)
}

export function loadStats(): Stats {
  return { ...EMPTY_STATS, ...(read<Stats>(`${PREFIX}:stats`) ?? {}) }
}

export function saveStats(stats: Stats): void {
  write(`${PREFIX}:stats`, stats)
}

export function loadSeenHowTo(): boolean {
  return read<boolean>(`${PREFIX}:seen-howto`) === true
}

export function saveSeenHowTo(): void {
  write(`${PREFIX}:seen-howto`, true)
}
