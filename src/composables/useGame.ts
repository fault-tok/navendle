import { computed, ref, watch } from 'vue'
import type { Friend, GameMode, TileResult } from '../game/types'
import { ATTRIBUTES } from '../data/attributes'
import { compareFriend } from '../game/compare'
import { currentDayIndex, pickDaily } from '../game/daily'
import { loadProgress, saveProgress } from '../game/storage'
import { hashString, mulberry32 } from '../game/rng'
import { useStats } from './useStats'
import { friends, schemaVersion } from '../data/roster'

export interface GuessRow {
  friend: Friend
  tiles: TileResult[]
}

/** ให้ dev ข้ามวันได้ด้วย ?day=5 โดยไม่ต้องแก้นาฬิกาเครื่อง */
function dayOverride(): number | null {
  if (!import.meta.env.DEV) return null
  const raw = new URLSearchParams(location.search).get('day')
  if (raw === null) return null
  const n = Number(raw)
  return Number.isFinite(n) ? Math.trunc(n) : null
}

const sharedDayIndex = ref(dayOverride() ?? currentDayIndex())

export function useDayIndex() {
  return sharedDayIndex
}

/**
 * สร้าง state ของโหมดหนึ่ง
 * freePlay = เล่นรัวๆ ไม่เซฟ ไม่นับสถิติ
 */
export function useGame(mode: GameMode) {
  const { recordWin } = useStats()

  const dayIndex = sharedDayIndex
  const freePlay = ref(false)
  const freePlayAnswer = ref<Friend | null>(null)
  const guesses = ref<string[]>([])
  const won = ref(false)
  const justWon = ref(false)

  const answer = computed<Friend>(() =>
    freePlay.value && freePlayAnswer.value ? freePlayAnswer.value : pickDaily(friends, mode, dayIndex.value),
  )

  const rows = computed<GuessRow[]>(() =>
    guesses.value
      .map((id) => friends.find((f) => f.id === id))
      .filter((f): f is Friend => Boolean(f))
      .map((f) => ({ friend: f, tiles: compareFriend(ATTRIBUTES, f, answer.value) })),
  )

  const guessCount = computed(() => guesses.value.length)
  const wrongCount = computed(() => (won.value ? guessCount.value - 1 : guessCount.value))

  /** คนที่ยังไม่ถูกทายในรอบนี้ ใช้กรองรายการ autocomplete */
  const remaining = computed(() => friends.filter((f) => !guesses.value.includes(f.id)))

  /** วลีของวัน — สุ่มจาก quotes ของคำตอบแบบคงที่ต่อวัน จะได้ไม่เปลี่ยนตอน refresh */
  const quoteOfTheDay = computed(() => {
    const quotes = answer.value.reveal.quotes
    if (quotes.length === 0) return ''
    const rand = mulberry32(hashString(`${answer.value.id}|${dayIndex.value}|${freePlay.value ? 'free' : 'daily'}`))
    return quotes[Math.floor(rand() * quotes.length)]
  })

  function restore() {
    const saved = loadProgress(mode, dayIndex.value, schemaVersion)
    guesses.value = saved?.guesses ?? []
    won.value = saved?.status === 'won'
    justWon.value = false
  }

  function persist() {
    if (freePlay.value) return
    saveProgress(mode, {
      dayIndex: dayIndex.value,
      schemaVersion,
      guesses: guesses.value,
      status: won.value ? 'won' : 'playing',
    })
  }

  function guess(friendId: string): boolean {
    if (won.value || guesses.value.includes(friendId)) return false
    if (!friends.some((f) => f.id === friendId)) return false
    guesses.value = [...guesses.value, friendId]
    if (friendId === answer.value.id) {
      won.value = true
      justWon.value = true
      if (!freePlay.value) recordWin(dayIndex.value, guesses.value.length)
    }
    persist()
    return true
  }

  function startFreePlay() {
    freePlay.value = true
    const pool = friends.filter((f) => f.id !== answer.value.id)
    const pick = (pool.length ? pool : friends)[Math.floor(Math.random() * (pool.length || friends.length))]
    freePlayAnswer.value = pick
    guesses.value = []
    won.value = false
    justWon.value = false
  }

  function backToDaily() {
    freePlay.value = false
    freePlayAnswer.value = null
    restore()
  }

  restore()
  // ข้ามเที่ยงคืนระหว่างเปิดเว็บค้างไว้ → โหลดข้อใหม่ทันทีโดยไม่ต้อง refresh
  watch(dayIndex, () => {
    if (!freePlay.value) restore()
  })

  return {
    answer,
    rows,
    guesses,
    guessCount,
    wrongCount,
    won,
    justWon,
    remaining,
    quoteOfTheDay,
    freePlay,
    guess,
    startFreePlay,
    backToDaily,
  }
}
