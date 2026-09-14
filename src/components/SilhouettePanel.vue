<script setup lang="ts">
import { computed } from 'vue'
import type { Friend } from '../game/types'
import FriendPhoto from './FriendPhoto.vue'

const props = defineProps<{ answer: Friend; wrongCount: number; revealAll: boolean }>()

// เบลอหนักมากตอนเริ่ม แล้วค่อยๆ ชัดขึ้นตามจำนวนครั้งที่ทายผิด
const BLUR_STEPS = [26, 20, 15, 11, 8, 5, 3, 1.5, 0]
const blur = computed(() =>
  props.revealAll ? 0 : BLUR_STEPS[Math.min(props.wrongCount, BLUR_STEPS.length - 1)],
)
const scale = computed(() => (props.revealAll ? 1 : 1 + blur.value / 90))
const stepsLeft = computed(() => BLUR_STEPS.findIndex((b) => b === 0) - props.wrongCount)
</script>

<template>
  <section class="flex flex-col items-center gap-3.5 rounded-[28px] bg-surface-low px-5 py-7">
    <p class="m-0 text-sm leading-5 text-on-surface-var">รูปจะชัดขึ้นทุกครั้งที่ทายผิด</p>
    <div class="w-42 max-w-full">
      <FriendPhoto :friend="answer" :blur="blur" :scale="scale" circle />
    </div>
    <p v-if="!revealAll && stepsLeft > 0" class="m-0 text-xs leading-4 text-outline">
      ทายผิดอีก {{ stepsLeft }} ครั้งจะเห็นรูปเต็ม
    </p>
  </section>
</template>
