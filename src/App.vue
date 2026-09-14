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
import SnackBar from './components/SnackBar.vue'

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
  <div class="mx-auto w-full max-w-[840px] px-4">
    <AppHeader :streak="stats.streak" @open="dialog = $event" />
    <ModeTabs :current="mode" :done="done" @change="mode = $event" />

    <main class="flex flex-col gap-4 pt-3 pb-10">
      <!-- ยังไม่มีข้อมูลเพื่อนพอเล่น -->
      <div v-if="friends.length < 2" class="rounded-[28px] bg-surface-low p-6 text-center text-sm text-on-surface-var">
        <p class="mt-0 mb-2 text-lg text-on-surface">ยังไม่มีข้อมูลเพื่อนพอเล่น</p>
        <p class="m-0 text-outline">
          เติมข้อมูลใน <code class="font-sans font-semibold text-primary">src/data/friends.json</code> อย่างน้อย 2 คน
          แล้วรัน <code class="font-sans font-semibold text-primary">npm run validate</code>
        </p>
      </div>

      <template v-else>
        <div class="flex items-center justify-between gap-3 text-xs leading-4 tracking-wide text-on-surface-var">
          <span>
            <template v-if="game.freePlay">ฟรีเพลย์ · {{ MODE_LABELS[mode] }}</template>
            <template v-else>ข้อที่ {{ puzzleNumber(dayIndex) }} · {{ MODE_LABELS[mode] }}</template>
          </span>
          <button
            v-if="game.freePlay"
            type="button"
            class="text-primary underline"
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
        <div v-else-if="game.rows.length" class="flex flex-wrap gap-2">
          <span
            v-for="row in [...game.rows].reverse()"
            :key="row.friend.id"
            class="rounded-lg px-3.5 py-[7px] text-sm font-medium"
            :class="
              row.friend.id === game.answer.id
                ? 'bg-hit text-hit-fg'
                : 'bg-surface-high text-on-surface-var'
            "
          >
            {{ row.friend.nickname }}
          </span>
        </div>
      </template>
    </main>

    <footer class="pb-7 text-center text-[11px] leading-4 text-outline">
      navendle · ทำเล่นกันในกลุ่ม NAVEN
    </footer>

    <!-- เว้นที่ให้ navigation bar ที่ลอยอยู่ล่างจอ (เฉพาะจอแคบ) -->
    <div class="h-23 sm:hidden"></div>
  </div>

  <StatsDialog v-if="dialog === 'stats'" @close="dialog = null" />
  <HowToPlayDialog v-if="dialog === 'howto'" @close="dialog = null" />
  <SnackBar />
</template>
