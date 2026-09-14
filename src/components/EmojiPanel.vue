<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ emoji: string; wrongCount: number; revealAll: boolean }>()

/** แยกทีละ grapheme ไม่งั้นอิโมจิที่ประกอบหลาย code point จะขาดกลาง */
const glyphs = computed(() => {
  const seg = new Intl.Segmenter('th', { granularity: 'grapheme' })
  return [...seg.segment(props.emoji)].map((s) => s.segment).filter((s) => s.trim())
})

// เริ่มเปิด 1 ตัว แล้วเปิดเพิ่มทีละตัวต่อการทายผิด 1 ครั้ง
const shown = computed(() =>
  props.revealAll ? glyphs.value.length : Math.min(1 + props.wrongCount, glyphs.value.length),
)
</script>

<template>
  <section class="flex flex-col items-center gap-3.5 rounded-[28px] bg-surface-low px-5 py-7">
    <p class="m-0 text-sm leading-5 text-on-surface-var">อิโมจิบอกคาแรคเตอร์ของใคร?</p>
    <div class="flex flex-wrap justify-center gap-3">
      <span
        v-for="(g, i) in glyphs"
        :key="i"
        class="grid h-16 w-16 place-items-center rounded-[20px] border transition-colors duration-200"
        :class="
          i < shown
            ? 'pop-in border-primary-border bg-primary-container text-[32px] text-on-primary-container'
            : 'border-dashed border-outline-var bg-surface-c text-xl text-outline'
        "
      >
        <span v-if="i < shown">{{ g }}</span>
        <span v-else aria-hidden="true">?</span>
      </span>
    </div>
    <p v-if="shown < glyphs.length" class="m-0 text-xs leading-4 text-outline">ทายผิดอีก 1 ครั้ง เปิดเพิ่มอีก 1 ตัว</p>
  </section>
</template>
