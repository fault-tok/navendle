<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Friend } from '../game/types'

const props = withDefaults(
  defineProps<{ friend: Friend; blur?: number; scale?: number; circle?: boolean }>(),
  { blur: 0, scale: 1, circle: false },
)

const failed = ref(false)
watch(() => props.friend.id, () => (failed.value = false))

const src = computed(() => `${import.meta.env.BASE_URL}${props.friend.photo}`)
</script>

<template>
  <div
    class="relative aspect-square w-full overflow-hidden bg-primary-container [container-type:inline-size]"
    :class="circle ? 'rounded-full' : 'rounded-3xl'"
  >
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
      class="grid h-full w-full place-items-center text-on-primary-container"
      :style="{ filter: `blur(${Math.min(blur, 8)}px)` }"
    >
      <!-- cqw = ยึดตามความกว้างกล่อง ตัวอักษรจะโตตามรูปทุกขนาด -->
      <span class="text-[34cqw] leading-none font-bold">{{ friend.nickname.slice(0, 2) }}</span>
    </div>
  </div>
</template>
