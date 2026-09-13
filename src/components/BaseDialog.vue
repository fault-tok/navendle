<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

defineProps<{ title: string }>()
const emit = defineEmits<{ (e: 'close'): void }>()

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}
onMounted(() => document.addEventListener('keydown', onKey))
onBeforeUnmount(() => document.removeEventListener('keydown', onKey))
</script>

<template>
  <div
    class="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink/80 p-4 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
    @click.self="emit('close')"
  >
    <div class="card pop-in my-auto w-full max-w-md rounded-2xl p-5">
      <div class="mb-3 flex items-start justify-between gap-3">
        <h2 class="font-display text-2xl tracking-wide text-cream">{{ title }}</h2>
        <button
          type="button"
          class="rounded-lg px-2 py-1 text-cream/50 transition hover:text-cream"
          aria-label="ปิด"
          @click="emit('close')"
        >
          ✕
        </button>
      </div>
      <slot />
    </div>
  </div>
</template>
