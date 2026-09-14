<script setup lang="ts">
import { useSnack } from '../composables/useSnack'

const { message } = useSnack()
</script>

<template>
  <div
    v-if="message"
    role="status"
    aria-live="polite"
    class="snack-in fixed bottom-[calc(6.25rem+env(safe-area-inset-bottom))] left-1/2 sm:bottom-6 z-70 -translate-x-1/2 max-w-[90vw] rounded-lg bg-inverse-surface px-[18px] py-3.5 text-sm leading-5 font-medium text-inverse-on-surface shadow-[0_8px_24px_rgba(0,0,0,.5)]"
  >
    {{ message }}
  </div>
</template>
