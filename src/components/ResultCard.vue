<script setup lang="ts">
import { ref } from 'vue'
import type { Friend, GameMode } from '../game/types'
import { buildShareText, copyText, MODE_LABELS } from '../game/share'
import { useSnack } from '../composables/useSnack'
import type { GuessRow } from '../composables/useGame'
import FriendPhoto from './FriendPhoto.vue'
import CountdownNext from './CountdownNext.vue'
import MdIcon from './MdIcon.vue'

const props = defineProps<{
  answer: Friend
  mode: GameMode
  dayIndex: number
  guessCount: number
  rows: GuessRow[]
  freePlay: boolean
}>()
const emit = defineEmits<{ (e: 'again'): void; (e: 'rollover'): void }>()

const { toast } = useSnack()
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
  if (copied.value) {
    toast('คัดลอกผลแล้ว พร้อมแปะลงแชท')
    window.setTimeout(() => (copied.value = false), 2200)
  } else {
    toast('คัดลอกไม่ได้ ลองใหม่อีกครั้ง')
  }
}
</script>

<template>
  <section
    class="pop-in flex flex-col items-center gap-4 rounded-[28px] border border-primary-container bg-surface-c px-5 py-7 text-center"
  >
    <p class="m-0 inline-flex items-center gap-1.5 text-sm leading-5 font-semibold text-primary">
      <MdIcon name="celebration" :size="20" />
      ถูกต้อง! ใช้ไป {{ guessCount }} ครั้ง<template v-if="freePlay"> (ฟรีเพลย์ ไม่นับสถิติ)</template>
    </p>

    <div class="w-32">
      <FriendPhoto :friend="answer" circle />
    </div>

    <div>
      <p class="m-0 text-[32px] leading-10 font-bold text-on-surface">{{ answer.nickname }}</p>
      <p class="mt-1.5 mb-0 text-sm leading-5 text-tertiary italic">“{{ answer.reveal.signature }}”</p>
    </div>

    <div class="flex flex-wrap justify-center gap-2.5">
      <!-- ปุ่มหลักทรง filled ของ M3 -->
      <button
        v-if="!freePlay"
        type="button"
        class="inline-flex h-10 items-center gap-2 rounded-[20px] bg-primary px-6 text-sm font-semibold text-on-primary transition-[filter] hover:brightness-110"
        @click="share"
      >
        <MdIcon :name="copied ? 'check' : 'ios_share'" :size="18" />
        {{ copied ? 'คัดลอกแล้ว' : `แชร์ผล ${MODE_LABELS[mode]}` }}
      </button>
      <!-- ปุ่มรองทรง outlined -->
      <button
        type="button"
        class="inline-flex h-10 items-center rounded-[20px] border border-outline px-6 text-sm font-semibold text-primary transition-colors hover:bg-surface-high"
        @click="emit('again')"
      >
        {{ freePlay ? 'สุ่มใหม่อีกข้อ' : 'เล่นฟรีเพลย์ต่อ' }}
      </button>
    </div>

    <CountdownNext v-if="!freePlay" @rollover="emit('rollover')" />
  </section>
</template>
