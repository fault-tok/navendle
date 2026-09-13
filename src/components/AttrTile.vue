<script setup lang="ts">
import { computed } from 'vue'
import type { AttrDef, AttrValue, TileResult } from '../game/types'

const props = defineProps<{
  def: AttrDef
  value: AttrValue
  result: TileResult
  /** ลำดับช่องในแถว ใช้หน่วงเวลา flip ให้ไล่ทีละช่อง */
  index: number
}>()

const text = computed(() => {
  const v = props.value
  if (Array.isArray(v)) return v.join(' · ')
  if (props.def.type === 'grouped') return String(v) === 'NONE' ? 'ไม่เล่น' : String(v)
  if (props.def.type === 'numericFuzzy' || props.def.type === 'numeric') {
    const suffix = 'suffix' in props.def ? (props.def.suffix ?? '') : ''
    return `${v}${suffix}`
  }
  return String(v)
})

const arrow = computed(() => (props.result.direction === 'up' ? '▲' : props.result.direction === 'down' ? '▼' : ''))

/** ไอคอนกำกับสี เผื่อคนตาบอดสีแยกเขียว/เหลืองไม่ออก */
const mark = computed(() => ({ hit: '✓', near: '~', miss: '✕' })[props.result.state])

const tone = computed(
  () =>
    ({
      hit: 'bg-hit/85 border-hit text-white',
      near: 'bg-near/85 border-near text-ink',
      miss: 'bg-miss/60 border-miss/80 text-cream/80',
    })[props.result.state],
)

const srState = computed(
  () => ({ hit: 'ถูก', near: 'ใกล้เคียง', miss: 'ผิด' })[props.result.state] +
    (props.result.direction === 'up' ? ' คำตอบมากกว่า' : props.result.direction === 'down' ? ' คำตอบน้อยกว่า' : ''),
)
</script>

<template>
  <div
    class="tile-flip relative flex h-20 w-[5.5rem] shrink-0 flex-col items-center justify-center gap-0.5 rounded-lg border px-1.5 text-center sm:w-24"
    :class="tone"
    :style="{ animationDelay: `${index * 90}ms` }"
  >
    <span class="sr-only">{{ def.label }}: {{ text }} — {{ srState }}</span>
    <span aria-hidden="true" class="absolute top-1 right-1.5 text-[10px] leading-none opacity-70">{{ mark }}</span>
    <span aria-hidden="true" class="text-xs leading-tight font-semibold break-words hyphens-auto">{{ text }}</span>
    <span v-if="arrow" aria-hidden="true" class="text-sm leading-none">{{ arrow }}</span>
  </div>
</template>
