<script setup lang="ts">
import { computed } from 'vue'
import type { Friend } from '../game/types'
import FriendPhoto from './FriendPhoto.vue'

const props = defineProps<{ answer: Friend; wrongCount: number; revealAll: boolean }>()

// เบลอหนักมากตอนเริ่ม แล้วค่อยๆ ชัดขึ้นตามจำนวนครั้งที่ทายผิด
const BLUR_STEPS = [26, 20, 15, 11, 8, 5, 3, 1.5, 0]
const blur = computed(() => (props.revealAll ? 0 : BLUR_STEPS[Math.min(props.wrongCount, BLUR_STEPS.length - 1)]))
const scale = computed(() => (props.revealAll ? 1 : 1 + blur.value / 90))
const stepsLeft = computed(() => BLUR_STEPS.findIndex((b) => b === 0) - props.wrongCount)
</script>

<template>
  <div class="card flex flex-col items-center gap-3 rounded-2xl px-4 py-6">
    <p class="text-sm text-cream/50">รูปนี้คือใคร?</p>
    <div class="w-full max-w-xs">
      <FriendPhoto :friend="answer" :blur="blur" :scale="scale" />
    </div>
    <p v-if="!revealAll && stepsLeft > 0" class="text-xs text-cream/40">ทายผิดอีก {{ stepsLeft }} ครั้งจะเห็นรูปเต็ม</p>
  </div>
</template>
