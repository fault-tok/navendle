<script setup lang="ts">
import { computed } from 'vue'
import type { Friend } from '../game/types'
import { FOOTBALL_GROUPS, FOOTBALL_GROUP_LABELS } from '../data/attributes'

const props = defineProps<{ quote: string; answer: Friend; wrongCount: number; revealAll: boolean }>()

/** ปลดคำใบ้ที่ทายผิดครั้งที่ 2 / 4 / 6 */
const HINT_STEPS = [2, 4, 6]

const hints = computed(() => {
  const a = props.answer.attrs
  const group = FOOTBALL_GROUPS[String(a.football) as keyof typeof FOOTBALL_GROUPS]
  return [
    { label: 'สายอะไร', value: Array.isArray(a.vibe) ? a.vibe.join(' · ') : String(a.vibe) },
    { label: 'ตำแหน่งบอล', value: FOOTBALL_GROUP_LABELS[group as keyof typeof FOOTBALL_GROUP_LABELS] ?? '—' },
    { label: 'ปีเกิด', value: String(a.birthYear) },
  ].map((h, i) => ({ ...h, unlocked: props.revealAll || props.wrongCount >= HINT_STEPS[i], at: HINT_STEPS[i] }))
})
</script>

<template>
  <div class="card flex flex-col gap-4 rounded-2xl px-4 py-7">
    <p class="text-center text-sm text-cream/50">ใครพูดประโยคนี้ประจำ?</p>
    <blockquote class="text-center text-xl leading-relaxed font-semibold text-cream sm:text-2xl">
      <span class="text-bronze">“</span>{{ quote }}<span class="text-bronze">”</span>
    </blockquote>

    <div class="grid gap-1.5 sm:grid-cols-3">
      <div
        v-for="h in hints"
        :key="h.label"
        class="rounded-lg border px-3 py-2 text-center transition"
        :class="h.unlocked ? 'pop-in border-bronze/35 bg-bronze/10' : 'border-bronze/12 bg-ink/30'"
      >
        <p class="text-[11px] text-cream/40">{{ h.label }}</p>
        <p v-if="h.unlocked" class="text-sm font-semibold">{{ h.value }}</p>
        <p v-else class="text-xs text-cream/30">ผิดครบ {{ h.at }} ครั้งถึงเปิด</p>
      </div>
    </div>
  </div>
</template>
