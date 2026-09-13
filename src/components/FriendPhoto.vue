<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Friend } from '../game/types'

const props = withDefaults(defineProps<{ friend: Friend; blur?: number; scale?: number }>(), {
  blur: 0,
  scale: 1,
})

const failed = ref(false)
watch(() => props.friend.id, () => (failed.value = false))

const src = computed(() => `${import.meta.env.BASE_URL}${props.friend.photo}`)
</script>

<template>
  <div class="relative aspect-square w-full overflow-hidden rounded-2xl border border-bronze/30 bg-teal/40">
    <img
      v-if="!failed"
      :src="src"
      alt=""
      class="h-full w-full object-cover transition-[filter,transform] duration-500"
      :style="{ filter: `blur(${blur}px)`, transform: `scale(${scale})` }"
      @error="failed = true"
    />
    <!-- ยังไม่ได้ใส่รูป: โชว์ตัวอักษรแทน เกมยังเล่นต่อได้ -->
    <div
      v-else
      class="grid h-full w-full place-items-center bg-gradient-to-br from-teal to-ink"
      :style="{ filter: `blur(${Math.min(blur, 8)}px)` }"
    >
      <span class="font-display text-5xl font-bold text-bronze/60">{{ friend.nickname.slice(0, 2) }}</span>
    </div>
  </div>
</template>
