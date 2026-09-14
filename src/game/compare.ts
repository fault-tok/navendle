import type { AttrDef, AttrValue, Direction, Friend, TileResult } from './types'

function asArray(v: AttrValue): string[] {
  return Array.isArray(v) ? v : [String(v)]
}

function directionOf(answer: number, guess: number): Direction | undefined {
  if (answer === guess) return undefined
  return answer > guess ? 'up' : 'down'
}

/** เทียบค่า 1 คอลัมน์ ระหว่างคนที่ทายกับคำตอบ */
export function compareAttr(def: AttrDef, guessValue: AttrValue, answerValue: AttrValue): TileResult {
  switch (def.type) {
    case 'exact':
      return { state: guessValue === answerValue ? 'hit' : 'miss' }

    case 'multi': {
      const g = asArray(guessValue)
      const a = asArray(answerValue)
      const overlap = g.filter((x) => a.includes(x))
      if (overlap.length === g.length && overlap.length === a.length) return { state: 'hit' }
      return { state: overlap.length > 0 ? 'near' : 'miss' }
    }

    case 'grouped': {
      if (guessValue === answerValue) return { state: 'hit' }
      const gGroup = def.groups[String(guessValue)]
      const aGroup = def.groups[String(answerValue)]
      // ไม่เล่นบอลทั้งคู่ถือว่าตรงไปแล้วด้านบน — กลุ่ม NONE ไม่ให้เหลือง
      if (gGroup && aGroup && gGroup === aGroup && gGroup !== 'NONE') return { state: 'near' }
      return { state: 'miss' }
    }

    case 'numeric': {
      const g = Number(guessValue)
      const a = Number(answerValue)
      if (g === a) return { state: 'hit' }
      return { state: 'miss', direction: directionOf(a, g) }
    }

    case 'numericFuzzy': {
      const g = Number(guessValue)
      const a = Number(answerValue)
      if (g === a) return { state: 'hit' }
      const state = Math.abs(a - g) <= def.tolerance ? 'near' : 'miss'
      return { state, direction: directionOf(a, g) }
    }

    case 'banded': {
      // หั่นเป็นช่วงก่อนค่อยเทียบ เกมจะไม่เผยเลขจริง บอกแค่ว่าอยู่ช่วงไหน
      const g = Math.floor(Number(guessValue) / def.band)
      const a = Math.floor(Number(answerValue) / def.band)
      if (g === a) return { state: 'hit' }
      // ช่วงติดกันถือว่าใกล้ — ลูกศรเทียบจากช่วง ไม่ใช่เลขจริง จะได้ไม่ขัดกับสีที่เห็น
      return { state: Math.abs(a - g) === 1 ? 'near' : 'miss', direction: directionOf(a, g) }
    }

    case 'ordinal': {
      const gi = def.scale.indexOf(String(guessValue))
      const ai = def.scale.indexOf(String(answerValue))
      if (gi === ai) return { state: 'hit' }
      if (gi < 0 || ai < 0) return { state: 'miss' }
      return { state: 'miss', direction: directionOf(ai, gi) }
    }
  }
}

/** เทียบทั้งแถว ตามลำดับคอลัมน์ที่กำหนดใน attributes.ts */
export function compareFriend(attributes: readonly AttrDef[], guess: Friend, answer: Friend): TileResult[] {
  return attributes.map((def) => compareAttr(def, guess.attrs[def.key], answer.attrs[def.key]))
}
