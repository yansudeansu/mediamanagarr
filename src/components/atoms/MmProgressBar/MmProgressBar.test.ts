import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmProgressBar from './MmProgressBar.vue'

describe('MmProgressBar', () => {
  it('renders a progress bar', () => {
    const wrapper = mount(MmProgressBar, {
      props: {
        value: 50,
      },
    })

    expect(wrapper.find('[role="progressbar"]').exists()).toBe(true)
  })

  it('renders the correct progress width', () => {
    const wrapper = mount(MmProgressBar, {
      props: {
        value: 42.5,
      },
    })

    expect(wrapper.find('.mm-progress-bar__fill').attributes('style')).toContain('width: 42.5%')
  })

  it('exposes accessible progress information', () => {
    const wrapper = mount(MmProgressBar, {
      props: {
        value: 75,
        label: 'Torrent download',
      },
    })

    const progress = wrapper.find('[role="progressbar"]')

    expect(progress.attributes('aria-label')).toBe('Torrent download')
    expect(progress.attributes('aria-valuenow')).toBe('75')
    expect(progress.attributes('aria-valuemin')).toBe('0')
    expect(progress.attributes('aria-valuemax')).toBe('100')
  })

  it('clamps negative values to zero', () => {
    const wrapper = mount(MmProgressBar, {
      props: {
        value: -20,
      },
    })

    expect(wrapper.find('[role="progressbar"]').attributes('aria-valuenow')).toBe('0')

    expect(wrapper.find('.mm-progress-bar__fill').attributes('style')).toContain('width: 0%')
  })

  it('clamps values above 100', () => {
    const wrapper = mount(MmProgressBar, {
      props: {
        value: 150,
      },
    })

    expect(wrapper.find('[role="progressbar"]').attributes('aria-valuenow')).toBe('100')

    expect(wrapper.find('.mm-progress-bar__fill').attributes('style')).toContain('width: 100%')
  })

  it.each([NaN, Infinity, -Infinity])('handles invalid numeric value %s', (value) => {
    const wrapper = mount(MmProgressBar, {
      props: {
        value,
      },
    })

    expect(wrapper.find('[role="progressbar"]').attributes('aria-valuenow')).toBe('0')

    expect(wrapper.find('.mm-progress-bar__fill').attributes('style')).toContain('width: 0%')
  })

  it('hides the percentage header by default', () => {
    const wrapper = mount(MmProgressBar, {
      props: {
        value: 50,
      },
    })

    expect(wrapper.find('.mm-progress-bar__header').exists()).toBe(false)
  })

  it('displays the label and percentage when enabled', () => {
    const wrapper = mount(MmProgressBar, {
      props: {
        value: 67.25,
        label: 'Downloading',
        showPercentage: true,
      },
    })

    expect(wrapper.find('.mm-progress-bar__label').text()).toBe('Downloading')
    expect(wrapper.find('.mm-progress-bar__percentage').text()).toBe('67.3%')
  })

  it('updates when the progress value changes', async () => {
    const wrapper = mount(MmProgressBar, {
      props: {
        value: 25,
      },
    })

    await wrapper.setProps({
      value: 80,
    })

    expect(wrapper.find('[role="progressbar"]').attributes('aria-valuenow')).toBe('80')

    expect(wrapper.find('.mm-progress-bar__fill').attributes('style')).toContain('width: 80%')
  })

  it('uses the default accessible label', () => {
    const wrapper = mount(MmProgressBar, {
      props: {
        value: 50,
      },
    })

    expect(wrapper.find('[role="progressbar"]').attributes('aria-label')).toBe('Progress')
  })
})
