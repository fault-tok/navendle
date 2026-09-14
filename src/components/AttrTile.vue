<script setup lang="ts">
import { computed } from 'vue'
import type { AttrDef, AttrValue, TileResult } from '../game/types'
import MdIcon from './MdIcon.vue'

const props = defineProps<{
  def: AttrDef
  value: AttrValue
  result: TileResult
  /** ลำดับช่องในแถว ใช้หน่วงเวลาให้ช่องไล่โผล่ทีละช่อง */
  index: number
}>()

const text = computed(() => {
  const v = props.value
  if (Array.isArray(v)) return v.join(' · ')
  if (props.def.type === 'grouped') return String(v) === 'NONE' ? 'ไม่เล่น' : String(v)
  if (props.def.type === 'banded') {
    // โชว์แค่ช่วง ไม่เผยเลขจริง เช่น 175 -> "175–179 ซม."
    const lo = Math.floor(Number(v) / props.def.band) * props.def.band
    return `${lo}–${lo + props.def.band - 1}${props.def.suffix ?? ''}`
  }
  if (props.def.type === 'numericFuzzy' || props.def.type === 'numeric') {
    const suffix = 'suffix' in props.def ? (props.def.suffix ?? '') : ''
    return `${v}${suffix}`
  }
  return String(v)
})

const arrow = computed(() =>
  props.result.direction === 'up' ? 'arrow_drop_up' : props.result.direction === 'down' ? 'arrow_drop_down' : '',
)

/** ไอคอนกำกับสี เผื่อคนแยกสีไม่ออก (prop colorblindMarks ในดีไซน์ = เปิดไว้) */
const mark = computed(() => ({ hit: 'check', near: 'drag_handle', miss: 'close' })[props.result.state])

const tone = computed(
  () =>
    ({
      hit: 'bg-hit border-hit-bd text-hit-fg',
      near: 'bg-near border-near-bd text-near-fg',
      miss: 'bg-miss border-miss-bd text-miss-fg',
    })[props.result.state],
)

const srState = computed(
  () =>
    ({ hit: 'ถูก', near: 'ใกล้เคียง', miss: 'ผิด' })[props.result.state] +
    (props.result.direction === 'up' ? ' คำตอบมากกว่า' : props.result.direction === 'down' ? ' คำตอบน้อยกว่า' : ''),
)
</script>

<template>
  <span
    class="tile-in relative flex h-19 flex-col items-center justify-center gap-px rounded-xl border px-1.5 py-1 text-center"
    :class="tone"
    :style="{ animationDelay: `${index * 70}ms` }"
  >
    <span class="sr-only">{{ def.label }}: {{ text }} — {{ srState }}</span>
    <MdIcon :name="mark" :size="13" class="absolute top-[3px] right-1 opacity-75" />
    <span class="text-xs leading-[15px] font-semibold [overflow-wrap:anywhere] [text-wrap:pretty]">{{ text }}</span>
    <MdIcon v-if="arrow" :name="arrow" :size="18" />
  </span>
</template>
