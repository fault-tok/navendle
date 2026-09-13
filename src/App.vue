<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import type { GameMode } from './game/types'
import { MODE_LABELS } from './game/share'
import { currentDayIndex, puzzleNumber } from './game/daily'
import { loadSeenHowTo, saveSeenHowTo } from './game/storage'
import { friends } from './data/roster'
import { useGame, useDayIndex } from './composables/useGame'
import { useStats } from './composables/useStats'

import AppHeader from './components/AppHeader.vue'
import ModeTabs from './components/ModeTabs.vue'
import GuessInput from './components/GuessInput.vue'
import GuessTable from './components/GuessTable.vue'
import EmojiPanel from './components/EmojiPanel.vue'
import QuotePanel from './components/QuotePanel.vue'
import SilhouettePanel from './components/SilhouettePanel.vue'
import ResultCard from './components/ResultCard.vue'
import StatsDialog from './components/StatsDialog.vue'
import HowToPlayDialog from './components/HowToPlayDialog.vue'

const MODES: GameMode[] = ['classic', 'emoji', 'quote', 'silhouette']

function modeFromUrl(): GameMode {
  const m = new URLSearchParams(location.search).get('m')
  return MODES.includes(m as GameMode) ? (m as GameMode) : 'classic'
}

const mode = ref<GameMode>(modeFromUrl())
const dialog = ref<'stats' | 'howto' | null>(null)
const dayIndex = useDayIndex()
const { stats, refreshStreak } = useStats()

// สร้าง state ไว้ครบทุกโหมดตั้งแต่แรก จะได้สลับแท็บแล้วผลทายเดิมยังอยู่
const games = reactive(Object.fromEntries(MODES.map((m) => [m, useGame(m)])) as Record<GameMode, ReturnType<typeof useGame>>)
const game = computed(() => games[mode.value])
const done = computed(() => Object.fromEntries(MODES.map((m) => [m, games[m].won && !games[m].freePlay])) as Record<GameMode, boolean>)

// สลับโหมดแล้วอัปเดต URL ด้วย จะได้ส่งลิงก์โหมดที่อยากให้เพื่อนเล่นได้
watch(mode, (m) => {
  const url = new URL(location.href)
  if (m === 'classic') url.searchParams.delete('m')
  else url.searchParams.set('m', m)
  history.replaceState(null, '', url)
})

function onRollover() {
  dayIndex.value = currentDayIndex()
}

function again() {
  game.value.startFreePlay()
}

onMounted(() => {
  refreshStreak(dayIndex.value)
  if (!loadSeenHowTo()) {
    dialog.value = 'howto'
    saveSeenHowTo()
  }
})
</script>

<template>
  <div class="mx-auto flex min-h-dvh w-full max-w-3xl flex-col">
    <AppHeader :streak="stats.streak" @open="dialog = $event" />
    <ModeTabs :current="mode" :done="done" @change="mode = $event" />

    <main class="flex flex-1 flex-col gap-4 px-4 pt-4 pb-10 sm:px-6">
      <!-- ยังไม่มีข้อมูลเพื่อนพอเล่น -->
      <div v-if="friends.length < 2" class="card rounded-2xl p-6 text-center text-sm text-cream/70">
        <p class="mb-2 text-lg">ยังไม่มีข้อมูลเพื่อนพอเล่น</p>
        <p class="text-cream/50">เติมข้อมูลใน <code class="text-bronze">src/data/friends.json</code> อย่างน้อย 2 คน แล้วรัน <code class="text-bronze">npm run validate</code></p>
      </div>

      <template v-else>
        <div class="flex items-center justify-between text-xs text-cream/45">
          <span>
            <template v-if="game.freePlay">ฟรีเพลย์ · {{ MODE_LABELS[mode] }}</template>
            <template v-else>ข้อที่ {{ puzzleNumber(dayIndex) }} · {{ MODE_LABELS[mode] }}</template>
          </span>
          <button
            v-if="game.freePlay"
            type="button"
            class="underline transition hover:text-cream"
            @click="game.backToDaily()"
          >
            กลับไปข้อประจำวัน
          </button>
          <span v-else>ทายไป {{ game.guessCount }} ครั้ง</span>
        </div>

        <!-- โจทย์ของแต่ละโหมด -->
        <EmojiPanel
          v-if="mode === 'emoji'"
          :emoji="game.answer.reveal.emoji"
          :wrong-count="game.wrongCount"
          :reveal-all="game.won"
        />
        <QuotePanel
          v-else-if="mode === 'quote'"
          :quote="game.quoteOfTheDay"
          :answer="game.answer"
          :wrong-count="game.wrongCount"
          :reveal-all="game.won"
        />
        <SilhouettePanel
          v-else-if="mode === 'silhouette'"
          :answer="game.answer"
          :wrong-count="game.wrongCount"
          :reveal-all="game.won"
        />

        <GuessInput :pool="game.remaining" :disabled="game.won" @guess="game.guess($event)" />

        <ResultCard
          v-if="game.won"
          :answer="game.answer"
          :mode="mode"
          :day-index="dayIndex"
          :guess-count="game.guessCount"
          :rows="game.rows"
          :free-play="game.freePlay"
          @again="again"
          @rollover="onRollover"
        />

        <!-- ตารางคุณสมบัติ: โหมดคลาสสิกโชว์ทุกแถว โหมดอื่นเป็นแค่รายชื่อที่ทายไปแล้ว -->
        <GuessTable v-if="mode === 'classic'" :rows="game.rows" />
        <div v-else-if="game.rows.length" class="flex flex-wrap gap-1.5">
          <span
            v-for="row in [...game.rows].reverse()"
            :key="row.friend.id"
            class="rounded-lg border px-2.5 py-1.5 text-sm"
            :class="row.friend.id === game.answer.id ? 'border-hit bg-hit/25 text-cream' : 'border-miss/70 bg-miss/30 text-cream/60'"
          >
            {{ row.friend.nickname }}
          </span>
        </div>

        <p v-if="!game.rows.length && mode === 'classic'" class="py-6 text-center text-sm text-cream/40">
          พิมพ์ชื่อเพื่อนสักคนเพื่อเริ่มไล่เบาะแส
        </p>
      </template>
    </main>

    <footer class="px-4 pb-6 text-center text-[11px] text-cream/25 sm:px-6">
      navendle · ทำเล่นกันในกลุ่ม NAVEN
    </footer>

    <StatsDialog v-if="dialog === 'stats'" @close="dialog = null" />
    <HowToPlayDialog v-if="dialog === 'howto'" @close="dialog = null" />
  </div>
</template>
