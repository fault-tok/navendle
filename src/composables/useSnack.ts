import { ref } from 'vue'

/** ข้อความ snackbar ตัวเดียวทั้งแอป — เรียกจากที่ไหนก็ได้ ข้อความใหม่ทับข้อความเก่าเสมอ */
const message = ref('')
let timer: number | undefined

export function useSnack() {
  function toast(text: string, ms = 2400) {
    message.value = text
    window.clearTimeout(timer)
    timer = window.setTimeout(() => (message.value = ''), ms)
  }

  function dismiss() {
    window.clearTimeout(timer)
    message.value = ''
  }

  return { message, toast, dismiss }
}
