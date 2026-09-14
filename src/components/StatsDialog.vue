<script setup lang="ts">
import { computed } from 'vue'
import BaseDialog from './BaseDialog.vue'
import { useStats } from '../composables/useStats'
import { useSnack } from '../composables/useSnack'

defineEmits<{ (e: 'close'): void }>()
const { stats, reset } = useStats()
const { toast } = useSnack()

const buckets = ['1', '2', '3', '4', '5', '6', '7', '8+']
const max = computed(() => Math.max(1, ...buckets.map((b) => stats.value.distribution[b] ?? 0)))
const winRate = computed(() => (stats.value.played ? Math.round((stats.value.wins / stats.value.played) * 100) : 0))

const tiles = computed(() => [
  { label: 'เล่นไป', value: stats.value.played },
  { label: 'ชนะ %', value: winRate.value },
  { label: 'ติดกัน', value: stats.value.streak },
  { label: 'สูงสุด', value: stats.value.maxStreak },
])

function confirmReset() {
  // ล้างแล้วกู้คืนไม่ได้ เลยยังถามยืนยันก่อนเหมือนเดิม แล้วค่อยเด้ง snackbar บอกผล
  if (!confirm('ล้างสถิติทั้งหมด? กู้คืนไม่ได้นะ')) return
  reset()
  toast('ล้างสถิติแล้ว')
}
</script>

<template>
  <BaseDialog title="สถิติ" @close="$emit('close')">
    <div class="mb-6 grid grid-cols-4 gap-2">
      <div v-for="s in tiles" :key="s.label" class="text-center">
        <p class="m-0 text-[26px] leading-8 font-bold tabular-nums text-primary">{{ s.value }}</p>
        <p class="mt-0.5 mb-0 text-[11px] leading-4 text-on-surface-var">{{ s.label }}</p>
      </div>
    </div>

    <p class="mt-0 mb-2.5 text-[11px] leading-4 font-semibold tracking-wide text-outline">ทายกี่ครั้งถึงถูก</p>
    <div class="flex flex-col gap-[5px]">
      <div v-for="b in buckets" :key="b" class="flex items-center gap-2">
        <span class="w-[18px] text-xs tabular-nums text-on-surface-var">{{ b }}</span>
        <div class="h-[22px] flex-1 overflow-hidden rounded-[11px] bg-surface-highest">
          <div
            class="flex h-full min-w-[26px] items-center justify-end rounded-[11px] px-2.5 text-[11px] font-bold transition-[width] duration-500"
            :class="
              (stats.distribution[b] ?? 0) > 0
                ? 'bg-primary text-on-primary'
                : 'bg-surface-highest text-on-surface-var'
            "
            :style="{ width: `${((stats.distribution[b] ?? 0) / max) * 100}%` }"
          >
            {{ stats.distribution[b] ?? 0 }}
          </div>
        </div>
      </div>
    </div>

    <p class="mt-[18px] mb-0 text-[11px] leading-[17px] text-outline">
      นับรวมทุกโหมด · สถิติเก็บในเบราว์เซอร์เครื่องนี้เท่านั้น ล้างข้อมูลเบราว์เซอร์แล้วหาย
    </p>
    <button
      type="button"
      class="mt-2.5 h-10 rounded-[20px] px-4 text-sm font-semibold text-error transition-colors hover:bg-surface-highest"
      @click="confirmReset"
    >
      ล้างสถิติ
    </button>
  </BaseDialog>
</template>
