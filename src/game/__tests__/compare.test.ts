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

describe('numeric (ปีเกิด)', () => {
  const birthYear = byKey('birthYear')
  it('ตรงเป็นเขียวและไม่มีลูกศร', () => {
    expect(compareAttr(birthYear, 1995, 1995)).toEqual({ state: 'hit' })
  })
  it('ลูกศรชี้ไปทางคำตอบจริง', () => {
    expect(compareAttr(birthYear, 1990, 1995)).toEqual({ state: 'miss', direction: 'up' })
    expect(compareAttr(birthYear, 1999, 1995)).toEqual({ state: 'miss', direction: 'down' })
  })
})

describe('numericFuzzy (ส่วนสูง tolerance 4)', () => {
  const height = byKey('height')
  it('ห่าง 4 ซม. เป็นเหลือง แต่ 5 ซม. เป็นเทา', () => {
    expect(compareAttr(height, 171, 175)).toEqual({ state: 'near', direction: 'up' })
    expect(compareAttr(height, 170, 175)).toEqual({ state: 'miss', direction: 'up' })
    expect(compareAttr(height, 179, 175)).toEqual({ state: 'near', direction: 'down' })
    expect(compareAttr(height, 180, 175)).toEqual({ state: 'miss', direction: 'down' })
  })
  it('ตรงเป๊ะเป็นเขียว', () => {
    expect(compareAttr(height, 175, 175)).toEqual({ state: 'hit' })
  })
})

describe('ordinal (จำนวนแฟนเก่า)', () => {
  const exTier = byKey('exTier')
  it('ตรงเป็นเขียว', () => {
    expect(compareAttr(exTier, 'กลาง', 'กลาง')).toEqual({ state: 'hit' })
  })
  it('บอกทิศว่าคำตอบมากกว่าหรือน้อยกว่า', () => {
    expect(compareAttr(exTier, 'น้อย', 'มาก')).toEqual({ state: 'miss', direction: 'up' })
    expect(compareAttr(exTier, 'มาก', 'น้อย')).toEqual({ state: 'miss', direction: 'down' })
  })
})
