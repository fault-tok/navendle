import type { AttrDef } from '../game/types'
import { PROVINCES } from './provinces'

/** ตำแหน่งฟุตบอล → แนวที่สังกัด (ทายตำแหน่งผิดแต่แนวเดียวกัน = เหลือง) */
export const FOOTBALL_GROUPS = {
  GK: 'GK',
  CB: 'DF', LB: 'DF', RB: 'DF', LWB: 'DF', RWB: 'DF',
  CDM: 'MF', CM: 'MF', CAM: 'MF', LM: 'MF', RM: 'MF',
  LW: 'FW', RW: 'FW', ST: 'FW', CF: 'FW',
  NONE: 'NONE',
} as const

export const FOOTBALL_GROUP_LABELS = {
  GK: 'ผู้รักษาประตู',
  DF: 'กองหลัง',
  MF: 'กองกลาง',
  FW: 'กองหน้า',
  NONE: 'ไม่เล่นบอล',
} as const

/** ตัวเลือกมาตรฐาน — ไม่บังคับให้เลือกจากลิสต์ แต่ validate จะเตือนถ้าใส่ค่านอกลิสต์ เพื่อกันพิมพ์ไม่ตรงกัน */
export const SPORT_OPTIONS = [
  'ฟุตบอล', 'ฟุตซอล', 'บาสเกตบอล', 'วอลเลย์บอล', 'แบดมินตัน', 'ปิงปอง',
  'เทนนิส', 'ว่ายน้ำ', 'วิ่ง', 'จักรยาน', 'มวย', 'ยิม', 'ตะกร้อ', 'กอล์ฟ',
  'สนุกเกอร์', 'อีสปอร์ต', 'ไม่เล่นกีฬา',
] as const

export const VIBE_OPTIONS = [
  'สายเหล้า', 'สายเกม', 'สายเที่ยว', 'สายบ้าน', 'สายกิน', 'สายบุญ',
  'สายเทรด', 'สายฟิต', 'สายรถ', 'สายกล้อง', 'สายนอน', 'สายปั่น',
] as const

export const STATUS_OPTIONS = ['โสด', 'มีแฟน', 'แต่งงานแล้ว', 'ไม่ขอออกความเห็น'] as const

/** วันเกิด = วันในสัปดาห์ที่เกิด เรียงแบบไทยคือเริ่มวันอาทิตย์ */
export const WEEKDAY_OPTIONS = [
  'อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์',
] as const

/**
 * นิยามคอลัมน์ทั้งหมดของโหมดคลาสสิก
 * ลำดับใน array = ลำดับคอลัมน์ในตาราง
 * เพิ่มคอลัมน์ใหม่ = เพิ่ม 1 entry ตรงนี้ + เพิ่ม field ใน attrs ของทุกคน แล้วรัน npm run validate
 */
export const ATTRIBUTES: readonly AttrDef[] = [
  {
    key: 'birthday',
    label: 'วันเกิด',
    type: 'exact',
    options: WEEKDAY_OPTIONS,
    hint: 'วันในสัปดาห์ที่เกิด ตรงเป๊ะถึงจะเข้า',
  },
  {
    key: 'height',
    label: 'ส่วนสูง',
    type: 'banded',
    band: 5,
    suffix: ' ซม.',
    hint: 'บอกเป็นช่วงละ 5 ซม. ไม่บอกเลขจริง · เหลือง = ช่วงติดกัน',
  },
  {
    key: 'sports',
    label: 'กีฬาที่เคยเล่น',
    type: 'multi',
    options: SPORT_OPTIONS,
    hint: 'เหลือง = เล่นเหมือนกันบางอย่าง',
  },
  {
    key: 'football',
    label: 'ตำแหน่งบอล',
    type: 'grouped',
    groups: FOOTBALL_GROUPS,
    groupLabels: FOOTBALL_GROUP_LABELS,
    hint: 'เหลือง = คนละตำแหน่งแต่แนวเดียวกัน',
  },
  {
    key: 'status',
    label: 'สถานะตอนนี้',
    type: 'exact',
    options: STATUS_OPTIONS,
  },
  {
    key: 'vibe',
    label: 'สายอะไร',
    type: 'multi',
    options: VIBE_OPTIONS,
    hint: 'เหลือง = สายเดียวกันบางอย่าง',
  },
  {
    key: 'job',
    label: 'สายงาน',
    type: 'exact',
  },
  {
    key: 'province',
    label: 'อยู่จังหวัด',
    type: 'exact',
    options: PROVINCES,
  },
]

export const ATTRIBUTE_KEYS = ATTRIBUTES.map((a) => a.key)
