import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'
import { friends } from '../data/roster'
import { pickDaily } from '../game/daily'
import { useDayIndex } from '../composables/useGame'

async function mountApp() {
  const wrapper = mount(App, { attachTo: document.body })
  await wrapper.vm.$nextTick()
  // ปิดกล่องวิธีเล่นที่เด้งขึ้นรอบแรก
  const close = wrapper.find('[aria-label="ปิด"]')
  if (close.exists()) await close.trigger('click')
  return wrapper
}

async function guessNickname(wrapper: Awaited<ReturnType<typeof mountApp>>, nickname: string) {
  const input = wrapper.find('input[type="text"]')
  await input.setValue(nickname)
  await input.trigger('keydown', { key: 'Enter' })
  await wrapper.vm.$nextTick()
}

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('เปิดมาเจอหัวเว็บและช่องพิมพ์ชื่อ', async () => {
    const wrapper = await mountApp()
    expect(wrapper.text()).toContain('navendle')
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('คลาสสิก')
  })

  it('ทายผิดแล้วขึ้นแถวผลพร้อมช่องคุณสมบัติครบ', async () => {
    const wrapper = await mountApp()
    const answer = pickDaily(friends, 'classic', useDayIndex().value)
    const wrong = friends.find((f) => f.id !== answer.id)!

    await guessNickname(wrapper, wrong.nickname)

    expect(wrapper.text()).toContain(wrong.nickname)
    expect(wrapper.findAll('.tile-in').length).toBe(9)
    expect(wrapper.text()).not.toContain('ถูกต้อง!')
  })

  it('ทายถูกแล้วขึ้นการ์ดเฉลยและปิดช่องพิมพ์', async () => {
    const wrapper = await mountApp()
    const answer = pickDaily(friends, 'classic', useDayIndex().value)

    await guessNickname(wrapper, answer.nickname)

    expect(wrapper.text()).toContain('ถูกต้อง!')
    expect(wrapper.text()).toContain(answer.reveal.signature)
    expect(wrapper.find('input[type="text"]').attributes('disabled')).toBeDefined()
  })

  it('ความคืบหน้าอยู่ต่อหลังโหลดใหม่', async () => {
    const first = await mountApp()
    const answer = pickDaily(friends, 'classic', useDayIndex().value)
    const wrong = friends.find((f) => f.id !== answer.id)!
    await guessNickname(first, wrong.nickname)
    first.unmount()

    const second = await mountApp()
    expect(second.text()).toContain(wrong.nickname)
    expect(second.findAll('.tile-in').length).toBe(9)
  })

  it('สลับไปโหมดอิโมจิแล้วได้คนละคำตอบกับคลาสสิก', async () => {
    const wrapper = await mountApp()
    const buttons = wrapper.findAll('[role="tab"]')
    await buttons[1].trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('อิโมจิบอกคาแรคเตอร์ของใคร?')
    const day = useDayIndex().value
    expect(pickDaily(friends, 'emoji', day).id).not.toBe(pickDaily(friends, 'classic', day).id)
  })

  it('โหมดวลีเด็ดโชว์ประโยคของคำตอบ', async () => {
    const wrapper = await mountApp()
    await wrapper.findAll('[role="tab"]')[2].trigger('click')
    await wrapper.vm.$nextTick()

    const answer = pickDaily(friends, 'quote', useDayIndex().value)
    const shown = answer.reveal.quotes.some((q) => wrapper.text().includes(q))
    expect(shown).toBe(true)
    expect(wrapper.text()).not.toContain(answer.nickname)
  })
})
