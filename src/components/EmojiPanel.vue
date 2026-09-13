<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ emoji: string; wrongCount: number; revealAll: boolean }>()

/** แยกทีละ grapheme ไม่งั้นอิโมจิที่ประกอบหลาย code point จะขาดกลาง */
const glyphs = computed(() => {
  const seg = new Intl.Segmenter('th', { granularity: 'grapheme' })
  return [...seg.segment(props.emoji)].map((s) => s.segment).filter((s) => s.trim())
})

// เริ่มเปิด 1 ตัว แล้วเปิดเพิ่มทีละตัวต่อการทายผิด 1 ครั้ง
const shown = computed(() => (props.revealAll ? glyphs.value.length : Math.min(1 + props.wrongCount, glyphs.value.length)))
</script>

<template>
  <div class="card flex flex-col items-center gap-3 rounded-2xl px-4 py-7">
    <p class="text-sm text-cream/50">อิโมจิบอกคาแรคเตอร์ของใคร?</p>
    <div class="flex flex-wrap justify-center gap-3">
      <span
        v-for="(g, i) in glyphs"
        :key="i"
        class="grid h-14 w-14 place-items-center rounded-xl border text-3xl transition-all duration-300 sm:h-16 sm:w-16 sm:text-4xl"
        :class="i < shown ? 'pop-in border-bronze/40 bg-bronze/10' : 'border-bronze/15 bg-ink/40'"
      >
        <span v-if="i < shown">{{ g }}</span>
        <span v-else aria-hidden="true" class="text-lg text-cream/25">?</span>
      </span>
    </div>
    <p v-if="shown < glyphs.length" class="text-xs text-cream/40">ทายผิดอีก 1 ครั้ง เปิดเพิ่มอีก 1 ตัว</p>
  </div>
</template>
