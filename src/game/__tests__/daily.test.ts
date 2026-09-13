import { describe, expect, it } from 'vitest'
import { DAY_ZERO, bangkokDateString, currentDayIndex, dayIndexFor, msUntilNextPuzzle, pickDaily, puzzleNumber } from '../daily'
import type { Friend, GameMode } from '../types'

const roster: Friend[] = Array.from({ length: 7 }, (_, i) => ({
  id: `f${i}`,
  nickname: `เพื่อน${i}`,
  aliases: [],
  photo: `friends/f${i}.webp`,
  attrs: {},
  reveal: { signature: '', emoji: '', quotes: [] },
}))

describe('dayIndex', () => {
  it('วันแรกคือ 0 และข้อที่ 1', () => {
    expect(dayIndexFor(DAY_ZERO)).toBe(0)
    expect(puzzleNumber(0)).toBe(1)
  })
  it('นับเป็นวันตามเวลาไทย ไม่ใช่ UTC', () => {
    // 17:30 UTC = ตีห้าครึ่งของวันถัดไปที่ไทย
    expect(bangkokDateString(new Date('2026-09-20T17:30:00Z'))).toBe('2026-09-21')
    expect(bangkokDateString(new Date('2026-09-20T16:59:00Z'))).toBe('2026-09-20')
  })
  it('เวลาถอยหลังเหลืออยู่ในช่วง 1 วันเสมอ', () => {
    const ms = msUntilNextPuzzle(new Date('2026-09-20T17:30:00Z'))
    expect(ms).toBeGreaterThan(0)
    expect(ms).toBeLessThanOrEqual(86_400_000)
    // 00:30 ไทย → เหลือ 23 ชม. 30 นาที
    expect(ms).toBe((23 * 60 + 30) * 60_000)
  })
  it('currentDayIndex ตรงกับวันไทยของตอนนั้น', () => {
    const now = new Date('2026-09-20T17:30:00Z')
    expect(currentDayIndex(now)).toBe(dayIndexFor('2026-09-21'))
  })
})

describe('pickDaily', () => {
  it('วันเดิมได้คนเดิมเสมอ', () => {
    expect(pickDaily(roster, 'classic', 12).id).toBe(pickDaily(roster, 'classic', 12).id)
  })
  it('ไม่ซ้ำใครเลยจนกว่าจะครบ 1 รอบกลุ่ม', () => {
    for (const cycle of [0, 1, 5]) {
      const ids = Array.from({ length: roster.length }, (_, i) =>
        pickDaily(roster, 'classic', cycle * roster.length + i).id,
      )
      expect(new Set(ids).size).toBe(roster.length)
    }
  })
  it('สับใหม่ทุกรอบ ไม่ใช่ลำดับเดิมวนซ้ำ', () => {
    const first = Array.from({ length: roster.length }, (_, i) => pickDaily(roster, 'classic', i).id)
    const second = Array.from({ length: roster.length }, (_, i) => pickDaily(roster, 'classic', roster.length + i).id)
    expect(second).not.toEqual(first)
  })
  it('วันเดียวกันแต่ละโหมดได้คนละคน', () => {
    const modes: GameMode[] = ['classic', 'emoji', 'quote', 'silhouette']
    const ids = modes.map((m) => pickDaily(roster, m, 3).id)
    expect(new Set(ids).size).toBe(modes.length)
  })
  it('รับ dayIndex ติดลบได้ (เผื่อเครื่องตั้งเวลาย้อนหลัง)', () => {
    expect(() => pickDaily(roster, 'classic', -5)).not.toThrow()
  })
  it('ฟ้องเมื่อยังไม่มีข้อมูลเพื่อน', () => {
    expect(() => pickDaily([], 'classic', 0)).toThrow()
  })
})
