<script setup lang="ts">
import type { GameMode } from '../game/types'
import { MODE_LABELS } from '../game/share'
import MdIcon from './MdIcon.vue'

defineProps<{ current: GameMode; done: Record<GameMode, boolean> }>()
const emit = defineEmits<{ (e: 'change', mode: GameMode): void }>()

const modes: { id: GameMode; icon: string }[] = [
  { id: 'classic', icon: 'table_rows' },
  { id: 'emoji', icon: 'mood' },
  { id: 'quote', icon: 'format_quote' },
  { id: 'silhouette', icon: 'blur_on' },
]
</script>

<template>
  <!--
    ดีไซน์ทำไว้ 2 แบบ (prop navStyle) แล้วเลือกใช้ตามความกว้างจอตามที่ M3 แนะนำ
    จอแคบ = navigation bar ล่างจอ / จอกว้าง = segmented button
  -->

  <!-- segmented button — จอ sm ขึ้นไป -->
  <nav aria-label="โหมดเกม" class="hidden pt-2 pb-1 sm:block">
    <div role="tablist" class="flex overflow-hidden rounded-[20px] border border-outline">
      <button
        v-for="(m, i) in modes"
        :key="m.id"
        role="tab"
        type="button"
        :aria-selected="current === m.id"
        class="inline-flex h-10 flex-1 items-center justify-center gap-1.5 px-2.5 text-sm font-medium transition-colors"
        :class="[
          i > 0 ? 'border-l border-outline' : '',
          current === m.id
            ? 'bg-secondary-container text-on-secondary-container'
            : 'text-on-surface-var hover:bg-surface-high hover:text-on-surface',
        ]"
        @click="emit('change', m.id)"
      >
        <MdIcon :name="m.icon" :size="18" />
        <span class="whitespace-nowrap">{{ MODE_LABELS[m.id] }}</span>
        <MdIcon
          v-if="done[m.id]"
          name="check_circle"
          :size="15"
          class="text-primary"
          :title="`เล่นจบแล้ววันนี้`"
        />
      </button>
    </div>
  </nav>

  <!-- navigation bar — จอแคบ ยึดล่างจอ -->
  <nav
    aria-label="โหมดเกม"
    class="fixed inset-x-0 bottom-0 z-30 flex justify-center gap-1 bg-surface-c px-2 pt-3 shadow-[0_-1px_0_var(--color-surface-high)] pb-[calc(1rem+env(safe-area-inset-bottom))] sm:hidden"
  >
    <button
      v-for="m in modes"
      :key="m.id"
      role="tab"
      type="button"
      :aria-selected="current === m.id"
      class="flex w-19 flex-col items-center gap-1"
      :class="current === m.id ? 'text-on-surface' : 'text-on-surface-var'"
      @click="emit('change', m.id)"
    >
      <span
        class="relative grid h-8 w-16 place-items-center rounded-2xl transition-colors"
        :class="current === m.id ? 'bg-secondary-container text-on-secondary-container' : ''"
      >
        <MdIcon :name="m.icon" />
        <!-- badge บอกว่าโหมดนี้เล่นจบแล้ววันนี้ — แบบ segmented ใช้ติ๊กถูกท้ายชื่อแทน -->
        <MdIcon
          v-if="done[m.id]"
          name="check_circle"
          :size="14"
          class="absolute top-0 right-2 rounded-full bg-surface-c text-primary"
          :title="`เล่นจบแล้ววันนี้`"
        />
      </span>
      <span class="text-xs leading-4 font-medium whitespace-nowrap">{{ MODE_LABELS[m.id] }}</span>
    </button>
  </nav>
</template>
