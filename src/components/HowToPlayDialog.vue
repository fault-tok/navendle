<script setup lang="ts">
import BaseDialog from './BaseDialog.vue'
import { ATTRIBUTES } from '../data/attributes'
import { groupName } from '../data/roster'
import MdIcon from './MdIcon.vue'

defineEmits<{ (e: 'close'): void }>()

const legend = [
  { tone: 'bg-hit border-hit-bd text-hit-fg', mark: 'check', text: 'ตรงกับคำตอบ' },
  {
    tone: 'bg-near border-near-bd text-near-fg',
    mark: 'drag_handle',
    text: 'ใกล้เคียง เช่น กีฬาซ้ำกันบางอย่าง หรือส่วนสูงห่างไม่เกิน 4 ซม.',
  },
  { tone: 'bg-miss border-miss-bd text-miss-fg', mark: 'close', text: 'ไม่ตรงเลย' },
  {
    tone: 'bg-miss border-miss-bd text-miss-fg',
    mark: 'arrow_drop_up',
    text: 'คำตอบมีค่ามากกว่าที่ทาย (ลูกศรลงคือน้อยกว่า)',
  },
]

const modeHelp = [
  { icon: 'mood', name: 'อิโมจิ', text: 'ทายจากอิโมจิที่เปิดทีละตัว' },
  { icon: 'format_quote', name: 'วลีเด็ด', text: 'ทายจากประโยคติดปาก ทายผิด 2/4/6 ครั้งจะปลดคำใบ้' },
  { icon: 'blur_on', name: 'รูปเบลอ', text: 'รูปจะชัดขึ้นทุกครั้งที่ทายผิด' },
]
</script>

<template>
  <BaseDialog title="วิธีเล่น" wide @close="$emit('close')">
    <div class="flex flex-col gap-5 text-sm leading-[21px] text-on-surface-var">
      <p class="m-0">
        ทายว่าวันนี้เป็นเพื่อนคนไหนในกลุ่ม <span class="font-bold text-primary">{{ groupName }}</span>
        ทายได้ไม่จำกัดครั้ง ทุกครั้งที่ทายจะได้เบาะแสเพิ่ม และเปลี่ยนคนใหม่ทุกเที่ยงคืน
      </p>

      <div>
        <p class="mt-0 mb-2.5 font-semibold text-on-surface">สีของช่อง</p>
        <div class="flex flex-col gap-2">
          <div v-for="l in legend" :key="l.mark" class="flex items-center gap-2.5">
            <span class="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-lg border" :class="l.tone">
              <MdIcon :name="l.mark" :size="16" />
            </span>
            <span class="text-[13px] leading-[19px]">{{ l.text }}</span>
          </div>
        </div>
      </div>

      <div>
        <p class="mt-0 mb-2.5 font-semibold text-on-surface">คอลัมน์ในโหมดคลาสสิก</p>
        <div class="flex flex-col gap-1.5">
          <div v-for="a in ATTRIBUTES" :key="a.key" class="flex gap-2.5 text-[13px] leading-[19px]">
            <span class="w-24 shrink-0 font-semibold text-primary">{{ a.label }}</span>
            <span class="text-outline">{{ a.hint ?? 'ตรงเป๊ะถึงจะเข้า' }}</span>
          </div>
        </div>
      </div>

      <div>
        <p class="mt-0 mb-2.5 font-semibold text-on-surface">อีก 3 โหมด</p>
        <div class="flex flex-col gap-2">
          <div v-for="h in modeHelp" :key="h.name" class="flex items-start gap-2.5 text-[13px] leading-[19px]">
            <MdIcon :name="h.icon" :size="18" class="text-tertiary" style="line-height: 19px" />
            <span><b class="text-on-surface">{{ h.name }}</b> — {{ h.text }}</span>
          </div>
        </div>
      </div>

      <p class="m-0 text-[11px] leading-[17px]">
        แต่ละโหมดเป็นคนละคนกันในวันเดียวกัน · ความคืบหน้าเก็บในเครื่องนี้เท่านั้น
      </p>
    </div>
  </BaseDialog>
</template>
