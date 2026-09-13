import type { Friend, GameMode } from './types'
import { hashString, seededShuffle } from './rng'

/** วันแรกของเกม (โซนเวลาไทย) — ห้ามเปลี่ยนหลังปล่อยเว็บ ไม่งั้นข้อประจำวันจะเลื่อนทั้งกระดาน */
export const DAY_ZERO = '2026-09-15'

const MS_PER_DAY = 86_400_000

/** แปลงเวลาเป็นวันที่แบบไทย (UTC+7) เพื่อให้ทุกเครื่องเปลี่ยนข้อพร้อมกันตอนเที่ยงคืนบ้านเรา */
export function bangkokDateString(now: Date = new Date()): string {
  const shifted = new Date(now.getTime() + 7 * 3600_000)
  return shifted.toISOString().slice(0, 10)
}

export function dayIndexFor(dateString: string): number {
  const diff = Date.parse(`${dateString}T00:00:00Z`) - Date.parse(`${DAY_ZERO}T00:00:00Z`)
  return Math.floor(diff / MS_PER_DAY)
}

export function currentDayIndex(now: Date = new Date()): number {
  return dayIndexFor(bangkokDateString(now))
}

/** เวลาที่เหลือ (มิลลิวินาที) ถึงเที่ยงคืนไทยรอบถัดไป */
export function msUntilNextPuzzle(now: Date = new Date()): number {
  const shifted = now.getTime() + 7 * 3600_000
  return MS_PER_DAY - (((shifted % MS_PER_DAY) + MS_PER_DAY) % MS_PER_DAY)
}

/**
 * เลือกคำตอบประจำวัน
 * - สับไพ่ใหม่ทุกครบ 1 รอบกลุ่ม → ไม่มีใครซ้ำจนกว่าเพื่อนทุกคนจะถูกใช้ครบ
 * - ใส่ salt ตามโหมด → วันเดียวกันแต่ละโหมดได้คนละคน
 */
export function pickDaily(friends: readonly Friend[], mode: GameMode, dayIndex: number): Friend {
  const n = friends.length
  if (n === 0) throw new Error('ยังไม่มีข้อมูลเพื่อนใน friends.json')
  const safeIndex = ((dayIndex % n) + n) % n
  const cycle = Math.floor(dayIndex / n)
  const seed = hashString(`navendle|${mode}|cycle:${cycle}|n:${n}`)
  return seededShuffle(friends, seed)[safeIndex]
}

/** เลขข้อที่ใช้ในข้อความแชร์ */
export function puzzleNumber(dayIndex: number): number {
  return dayIndex + 1
}
