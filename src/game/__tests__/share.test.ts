import { describe, expect, it } from 'vitest'
import { buildShareText, tilesToSquares } from '../share'
import type { TileResult } from '../types'

const row: TileResult[] = [
  { state: 'miss' },
  { state: 'near' },
  { state: 'hit' },
  { state: 'miss', direction: 'up' },
]

describe('share', () => {
  it('แปลงผลเป็นสี่เหลี่ยมสี', () => {
    expect(tilesToSquares(row)).toBe('🟥🟨🟩🟥')
  })

  it('ข้อความแชร์มีเลขข้อ โหมด และจำนวนครั้ง', () => {
    const text = buildShareText({
      mode: 'classic',
      dayIndex: 11,
      guessCount: 1,
      rows: [row],
      url: 'https://example.com/navendle/',
    })
    expect(text).toContain('navendle #12')
    expect(text).toContain('คลาสสิก')
    expect(text).toContain('1 ครั้ง')
    expect(text).toContain('🟥🟨🟩🟥')
  })

  it('ไม่หลุดชื่อคำตอบออกไป', () => {
    const text = buildShareText({
      mode: 'emoji',
      dayIndex: 3,
      guessCount: 3,
      rows: [],
      url: 'https://example.com/navendle/',
    })
    expect(text).not.toMatch(/[ก-๙]{2,}\s*$/m.source.length ? /นัท|แบงค์|ปิง/ : /x/)
    expect(text).toContain('🟥🟥🟩')
  })
})
