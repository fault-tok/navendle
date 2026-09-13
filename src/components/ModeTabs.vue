<script setup lang="ts">
import type { GameMode } from '../game/types'
import { MODE_LABELS } from '../game/share'

defineProps<{ current: GameMode; done: Record<GameMode, boolean> }>()
const emit = defineEmits<{ (e: 'change', mode: GameMode): void }>()

const modes: { id: GameMode; icon: string }[] = [
  { id: 'classic', icon: '📋' },
  { id: 'emoji', icon: '😎' },
  { id: 'quote', icon: '💬' },
  { id: 'silhouette', icon: '🖼️' },
]
</script>

<template>
  <nav class="scroll-x px-4 sm:px-6" aria-label="โหมดเกม">
    <div role="tablist" class="flex min-w-max gap-2 pb-1">
      <button
        v-for="m in modes"
        :key="m.id"
        role="tab"
        type="button"
        :aria-selected="current === m.id"
        class="flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-medium whitespace-nowrap transition"
        :class="
          current === m.id
            ? 'border-bronze bg-bronze/15 text-cream'
            : 'border-bronze/20 text-cream/60 hover:border-bronze/45 hover:text-cream/90'
        "
        @click="emit('change', m.id)"
      >
        <span aria-hidden="true">{{ m.icon }}</span>
        {{ MODE_LABELS[m.id] }}
        <span v-if="done[m.id]" class="text-hit" :title="`เล่นจบแล้ววันนี้`">✓</span>
      </button>
    </div>
  </nav>
</template>
