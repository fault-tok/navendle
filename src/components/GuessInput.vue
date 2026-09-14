<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { Friend } from '../game/types'
import { searchFriends } from '../data/roster'
import MdIcon from './MdIcon.vue'

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
    <!-- search bar ทรง M3 สูง 56 มุมมน 28 -->
    <div
      class="flex h-14 items-center gap-2.5 rounded-[28px] bg-surface-high px-4 transition-opacity"
      :class="disabled ? 'opacity-50' : ''"
    >
      <MdIcon name="search" class="text-on-surface-var" />
      <input
        ref="inputEl"
        v-model="query"
        type="text"
        :disabled="disabled"
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
        role="combobox"
        aria-label="ทายชื่อเพื่อน"
        aria-autocomplete="list"
        :aria-expanded="open"
        :placeholder="disabled ? 'ทายถูกแล้ว' : 'พิมพ์ชื่อเล่นเพื่อน…'"
        class="min-w-0 flex-1 bg-transparent text-base leading-6 text-on-surface outline-none placeholder:text-on-surface-var"
        @focus="open = true"
        @input="open = true"
        @blur="open = false"
        @keydown="onKeydown"
      />
      <button
        v-if="query"
        type="button"
        class="grid h-9 w-9 shrink-0 place-items-center rounded-full text-on-surface-var transition-colors hover:bg-surface-highest hover:text-on-surface"
        title="ล้าง"
        aria-label="ล้าง"
        @mousedown.prevent="query = ''"
      >
        <MdIcon name="close" :size="20" />
      </button>
    </div>

    <ul
      v-if="open && matches.length && !disabled"
      ref="listEl"
      role="listbox"
      class="absolute inset-x-0 top-[62px] z-20 max-h-65 list-none overflow-y-auto rounded-2xl bg-surface-c p-2 shadow-[0_8px_24px_rgba(0,0,0,.55)]"
    >
      <li
        v-for="(f, i) in matches"
        :key="f.id"
        role="option"
        :aria-selected="i === active"
        :data-active="i === active"
        class="flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2 text-on-surface transition-colors"
        :class="i === active ? 'bg-surface-highest' : ''"
        @mousedown.prevent="submit(f)"
        @mouseenter="active = i"
      >
        <span
          aria-hidden="true"
          class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-container text-[13px] font-semibold text-on-primary-container"
        >
          {{ f.nickname.slice(0, 2) }}
        </span>
        <span class="text-base leading-6">{{ f.nickname }}</span>
      </li>
    </ul>

    <p
      v-if="open && !matches.length && query && !disabled"
      class="absolute inset-x-0 top-[62px] z-20 m-0 rounded-2xl bg-surface-c px-4 py-3.5 text-sm text-on-surface-var shadow-[0_8px_24px_rgba(0,0,0,.55)]"
    >
      ไม่เจอชื่อนี้ในกลุ่ม
    </p>
  </div>
</template>
