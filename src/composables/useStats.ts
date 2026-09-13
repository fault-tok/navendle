import { ref } from 'vue'
import { EMPTY_STATS, loadStats, saveStats, type Stats } from '../game/storage'

const stats = ref<Stats>(loadStats())

function bucket(guessCount: number): string {
  return guessCount >= 8 ? '8+' : String(guessCount)
}

/** สถิติรวมทุกโหมด — เรียกครั้งเดียวตอนชนะแต่ละโหมดของวันนั้น */
export function useStats() {
  function recordWin(dayIndex: number, guessCount: number) {
    const s = stats.value
    s.played += 1
    s.wins += 1
    s.distribution[bucket(guessCount)] = (s.distribution[bucket(guessCount)] ?? 0) + 1
    // streak นับเป็น "วัน" ไม่ใช่ "โหมด" — ชนะหลายโหมดในวันเดียวกันบวกครั้งเดียว
    if (s.lastWonDayIndex !== dayIndex) {
      s.streak = s.lastWonDayIndex === dayIndex - 1 ? s.streak + 1 : 1
      s.maxStreak = Math.max(s.maxStreak, s.streak)
      s.lastWonDayIndex = dayIndex
    }
    saveStats(s)
  }

  /** ถ้าขาดไปเกิน 1 วันให้ streak ตกตั้งแต่ตอนเปิดเว็บ ไม่ต้องรอชนะรอบใหม่ */
  function refreshStreak(dayIndex: number) {
    const s = stats.value
    if (s.lastWonDayIndex !== null && s.lastWonDayIndex < dayIndex - 1 && s.streak !== 0) {
      s.streak = 0
      saveStats(s)
    }
  }

  function reset() {
    stats.value = { ...EMPTY_STATS, distribution: {} }
    saveStats(stats.value)
  }

  return { stats, recordWin, refreshStreak, reset }
}
