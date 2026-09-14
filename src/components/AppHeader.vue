<script setup lang="ts">
import MdIcon from './MdIcon.vue'

defineProps<{ streak: number }>()
const emit = defineEmits<{ (e: 'open', dialog: 'stats' | 'howto'): void }>()
const logo = `${import.meta.env.BASE_URL}logo-n.png`
</script>

<template>
  <header class="flex items-center gap-3 pt-4 pb-2">
    <img :src="logo" alt="" class="h-10 w-10 shrink-0 object-contain" />
    <div class="min-w-0 flex-1">
      <h1 class="m-0 text-[22px] leading-7 font-medium text-on-surface">navendle</h1>
      <p class="mt-0.5 truncate text-xs leading-4 text-on-surface-var">ทายเพื่อนในกลุ่ม NAVEN วันละข้อ</p>
    </div>

    <span
      v-if="streak > 0"
      class="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-secondary-container px-3 text-sm font-medium text-on-secondary-container"
      :title="`ชนะติดกัน ${streak} วัน`"
    >
      <MdIcon name="local_fire_department" :size="18" />{{ streak }}
    </span>

    <button
      type="button"
      class="grid h-10 w-10 shrink-0 place-items-center rounded-full text-on-surface-var transition-colors hover:bg-surface-high hover:text-on-surface"
      title="วิธีเล่น"
      aria-label="วิธีเล่น"
      @click="emit('open', 'howto')"
    >
      <MdIcon name="help" />
    </button>
    <button
      type="button"
      class="grid h-10 w-10 shrink-0 place-items-center rounded-full text-on-surface-var transition-colors hover:bg-surface-high hover:text-on-surface"
      title="สถิติ"
      aria-label="สถิติ"
      @click="emit('open', 'stats')"
    >
      <MdIcon name="bar_chart" />
    </button>
  </header>
</template>
