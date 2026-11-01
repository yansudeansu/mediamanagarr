import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmTabs from './MmTabs.vue'
import type { TabItem } from './MmTabs.vue'

const items: TabItem[] = [
  { id: 'connections', label: 'Connections' },
  { id: 'workspace', label: 'Workspace' },
]

interface TestProps {
  modelValue: string
  items: TabItem[]
  variant: 'tabs' | 'navigation'
  label: string
}

function createWrapper(overrides: Partial<TestProps> = {}) {
  return mount(MmTabs, {
    props: {
      modelValue: 'connections',
      items,
      ...overrides,
    },
  })
}

describe('MmTabs', () => {
  it('renders all tab labels', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Connections')
    expect(wrapper.text()).toContain('Workspace')
  })

  it('uses tab semantics by default', () => {
    const wrapper = createWrapper()

    expect(wrapper.get('[role="tablist"]').attributes('aria-label')).toBe('Tabs')
    expect(wrapper.findAll('[role="tab"]')).toHaveLength(2)
  })

  it('supports a custom accessible label', () => {
    const wrapper = createWrapper({ label: 'Settings sections' })

    expect(wrapper.get('[role="tablist"]').attributes('aria-label')).toBe('Settings sections')
  })

  it('marks the selected tab', () => {
    const wrapper = createWrapper()

    const tabs = wrapper.findAll('[role="tab"]')

    expect(tabs[0]?.attributes('aria-selected')).toBe('true')
    expect(tabs[0]?.attributes('tabindex')).toBe('0')

    expect(tabs[1]?.attributes('aria-selected')).toBe('false')
    expect(tabs[1]?.attributes('tabindex')).toBe('-1')
  })

  it('emits an update when another tab is clicked', async () => {
    const wrapper = createWrapper()

    await wrapper.findAll('[role="tab"]')[1]?.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['workspace'])
  })

  it('does not select a disabled tab', async () => {
    const wrapper = createWrapper({
      items: [
        { id: 'connections', label: 'Connections' },
        { id: 'workspace', label: 'Workspace', disabled: true },
      ],
    })

    await wrapper.findAll('[role="tab"]')[1]?.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('selects the next tab with ArrowRight', async () => {
    const wrapper = createWrapper()

    await wrapper.findAll('[role="tab"]')[0]?.trigger('keydown', {
      key: 'ArrowRight',
    })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['workspace'])
  })

  it('wraps to the previous tab with ArrowLeft', async () => {
    const wrapper = createWrapper()

    await wrapper.findAll('[role="tab"]')[0]?.trigger('keydown', {
      key: 'ArrowLeft',
    })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['workspace'])
  })

  it('skips disabled tabs during keyboard navigation', async () => {
    const wrapper = createWrapper({
      items: [
        { id: 'connections', label: 'Connections' },
        { id: 'disabled', label: 'Disabled', disabled: true },
        { id: 'workspace', label: 'Workspace' },
      ],
    })

    await wrapper.findAll('[role="tab"]')[0]?.trigger('keydown', {
      key: 'ArrowRight',
    })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['workspace'])
  })

  it('supports Home and End keyboard navigation', async () => {
    const wrapper = createWrapper({
      items: [
        { id: 'connections', label: 'Connections' },
        { id: 'workspace', label: 'Workspace' },
        { id: 'advanced', label: 'Advanced' },
      ],
    })

    const tabs = wrapper.findAll('[role="tab"]')

    await tabs[0]?.trigger('keydown', { key: 'End' })
    await tabs[2]?.trigger('keydown', { key: 'Home' })

    expect(wrapper.emitted('update:modelValue')).toEqual([['advanced'], ['connections']])
  })

  it('does not change selection for unrelated keys', async () => {
    const wrapper = createWrapper()

    await wrapper.findAll('[role="tab"]')[0]?.trigger('keydown', {
      key: 'Escape',
    })

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('uses navigation semantics when requested', () => {
    const wrapper = createWrapper({
      variant: 'navigation',
    })

    expect(wrapper.find('[role="tablist"]').exists()).toBe(false)
    expect(wrapper.find('[role="tab"]').exists()).toBe(false)

    const buttons = wrapper.findAll('button')

    expect(buttons[0]?.attributes('aria-current')).toBe('page')
    expect(buttons[1]?.attributes('aria-current')).toBeUndefined()
  })

  it('emits selection updates in navigation mode', async () => {
    const wrapper = createWrapper({
      variant: 'navigation',
    })

    await wrapper.findAll('button')[1]?.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['workspace'])
  })

  it('does not implement tab keyboard behavior in navigation mode', async () => {
    const wrapper = createWrapper({
      variant: 'navigation',
    })

    await wrapper.findAll('button')[0]?.trigger('keydown', {
      key: 'ArrowRight',
    })

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
