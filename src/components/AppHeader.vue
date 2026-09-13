<script setup lang="ts">
defineProps<{ streak: number }>()
const emit = defineEmits<{ (e: 'open', dialog: 'stats' | 'howto'): void }>()
const logo = `${import.meta.env.BASE_URL}logo-n.png`
</script>

<template>
  <header class="flex items-center gap-3 px-4 pt-5 pb-3 sm:px-6">
    <img :src="logo" alt="" class="h-10 w-10 shrink-0 object-contain sm:h-12 sm:w-12" />
    <div class="min-w-0 flex-1">
      <h1 class="wordmark font-display text-3xl leading-none tracking-wide sm:text-4xl">NAVENDLE</h1>
      <p class="truncate text-xs text-cream/50">ทายเพื่อนในกลุ่ม NAVEN วันละข้อ</p>
    </div>

    <div class="flex items-center gap-1">
      <span
        v-if="streak > 0"
        class="mr-1 rounded-full border border-bronze/35 px-2 py-1 text-xs font-semibold text-bronze"
        :title="`ชนะติดกัน ${streak} วัน`"
      >
        🔥 {{ streak }}
      </span>
      <button
        type="button"
        class="rounded-lg border border-bronze/25 px-2.5 py-2 text-sm text-cream/80 transition hover:border-bronze/60 hover:text-cream"
        title="วิธีเล่น"
        @click="emit('open', 'howto')"
      >
        ?
      </button>
      <button
        type="button"
        class="rounded-lg border border-bronze/25 px-2.5 py-2 text-sm text-cream/80 transition hover:border-bronze/60 hover:text-cream"
        title="สถิติ"
        @click="emit('open', 'stats')"
      >
        📊
      </button>
    </div>
  </header>
</template>
