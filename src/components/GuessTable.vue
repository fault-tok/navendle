<script setup lang="ts">
import type { GuessRow } from '../composables/useGame'
import { ATTRIBUTES } from '../data/attributes'
import AttrTile from './AttrTile.vue'

defineProps<{ rows: GuessRow[] }>()
</script>

<template>
  <div v-if="rows.length" class="scroll-x -mx-4 px-4 sm:-mx-6 sm:px-6">
    <div class="min-w-max">
      <!-- หัวคอลัมน์: ชื่อ + คุณสมบัติทั้งหมดตามลำดับใน attributes.ts -->
      <div class="sticky top-0 z-10 mb-1.5 flex gap-1.5 bg-gradient-to-b from-teal-deep to-teal-deep/85 py-1 backdrop-blur">
        <div class="w-20 shrink-0 text-center text-[11px] font-semibold text-cream/45 sm:w-24">ชื่อ</div>
        <div
          v-for="a in ATTRIBUTES"
          :key="a.key"
          class="w-[5.5rem] shrink-0 text-center text-[11px] leading-tight font-semibold text-cream/45 sm:w-24"
        >
          {{ a.label }}
        </div>
      </div>

      <!-- แถวใหม่อยู่บนสุด จะได้ไม่ต้องเลื่อนหาทุกครั้งที่ทาย -->
      <div v-for="(row, i) in [...rows].reverse()" :key="row.friend.id" class="mb-1.5 flex gap-1.5">
        <div
          class="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-bronze/30 bg-teal/40 px-1 text-center text-sm font-semibold sm:w-24"
          :class="i === 0 ? 'pop-in' : ''"
        >
          {{ row.friend.nickname }}
        </div>
        <AttrTile
          v-for="(tile, j) in row.tiles"
          :key="ATTRIBUTES[j].key"
          :def="ATTRIBUTES[j]"
          :value="row.friend.attrs[ATTRIBUTES[j].key]"
          :result="tile"
          :index="i === 0 ? j : 0"
        />
      </div>
    </div>
  </div>
</template>
