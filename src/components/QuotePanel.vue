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
    { label: 'วันเกิด', value: String(a.birthday) },
  ].map((h, i) => ({ ...h, unlocked: props.revealAll || props.wrongCount >= HINT_STEPS[i], at: HINT_STEPS[i] }))
})
</script>

<template>
  <section class="flex flex-col gap-[18px] rounded-[28px] bg-surface-low px-5 py-7">
    <p class="m-0 text-center text-sm leading-5 text-on-surface-var">ใครพูดประโยคนี้ประจำ?</p>
    <blockquote class="m-0 text-center text-[26px] leading-9 font-semibold text-on-surface">
      <span class="text-tertiary">“</span>{{ quote }}<span class="text-tertiary">”</span>
    </blockquote>

    <div class="grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))]">
      <div
        v-for="h in hints"
        :key="h.label"
        class="rounded-2xl border px-3 py-2.5 text-center"
        :class="
          h.unlocked
            ? 'pop-in border-secondary-container bg-secondary-container text-on-secondary-container'
            : 'border-dashed border-outline-var text-on-surface-var'
        "
      >
        <p class="m-0 text-[11px] leading-4 tracking-wide text-outline">{{ h.label }}</p>
        <p class="mt-[3px] mb-0 text-sm leading-5 font-semibold">
          {{ h.unlocked ? h.value : `ผิดครบ ${h.at} ครั้งถึงเปิด` }}
        </p>
      </div>
    </div>
  </section>
</template>
