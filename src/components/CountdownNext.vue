<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { msUntilNextPuzzle } from '../game/daily'

const emit = defineEmits<{ (e: 'rollover'): void }>()
const label = ref('')
let timer: number | undefined

function tick() {
  const ms = msUntilNextPuzzle()
  if (ms <= 1000) {
    emit('rollover')
    return
  }
  const total = Math.floor(ms / 1000)
  const h = String(Math.floor(total / 3600)).padStart(2, '0')
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0')
  const s = String(total % 60).padStart(2, '0')
  label.value = `${h}:${m}:${s}`
}

onMounted(() => {
  tick()
  timer = window.setInterval(tick, 1000)
})
onBeforeUnmount(() => window.clearInterval(timer))
</script>

<template>
  <p class="text-center text-xs text-cream/45">
    ข้อถัดไปอีก <span class="font-mono font-semibold text-bronze">{{ label }}</span>
  </p>
</template>
