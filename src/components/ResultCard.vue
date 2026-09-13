<script setup lang="ts">
import { ref } from 'vue'
import type { Friend, GameMode } from '../game/types'
import { buildShareText, copyText, MODE_LABELS } from '../game/share'
import type { GuessRow } from '../composables/useGame'
import FriendPhoto from './FriendPhoto.vue'
import CountdownNext from './CountdownNext.vue'

const props = defineProps<{
  answer: Friend
  mode: GameMode
  dayIndex: number
  guessCount: number
  rows: GuessRow[]
  freePlay: boolean
}>()
const emit = defineEmits<{ (e: 'again'): void; (e: 'rollover'): void }>()

const copied = ref(false)

async function share() {
  const text = buildShareText({
    mode: props.mode,
    dayIndex: props.dayIndex,
    guessCount: props.guessCount,
    // โหมดอื่นไม่มีตาราง ส่ง [] ไปให้ share สร้างแถบสั้นๆ แทน
    rows: props.mode === 'classic' ? props.rows.map((r) => r.tiles) : [],
    url: location.origin + location.pathname,
  })
  copied.value = await copyText(text)
  if (copied.value) window.setTimeout(() => (copied.value = false), 2200)
}
</script>

<template>
  <div class="card pop-in flex flex-col items-center gap-4 rounded-2xl px-4 py-6 text-center">
    <p class="text-sm text-hit">
      ถูกต้อง! ใช้ไป {{ guessCount }} ครั้ง
      <span v-if="freePlay" class="text-cream/40">(ฟรีเพลย์ ไม่นับสถิติ)</span>
    </p>

    <div class="w-32 sm:w-36">
      <FriendPhoto :friend="answer" />
    </div>

    <div>
      <p class="font-display text-3xl font-bold tracking-tight text-cream">{{ answer.nickname }}</p>
      <p class="mt-1 max-w-sm text-sm text-bronze italic">“{{ answer.reveal.signature }}”</p>
    </div>

    <div class="flex flex-wrap justify-center gap-2">
      <button
        v-if="!freePlay"
        type="button"
        class="rounded-xl border border-bronze bg-bronze/15 px-4 py-2.5 text-sm font-semibold text-cream transition hover:bg-bronze/25"
        @click="share"
      >
        {{ copied ? '✓ คัดลอกแล้ว' : `แชร์ผล ${MODE_LABELS[mode]}` }}
      </button>
      <button
        type="button"
        class="rounded-xl border border-bronze/25 px-4 py-2.5 text-sm text-cream/80 transition hover:border-bronze/55 hover:text-cream"
        @click="emit('again')"
      >
        {{ freePlay ? 'สุ่มใหม่อีกข้อ' : 'เล่นฟรีเพลย์ต่อ' }}
      </button>
    </div>

    <CountdownNext v-if="!freePlay" @rollover="emit('rollover')" />
  </div>
</template>
