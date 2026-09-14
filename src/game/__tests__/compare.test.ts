import { describe, expect, it } from 'vitest'
import { compareAttr } from '../compare'
import { ATTRIBUTES } from '../../data/attributes'
import type { AttrDef } from '../types'

const byKey = (key: string): AttrDef => {
  const def = ATTRIBUTES.find((a) => a.key === key)
  if (!def) throw new Error(`ไม่มีคอลัมน์ ${key}`)
  return def
}

describe('exact', () => {
  it('ตรงเป๊ะเป็นเขียว ไม่ตรงเป็นเทา', () => {
    expect(compareAttr(byKey('province'), 'ชลบุรี', 'ชลบุรี')).toEqual({ state: 'hit' })
    expect(compareAttr(byKey('province'), 'ชลบุรี', 'ภูเก็ต')).toEqual({ state: 'miss' })
  })
})

describe('multi', () => {
  const sports = byKey('sports')
  it('เซ็ตเหมือนกันทั้งหมดเป็นเขียว ไม่สนลำดับ', () => {
    expect(compareAttr(sports, ['ฟุตบอล', 'วิ่ง'], ['วิ่ง', 'ฟุตบอล'])).toEqual({ state: 'hit' })
  })
  it('ซ้อนกันบางตัวเป็นเหลือง', () => {
    expect(compareAttr(sports, ['ฟุตบอล', 'วิ่ง'], ['ฟุตบอล'])).toEqual({ state: 'near' })
    expect(compareAttr(sports, ['ฟุตบอล'], ['ฟุตบอล', 'วิ่ง'])).toEqual({ state: 'near' })
  })
  it('ไม่ซ้อนกันเลยเป็นเทา', () => {
    expect(compareAttr(sports, ['กอล์ฟ'], ['มวย'])).toEqual({ state: 'miss' })
  })
})

describe('grouped (ตำแหน่งบอล)', () => {
  const football = byKey('football')
  it('ตำแหน่งตรงเป็นเขียว', () => {
    expect(compareAttr(football, 'CB', 'CB')).toEqual({ state: 'hit' })
  })
  it('คนละตำแหน่งแต่แนวเดียวกันเป็นเหลือง', () => {
    expect(compareAttr(football, 'CB', 'LB')).toEqual({ state: 'near' })
    expect(compareAttr(football, 'CM', 'CAM')).toEqual({ state: 'near' })
  })
  it('คนละแนวเป็นเทา', () => {
    expect(compareAttr(football, 'CB', 'ST')).toEqual({ state: 'miss' })
    expect(compareAttr(football, 'GK', 'CB')).toEqual({ state: 'miss' })
  })
  it('ไม่เล่นบอลทั้งคู่เป็นเขียว แต่ไม่เล่นกับเล่นเป็นเทา', () => {
    expect(compareAttr(football, 'NONE', 'NONE')).toEqual({ state: 'hit' })
    expect(compareAttr(football, 'NONE', 'ST')).toEqual({ state: 'miss' })
  })
})

describe('วันเกิด (exact 7 วัน)', () => {
  const birthday = byKey('birthday')
  it('วันเดียวกันเป็นเขียว คนละวันเป็นเทา ไม่มีลูกศร', () => {
    expect(compareAttr(birthday, 'จันทร์', 'จันทร์')).toEqual({ state: 'hit' })
    expect(compareAttr(birthday, 'จันทร์', 'เสาร์')).toEqual({ state: 'miss' })
  })
  it('วันติดกันก็ยังเป็นเทา — วันเกิดไม่มีใกล้เคียง', () => {
    expect(compareAttr(birthday, 'จันทร์', 'อังคาร')).toEqual({ state: 'miss' })
  })
})

describe('banded (ส่วนสูงช่วงละ 5 ซม.)', () => {
  const height = byKey('height')
  it('อยู่ช่วงเดียวกันเป็นเขียว ถึงเลขจริงจะไม่เท่ากัน', () => {
    expect(compareAttr(height, 175, 175)).toEqual({ state: 'hit' })
    expect(compareAttr(height, 175, 179)).toEqual({ state: 'hit' })
    expect(compareAttr(height, 179, 175)).toEqual({ state: 'hit' })
  })
  it('ช่วงติดกันเป็นเหลืองพร้อมลูกศร', () => {
    expect(compareAttr(height, 174, 175)).toEqual({ state: 'near', direction: 'up' })
    expect(compareAttr(height, 180, 179)).toEqual({ state: 'near', direction: 'down' })
  })
  it('ห่างเกิน 1 ช่วงเป็นเทา', () => {
    expect(compareAttr(height, 169, 175)).toEqual({ state: 'miss', direction: 'up' })
    expect(compareAttr(height, 185, 179)).toEqual({ state: 'miss', direction: 'down' })
  })
  it('ห่างแค่ 1 ซม. แต่คนละช่วง ยังเป็นเหลืองไม่ใช่เขียว', () => {
    expect(compareAttr(height, 174, 175)).toEqual({ state: 'near', direction: 'up' })
  })
})

describe('numeric / numericFuzzy (ยังมีในเอนจิน เผื่อเพิ่มคอลัมน์ใหม่)', () => {
  const numeric: AttrDef = { key: 'n', label: 'n', type: 'numeric' }
  const fuzzy: AttrDef = { key: 'f', label: 'f', type: 'numericFuzzy', tolerance: 4 }
  it('numeric ตรงเป็นเขียว ไม่ตรงมีลูกศร', () => {
    expect(compareAttr(numeric, 1995, 1995)).toEqual({ state: 'hit' })
    expect(compareAttr(numeric, 1990, 1995)).toEqual({ state: 'miss', direction: 'up' })
    expect(compareAttr(numeric, 1999, 1995)).toEqual({ state: 'miss', direction: 'down' })
  })
  it('numericFuzzy ห่างไม่เกิน tolerance เป็นเหลือง', () => {
    expect(compareAttr(fuzzy, 171, 175)).toEqual({ state: 'near', direction: 'up' })
    expect(compareAttr(fuzzy, 170, 175)).toEqual({ state: 'miss', direction: 'up' })
  })
})

describe('ordinal (ยังมีในเอนจิน เผื่อเพิ่มคอลัมน์ใหม่)', () => {
  const tier: AttrDef = { key: 't', label: 't', type: 'ordinal', scale: ['น้อย', 'กลาง', 'มาก'] }
  it('ตรงเป็นเขียว', () => {
    expect(compareAttr(tier, 'กลาง', 'กลาง')).toEqual({ state: 'hit' })
  })
  it('บอกทิศว่าคำตอบมากกว่าหรือน้อยกว่า', () => {
    expect(compareAttr(tier, 'น้อย', 'มาก')).toEqual({ state: 'miss', direction: 'up' })
    expect(compareAttr(tier, 'มาก', 'น้อย')).toEqual({ state: 'miss', direction: 'down' })
  })
})
