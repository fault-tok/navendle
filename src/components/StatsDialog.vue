<script setup lang="ts">
import { computed } from 'vue'
import BaseDialog from './BaseDialog.vue'
import { useStats } from '../composables/useStats'

defineEmits<{ (e: 'close'): void }>()
const { stats, reset } = useStats()

const buckets = ['1', '2', '3', '4', '5', '6', '7', '8+']
const max = computed(() => Math.max(1, ...buckets.map((b) => stats.value.distribution[b] ?? 0)))
const winRate = computed(() => (stats.value.played ? Math.round((stats.value.wins / stats.value.played) * 100) : 0))

function confirmReset() {
  if (confirm('ล้างสถิติทั้งหมด? กู้คืนไม่ได้นะ')) reset()
}
</script>

<template>
  <BaseDialog title="สถิติ" @close="$emit('close')">
    <div class="mb-5 grid grid-cols-4 gap-2 text-center">
      <div v-for="s in [
        { label: 'เล่นไป', value: stats.played },
        { label: 'ชนะ %', value: winRate },
        { label: 'ติดกัน', value: stats.streak },
        { label: 'สูงสุด', value: stats.maxStreak },
      ]" :key="s.label">
        <p class="font-display text-3xl text-bronze">{{ s.value }}</p>
        <p class="text-[11px] text-cream/45">{{ s.label }}</p>
      </div>
    </div>

    <p class="mb-2 text-xs font-semibold text-cream/45">ทายกี่ครั้งถึงถูก</p>
    <div class="flex flex-col gap-1">
      <div v-for="b in buckets" :key="b" class="flex items-center gap-2">
        <span class="w-5 text-xs text-cream/45">{{ b }}</span>
        <div class="h-5 flex-1 overflow-hidden rounded bg-ink/50">
          <div
            class="flex h-full min-w-6 items-center justify-end rounded bg-bronze/70 px-1.5 text-[11px] font-semibold text-ink transition-[width] duration-500"
            :style="{ width: `${((stats.distribution[b] ?? 0) / max) * 100}%` }"
          >
            {{ stats.distribution[b] ?? 0 }}
          </div>
        </div>
      </div>
    </div>

    <p class="mt-4 text-[11px] leading-relaxed text-cream/35">
      นับรวมทุกโหมด · สถิติเก็บในเบราว์เซอร์เครื่องนี้เท่านั้น ล้างข้อมูลเบราว์เซอร์แล้วหาย
    </p>
    <button type="button" class="mt-2 text-xs text-cream/35 underline transition hover:text-cream/70" @click="confirmReset">
      ล้างสถิติ
    </button>
  </BaseDialog>
</template>
