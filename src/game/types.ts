/** สถานะของช่องผลทาย 1 ช่อง */
export type TileState = 'hit' | 'near' | 'miss'

/** ทิศทางของคำใบ้ตัวเลข/ลำดับ — คำตอบจริงสูงกว่า (up) หรือต่ำกว่า (down) ที่ทายมา */
export type Direction = 'up' | 'down'

export interface TileResult {
  state: TileState
  direction?: Direction
}

/** ชนิดการเทียบของแต่ละคอลัมน์ ดูวิธีคิดใน game/compare.ts */
export type AttrType =
  | 'exact' // ตรงเป๊ะ = เขียว นอกนั้นเทา
  | 'multi' // อาร์เรย์ เหมือนทั้งเซ็ต = เขียว ซ้อนกันบางตัว = เหลือง
  | 'grouped' // มีกลุ่มแม่ เช่น ตำแหน่งบอล CM อยู่กลุ่ม MF
  | 'numeric' // ตัวเลข ตรง = เขียว ไม่ตรง = เทา + ลูกศร
  | 'numericFuzzy' // ตัวเลข ห่างไม่เกิน tolerance = เหลือง + ลูกศร
  | 'banded' // ตัวเลขที่หั่นเป็นช่วง เช่น ส่วนสูงช่วงละ 5 ซม. ช่วงเดียวกัน = เขียว ช่วงติดกัน = เหลือง + ลูกศร (ซ่อนเลขจริง)
  | 'ordinal' // ค่ามีลำดับ เช่น น้อย < กลาง < มาก

interface AttrBase {
  key: string
  label: string
  /** คำอธิบายสั้นๆ ใต้หัวคอลัมน์ในหน้าวิธีเล่น */
  hint?: string
}

export type AttrDef = AttrBase &
  (
    | { type: 'exact'; options?: readonly string[] }
    | { type: 'multi'; options?: readonly string[] }
    | { type: 'grouped'; groups: Readonly<Record<string, string>>; groupLabels: Readonly<Record<string, string>> }
    | { type: 'numeric'; suffix?: string }
    | { type: 'numericFuzzy'; tolerance: number; suffix?: string }
    | { type: 'banded'; band: number; suffix?: string }
    | { type: 'ordinal'; scale: readonly string[] }
  )

export type AttrValue = string | number | string[]

export interface Friend {
  id: string
  nickname: string
  aliases: string[]
  photo: string
  attrs: Record<string, AttrValue>
  reveal: {
    signature: string
    emoji: string
    quotes: string[]
  }
}

export interface FriendsFile {
  schemaVersion: number
  group: string
  updatedAt: string
  friends: Friend[]
}

export type GameMode = 'classic' | 'emoji' | 'quote' | 'silhouette'
export type GameStatus = 'playing' | 'won'
