import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import MmProgressBar from './MmProgressBar.vue'
import { mmProgressBarSelectors } from '../../../test/selectors/atoms/mmProgressBar.selectors'

let wrapper: VueWrapper

const progress = mmProgressBarSelectors((selector) => {
  if (wrapper.element.matches(selector)) return wrapper
  return wrapper.find(selector.replace(/^\.mm-progress-bar /, ''))
})

function mountProgress(value: number, props: { label?: string; showPercentage?: boolean } = {}) {
  wrapper = mount(MmProgressBar, { props: { value, ...props } })
  return wrapper
}

describe('MmProgressBar', () => {
  describe('structure', () => {
    it('renders the progress bar container', () => {
      mountProgress(50)

      expect(progress.get().exists()).toBe(true)
      expect(progress.track().exists()).toBe(true)
      expect(progress.fill().exists()).toBe(true)
    })

    it('uses the progressbar role', () => {
      mountProgress(50)

      expect(progress.track().attributes('role')).toBe('progressbar')
    })

    it('uses the default accessible label', () => {
      mountProgress(50)

      expect(progress.track().attributes('aria-label')).toBe('Progress')
    })

    it('supports a custom accessible label', () => {
      mountProgress(50, { label: 'Downloading' })

      expect(progress.track().attributes('aria-label')).toBe('Downloading')
    })

    it('defines the accessible minimum and maximum', () => {
      mountProgress(50)

      expect(progress.track().attributes('aria-valuemin')).toBe('0')
      expect(progress.track().attributes('aria-valuemax')).toBe('100')
    })
  })

  describe('progress values', () => {
    it('renders the supplied progress value', () => {
      mountProgress(42.5)

      expect(progress.value(42.5).exists()).toBe(true)
      expect(progress.fill().attributes('style')).toContain('width: 42.5%')
    })

    it('supports empty progress', () => {
      mountProgress(0)

      expect(progress.empty().exists()).toBe(true)
      expect(progress.fill().attributes('style')).toContain('width: 0%')
    })

    it('supports completed progress', () => {
      mountProgress(100)

      expect(progress.complete().exists()).toBe(true)
      expect(progress.fill().attributes('style')).toContain('width: 100%')
    })

    it('clamps negative values to zero', () => {
      mountProgress(-25)

      expect(progress.empty().exists()).toBe(true)
      expect(progress.fill().attributes('style')).toContain('width: 0%')
    })

    it('clamps values above 100 to 100', () => {
      mountProgress(150)

      expect(progress.complete().exists()).toBe(true)
      expect(progress.fill().attributes('style')).toContain('width: 100%')
    })

    it.each([NaN, Infinity, -Infinity])('normalizes non-finite values to zero', (value) => {
      mountProgress(value)

      expect(progress.empty().exists()).toBe(true)
      expect(progress.fill().attributes('style')).toContain('width: 0%')
    })

    it('updates when the value changes', async () => {
      mountProgress(25)

      await wrapper.setProps({ value: 75 })

      expect(progress.value(75).exists()).toBe(true)
      expect(progress.fill().attributes('style')).toContain('width: 75%')
    })
  })

  describe('percentage display', () => {
    it('hides the header by default', () => {
      mountProgress(50)

      expect(progress.header().exists()).toBe(false)
      expect(progress.label().exists()).toBe(false)
      expect(progress.percentage().exists()).toBe(false)
    })

    it('shows the label and percentage when enabled', () => {
      mountProgress(42.5, { label: 'Downloading', showPercentage: true })

      expect(progress.header().exists()).toBe(true)
      expect(progress.label().text()).toBe('Downloading')
      expect(progress.percentage().text()).toBe('42.5%')
    })

    it('formats whole percentages to one decimal place', () => {
      mountProgress(50, { showPercentage: true })

      expect(progress.percentage().text()).toBe('50.0%')
    })

    it('rounds percentages to one decimal place', () => {
      mountProgress(42.56, { showPercentage: true })

      expect(progress.percentage().text()).toBe('42.6%')
    })

    it('displays normalized percentages', () => {
      mountProgress(150, { showPercentage: true })

      expect(progress.percentage().text()).toBe('100.0%')
    })

    it('updates the displayed percentage when the value changes', async () => {
      mountProgress(25, { showPercentage: true })

      await wrapper.setProps({ value: 75.5 })

      expect(progress.percentage().text()).toBe('75.5%')
    })

    it('updates the displayed label', async () => {
      mountProgress(50, { label: 'Downloading', showPercentage: true })

      await wrapper.setProps({ label: 'Installing' })

      expect(progress.label().text()).toBe('Installing')
      expect(progress.track().attributes('aria-label')).toBe('Installing')
    })

    it('shows the header when showPercentage becomes true', async () => {
      mountProgress(50)

      await wrapper.setProps({ showPercentage: true })

      expect(progress.header().exists()).toBe(true)
      expect(progress.percentage().text()).toBe('50.0%')
    })

    it('hides the header when showPercentage becomes false', async () => {
      mountProgress(50, { showPercentage: true })

      await wrapper.setProps({ showPercentage: false })

      expect(progress.header().exists()).toBe(false)
      expect(progress.track().exists()).toBe(true)
    })
  })
})
