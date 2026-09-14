<script setup lang="ts">
/** ไอคอน Material Symbols Rounded — ชื่อไอคอนที่ใช้ต้องอยู่ใน icon_names ที่ subset ไว้ใน index.html */
withDefaults(defineProps<{ name: string; size?: number }>(), { size: 22 })
</script>

<template>
  <span class="msr shrink-0" aria-hidden="true" :style="{ fontSize: `${size}px` }">{{ name }}</span>
</template>
