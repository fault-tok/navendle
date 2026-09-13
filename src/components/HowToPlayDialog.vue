<script setup lang="ts">
import BaseDialog from './BaseDialog.vue'
import { ATTRIBUTES } from '../data/attributes'
import { groupName } from '../data/roster'

defineEmits<{ (e: 'close'): void }>()

const legend = [
  { tone: 'bg-hit/85 border-hit text-white', mark: '✓', text: 'ตรงกับคำตอบ' },
  { tone: 'bg-near/85 border-near text-ink', mark: '~', text: 'ใกล้เคียง เช่น กีฬาซ้ำกันบางอย่าง หรือส่วนสูงห่างไม่เกิน 4 ซม.' },
  { tone: 'bg-miss/60 border-miss/80 text-cream/80', mark: '✕', text: 'ไม่ตรงเลย' },
]
</script>

<template>
  <BaseDialog title="วิธีเล่น" @close="$emit('close')">
    <div class="flex flex-col gap-4 text-sm leading-relaxed text-cream/80">
      <p>
        ทายว่าวันนี้เป็นเพื่อนคนไหนในกลุ่ม <span class="font-semibold text-bronze">{{ groupName }}</span>
        ทายได้ไม่จำกัดครั้ง ทุกครั้งที่ทายจะได้เบาะแสเพิ่ม และเปลี่ยนคนใหม่ทุกเที่ยงคืน
      </p>

      <div>
        <p class="mb-2 font-semibold text-cream">สีของช่อง</p>
        <div class="flex flex-col gap-1.5">
          <div v-for="l in legend" :key="l.mark" class="flex items-center gap-2.5">
            <span class="grid h-7 w-7 shrink-0 place-items-center rounded border text-xs font-bold" :class="l.tone">
              {{ l.mark }}
            </span>
            <span class="text-xs">{{ l.text }}</span>
          </div>
          <div class="flex items-center gap-2.5">
            <span class="grid h-7 w-7 shrink-0 place-items-center rounded border border-miss/80 bg-miss/60 text-xs">▲</span>
            <span class="text-xs">คำตอบมีค่ามากกว่าที่ทาย (▼ คือน้อยกว่า)</span>
          </div>
        </div>
      </div>

      <div>
        <p class="mb-2 font-semibold text-cream">คอลัมน์ในโหมดคลาสสิก</p>
        <ul class="flex flex-col gap-1 text-xs">
          <li v-for="a in ATTRIBUTES" :key="a.key" class="flex gap-2">
            <span class="w-24 shrink-0 font-semibold text-bronze">{{ a.label }}</span>
            <span class="text-cream/55">{{ a.hint ?? 'ตรงเป๊ะถึงจะเขียว' }}</span>
          </li>
        </ul>
      </div>

      <div>
        <p class="mb-2 font-semibold text-cream">อีก 3 โหมด</p>
        <ul class="flex flex-col gap-1 text-xs text-cream/65">
          <li>😎 <b>อิโมจิ</b> — ทายจากอิโมจิที่เปิดทีละตัว</li>
          <li>💬 <b>วลีเด็ด</b> — ทายจากประโยคติดปาก ทายผิด 2/4/6 ครั้งจะปลดคำใบ้</li>
          <li>🖼️ <b>รูปเบลอ</b> — รูปจะชัดขึ้นทุกครั้งที่ทายผิด</li>
        </ul>
      </div>

      <p class="text-[11px] text-cream/35">
        แต่ละโหมดเป็นคนละคนกันในวันเดียวกัน · ความคืบหน้าเก็บในเครื่องนี้เท่านั้น
      </p>
    </div>
  </BaseDialog>
</template>
