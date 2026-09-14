<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import MdIcon from './MdIcon.vue'

withDefaults(defineProps<{ title: string; wide?: boolean }>(), { wide: false })
const emit = defineEmits<{ (e: 'close'): void }>()

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}
onMounted(() => document.addEventListener('keydown', onKey))
onBeforeUnmount(() => document.removeEventListener('keydown', onKey))
</script>

<template>
  <div
    class="fixed inset-0 z-60 grid place-items-center bg-black/60 p-4"
    role="dialog"
    aria-modal="true"
    :aria-label="title"
    @click.self="emit('close')"
  >
    <div
      class="pop-in max-h-[86dvh] w-full overflow-y-auto rounded-[28px] bg-surface-high p-6 shadow-[0_12px_40px_rgba(0,0,0,.6)]"
      :class="wide ? 'max-w-110' : 'max-w-90'"
    >
      <div class="mb-4 flex items-center justify-between gap-2">
        <h2 class="m-0 text-2xl leading-8 font-medium text-on-surface">{{ title }}</h2>
        <button
          type="button"
          class="grid h-10 w-10 shrink-0 place-items-center rounded-full text-on-surface-var transition-colors hover:bg-surface-highest hover:text-on-surface"
          aria-label="ปิด"
          @click="emit('close')"
        >
          <MdIcon name="close" />
        </button>
      </div>
      <slot />
    </div>
  </div>
</template>
