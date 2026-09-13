<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { Friend } from '../game/types'
import { searchFriends } from '../data/roster'

const props = defineProps<{ pool: readonly Friend[]; disabled: boolean }>()
const emit = defineEmits<{ (e: 'guess', friendId: string): void }>()

const query = ref('')
const open = ref(false)
const active = ref(0)
const inputEl = ref<HTMLInputElement | null>(null)
const listEl = ref<HTMLUListElement | null>(null)

const matches = computed(() => searchFriends(query.value, props.pool).slice(0, 8))

watch(matches, () => {
  active.value = 0
})

function submit(friend?: Friend) {
  const target = friend ?? matches.value[active.value]
  if (!target || props.disabled) return
  emit('guess', target.id)
  query.value = ''
  open.value = false
  nextTick(() => inputEl.value?.focus())
}

function onKeydown(e: KeyboardEvent) {
  if (!open.value && ['ArrowDown', 'ArrowUp'].includes(e.key)) {
    open.value = true
    return
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    active.value = (active.value + 1) % Math.max(matches.value.length, 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    active.value = (active.value - 1 + matches.value.length) % Math.max(matches.value.length, 1)
  } else if (e.key === 'Enter') {
    e.preventDefault()
    submit()
  } else if (e.key === 'Escape') {
    open.value = false
  }
  nextTick(() => {
    listEl.value?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' })
  })
}
</script>

<template>
  <div class="relative">
    <div
      class="flex items-center gap-2 rounded-xl border px-3 py-2.5 transition"
      :class="disabled ? 'border-bronze/15 opacity-50' : 'border-bronze/35 focus-within:border-bronze'"
    >
      <span aria-hidden="true" class="text-cream/40">🔍</span>
      <input
        ref="inputEl"
        v-model="query"
        type="text"
        :disabled="disabled"
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
        role="combobox"
        aria-autocomplete="list"
        :aria-expanded="open"
        :placeholder="disabled ? 'ทายถูกแล้ว' : 'พิมพ์ชื่อเล่นเพื่อน…'"
        class="w-full bg-transparent text-base text-cream outline-none placeholder:text-cream/35"
        @focus="open = true"
        @input="open = true"
        @blur="open = false"
        @keydown="onKeydown"
      />
      <button
        v-if="query"
        type="button"
        class="text-cream/40 transition hover:text-cream"
        title="ล้าง"
        @mousedown.prevent="query = ''"
      >
        ✕
      </button>
    </div>

    <ul
      v-if="open && matches.length && !disabled"
      ref="listEl"
      role="listbox"
      class="card absolute z-20 mt-1.5 max-h-64 w-full overflow-y-auto rounded-xl p-1 shadow-2xl shadow-black/50"
    >
      <li
        v-for="(f, i) in matches"
        :key="f.id"
        role="option"
        :aria-selected="i === active"
        :data-active="i === active"
        class="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 transition"
        :class="i === active ? 'bg-bronze/20' : 'hover:bg-cream/5'"
        @mousedown.prevent="submit(f)"
        @mouseenter="active = i"
      >
        <span class="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full bg-teal text-xs text-cream/60">
          {{ f.nickname.slice(0, 2) }}
        </span>
        <span class="font-medium">{{ f.nickname }}</span>
      </li>
    </ul>

    <p v-if="open && !matches.length && query && !disabled" class="card absolute z-20 mt-1.5 w-full rounded-xl px-3 py-2.5 text-sm text-cream/50">
      ไม่เจอชื่อนี้ในกลุ่ม
    </p>
  </div>
</template>
