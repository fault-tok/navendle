// ตรวจ src/data/friends.json ก่อน build — ฟ้องเป็นภาษาไทยพร้อมบอกว่าใครขาดอะไร
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const errors = []
const warnings = []

function fail(msg) { errors.push(msg) }
function warn(msg) { warnings.push(msg) }

/** อ่าน export ที่เป็น array ของสตริงจากไฟล์ .ts โดยไม่ต้อง compile */
function readStringArray(file, exportName) {
  const src = readFileSync(resolve(root, file), 'utf8')
  const start = src.indexOf(`export const ${exportName}`)
  if (start === -1) throw new Error(`หา export ${exportName} ใน ${file} ไม่เจอ`)
  const open = src.indexOf('[', start)
  const close = src.indexOf(']', open)
  return (src.slice(open, close).match(/'[^']*'/g) ?? []).map((s) => s.slice(1, -1))
}

/** อ่านนิยามคอลัมน์จาก attributes.ts แบบหยาบๆ พอให้ validate ได้โดยไม่ต้องมี ts runtime */
function readAttributes() {
  const src = readFileSync(resolve(root, 'src/data/attributes.ts'), 'utf8')
  const block = src.slice(src.indexOf('export const ATTRIBUTES'))
  const defs = []
  const re = /key:\s*'([^']+)',\s*\n\s*label:\s*'([^']+)',\s*\n\s*type:\s*'([^']+)'/g
  let m
  while ((m = re.exec(block))) defs.push({ key: m[1], label: m[2], type: m[3] })
  return defs
}

const attributes = readAttributes()
const sportOptions = readStringArray('src/data/attributes.ts', 'SPORT_OPTIONS')
const vibeOptions = readStringArray('src/data/attributes.ts', 'VIBE_OPTIONS')
const statusOptions = readStringArray('src/data/attributes.ts', 'STATUS_OPTIONS')
const exTiers = readStringArray('src/data/attributes.ts', 'EX_TIERS')
const provinces = readStringArray('src/data/provinces.ts', 'PROVINCES')
const footballPositions = Object.keys(
  Object.fromEntries(
    (readFileSync(resolve(root, 'src/data/attributes.ts'), 'utf8')
      .match(/FOOTBALL_GROUPS = \{([\s\S]*?)\} as const/)?.[1]
      .match(/(\w+):\s*'/g) ?? []).map((s) => [s.replace(/:\s*'$/, ''), true]),
  ),
)

const optionsByKey = {
  sports: sportOptions,
  vibe: vibeOptions,
  status: statusOptions,
  exTier: exTiers,
  province: provinces,
  football: footballPositions,
}

const dataPath = resolve(root, 'src/data/friends.json')
if (!existsSync(dataPath)) {
  console.error('❌ ไม่พบ src/data/friends.json — ก๊อป friends.example.json มาตั้งชื่อใหม่ก่อน')
  process.exit(1)
}

let data
try {
  data = JSON.parse(readFileSync(dataPath, 'utf8'))
} catch (e) {
  console.error(`❌ friends.json ไม่ใช่ JSON ที่ถูกต้อง: ${e.message}`)
  process.exit(1)
}

if (typeof data.schemaVersion !== 'number') fail('ไฟล์ขาด schemaVersion (ต้องเป็นตัวเลข)')
if (!Array.isArray(data.friends)) {
  console.error('❌ friends ต้องเป็น array')
  process.exit(1)
}
if (data.friends.length < 2) fail(`ต้องมีเพื่อนอย่างน้อย 2 คนถึงจะเล่นได้ (ตอนนี้มี ${data.friends.length})`)

const seenIds = new Set()
const seenNicknames = new Set()

for (const [i, f] of data.friends.entries()) {
  const who = f?.nickname ?? f?.id ?? `ลำดับที่ ${i + 1}`

  for (const field of ['id', 'nickname', 'photo']) {
    if (typeof f?.[field] !== 'string' || !f[field].trim()) fail(`[${who}] ขาด field "${field}"`)
  }
  if (f?.id && !/^[a-z0-9-]+$/.test(f.id)) fail(`[${who}] id "${f.id}" ต้องเป็น a-z 0-9 และ - เท่านั้น`)
  if (f?.id && seenIds.has(f.id)) fail(`id ซ้ำ: "${f.id}"`)
  seenIds.add(f?.id)

  const nick = f?.nickname?.trim()
  if (nick && seenNicknames.has(nick)) fail(`ชื่อเล่นซ้ำ: "${nick}" — เกมจะแยกไม่ออกตอนทาย`)
  seenNicknames.add(nick)

  if (!Array.isArray(f?.aliases)) fail(`[${who}] aliases ต้องเป็น array (ใส่ [] ได้ถ้าไม่มี)`)

  if (f?.photo && !existsSync(resolve(root, 'public', f.photo))) {
    warn(`[${who}] ไม่พบไฟล์รูป public/${f.photo} — โหมดรูปเบลอจะขึ้นรูปสำรองแทน`)
  }

  const attrs = f?.attrs ?? {}
  for (const def of attributes) {
    const v = attrs[def.key]
    if (v === undefined || v === null || v === '') {
      fail(`[${who}] ขาด attrs.${def.key} (${def.label})`)
      continue
    }
    if (def.type === 'numeric' || def.type === 'numericFuzzy') {
      if (typeof v !== 'number' || !Number.isFinite(v)) fail(`[${who}] attrs.${def.key} ต้องเป็นตัวเลข`)
      continue
    }
    if (def.type === 'multi') {
      if (!Array.isArray(v) || v.length === 0) {
        fail(`[${who}] attrs.${def.key} ต้องเป็น array และห้ามว่าง`)
        continue
      }
      const options = optionsByKey[def.key]
      for (const item of v) {
        if (options && !options.includes(item)) {
          warn(`[${who}] attrs.${def.key} มีค่า "${item}" นอกลิสต์มาตรฐาน — ระวังสะกดไม่ตรงกับคนอื่น`)
        }
      }
      continue
    }
    if (typeof v !== 'string') {
      fail(`[${who}] attrs.${def.key} ต้องเป็นข้อความ`)
      continue
    }
    const options = optionsByKey[def.key]
    if (options && !options.includes(v)) {
      const msg = `[${who}] attrs.${def.key} = "${v}" ไม่อยู่ในลิสต์ที่กำหนด`
      // จังหวัด/ตำแหน่งบอล/tier ต้องตรงลิสต์เป๊ะ เพราะเกมใช้เทียบตรงๆ
      if (['province', 'football', 'exTier', 'status'].includes(def.key)) fail(msg)
      else warn(msg)
    }
  }

  const extraKeys = Object.keys(attrs).filter((k) => !attributes.some((a) => a.key === k))
  if (extraKeys.length) warn(`[${who}] มี attrs ที่เกมไม่ได้ใช้: ${extraKeys.join(', ')}`)

  const reveal = f?.reveal ?? {}
  if (typeof reveal.signature !== 'string' || !reveal.signature.trim()) fail(`[${who}] ขาด reveal.signature`)
  if (typeof reveal.emoji !== 'string') fail(`[${who}] ขาด reveal.emoji`)
  else {
    const count = [...new Intl.Segmenter().segment(reveal.emoji)].length
    if (count < 3) fail(`[${who}] reveal.emoji ต้องมีอย่างน้อย 3 ตัว (ตอนนี้ ${count})`)
  }
  if (!Array.isArray(reveal.quotes) || reveal.quotes.length === 0) fail(`[${who}] reveal.quotes ต้องมีอย่างน้อย 1 วลี`)
}

for (const w of warnings) console.warn(`⚠️  ${w}`)
for (const e of errors) console.error(`❌ ${e}`)

if (errors.length) {
  console.error(`\nไม่ผ่าน: ${errors.length} ข้อผิดพลาด`)
  process.exit(1)
}
console.log(`✅ ข้อมูลผ่าน — เพื่อน ${data.friends.length} คน, คอลัมน์ ${attributes.length} ช่อง${warnings.length ? `, คำเตือน ${warnings.length} ข้อ` : ''}`)
