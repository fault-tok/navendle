<script setup lang="ts">
import type { GuessRow } from '../composables/useGame'
import { ATTRIBUTES } from '../data/attributes'
import AttrTile from './AttrTile.vue'

defineProps<{ rows: GuessRow[] }>()

/** ชื่อ 96px + ช่องคุณสมบัติช่องละ 88px ตามดีไซน์ */
const cols = `96px repeat(${ATTRIBUTES.length}, 88px)`
</script>

<template>
  <section class="rounded-3xl bg-surface-low px-3 py-4">
    <div class="scroll-x pb-1">
      <div class="min-w-max">
        <!-- หัวคอลัมน์: ชื่อ + คุณสมบัติทั้งหมดตามลำดับใน attributes.ts -->
        <div class="grid gap-1.5 pb-1.5" :style="{ gridTemplateColumns: cols }">
          <span class="flex items-end px-0.5 text-[11px] leading-[14px] font-semibold tracking-wide text-outline">ชื่อ</span>
          <span
            v-for="a in ATTRIBUTES"
            :key="a.key"
            class="flex items-end justify-center px-0.5 text-center text-[11px] leading-[14px] font-semibold tracking-wide text-outline"
          >
            {{ a.label }}
          </span>
        </div>

        <!-- แถวใหม่อยู่บนสุด จะได้ไม่ต้องเลื่อนหาทุกครั้งที่ทาย -->
        <div
          v-for="(row, i) in [...rows].reverse()"
          :key="row.friend.id"
          class="grid gap-1.5 pb-1.5"
          :style="{ gridTemplateColumns: cols }"
        >
          <span
            class="flex h-19 items-center justify-center rounded-xl bg-surface-highest px-2 text-center text-[15px] font-semibold text-on-surface"
          >
            {{ row.friend.nickname }}
          </span>
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

    <p v-if="!rows.length" class="m-0 px-2 pt-5 pb-2.5 text-center text-sm leading-5 text-outline">
      พิมพ์ชื่อเพื่อนสักคนเพื่อเริ่มไล่เบาะแส
    </p>
  </section>
</template>
