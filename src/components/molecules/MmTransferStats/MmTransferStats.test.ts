import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import MmTransferStats from './MmTransferStats.vue'
import { mmTransferStatsSelectors } from '../../../test/selectors/molecules/mmTransferStats.selectors'
import { mmCardSelectors } from '../../../test/selectors/atoms/mmCard.selectors'

const defaultProps = {
  downloadSpeed: 1024,
  uploadSpeed: 512,
}

let wrapper: VueWrapper

const query = (selector: string) => {
  if (wrapper.element instanceof Element && wrapper.element.matches(selector)) return wrapper
  return wrapper.find(selector)
}

const stats = mmTransferStatsSelectors(query)
const card = mmCardSelectors(query)

function createWrapper(props: Partial<typeof defaultProps> = {}) {
  wrapper = mount(MmTransferStats, { props: { ...defaultProps, ...props } })
  return wrapper
}

describe('MmTransferStats', () => {
  it('renders the transfer statistics panel', () => {
    createWrapper()

    expect(stats.get().exists()).toBe(true)
  })

  it('uses the shared card component', () => {
    createWrapper()

    expect(card.get().exists()).toBe(true)
  })

  it('provides an accessible section label', () => {
    createWrapper()

    expect(stats.labelled().exists()).toBe(true)
    expect(stats.get().attributes('aria-label')).toBe('Overall transfer speeds')
  })

  it('displays download and upload labels', () => {
    createWrapper()

    expect(stats.downloadLabel().text()).toBe('Download')
    expect(stats.uploadLabel().text()).toBe('Upload')
  })

  it('formats download and upload speeds', () => {
    createWrapper({
      downloadSpeed: 1024 * 1024,
      uploadSpeed: 512 * 1024,
    })

    expect(wrapper.findAll('.transfer-stats__value')).toHaveLength(2)
    expect(stats.downloadValue().text()).toBe('1.0 MiB/s')
    expect(stats.uploadValue().text()).toBe('512 KiB/s')
  })

  it('displays zero speeds correctly', () => {
    createWrapper({ downloadSpeed: 0, uploadSpeed: 0 })

    expect(stats.downloadValue().text()).toBe('0 B/s')
    expect(stats.uploadValue().text()).toBe('0 B/s')
  })

  it('handles large transfer speeds', () => {
    createWrapper({
      downloadSpeed: 1024 ** 3,
      uploadSpeed: 1024 ** 2 * 25,
    })

    expect(stats.downloadValue().text()).toBe('1.0 GiB/s')
    expect(stats.uploadValue().text()).toBe('25 MiB/s')
  })

  it.each([NaN, Infinity, -Infinity, -1024])('handles invalid speed %s safely', (speed) => {
    createWrapper({ downloadSpeed: speed, uploadSpeed: speed })

    expect(stats.downloadValue().text()).toBe('0 B/s')
    expect(stats.uploadValue().text()).toBe('0 B/s')
  })

  it('updates when transfer speeds change', async () => {
    createWrapper({ downloadSpeed: 0, uploadSpeed: 0 })

    await wrapper.setProps({
      downloadSpeed: 1024 * 1024 * 2,
      uploadSpeed: 1024 * 512,
    })

    expect(stats.downloadValue().text()).toBe('2.0 MiB/s')
    expect(stats.uploadValue().text()).toBe('512 KiB/s')
  })

  it('renders the download and upload icons', () => {
    createWrapper()

    expect(wrapper.findAll('.transfer-stats__icon svg')).toHaveLength(2)

    for (const icon of wrapper.findAll('.transfer-stats__icon svg')) {
      expect(icon.attributes('aria-hidden')).toBe('true')
      expect(icon.attributes('focusable')).toBe('false')
    }
  })

  it('does not use prohibited ARIA attributes on value spans', () => {
    createWrapper()

    expect(wrapper.findAll('.transfer-stats__value')).toHaveLength(2)
    expect(stats.labelledValues().exists()).toBe(false)
  })

  it('does not automatically announce frequent speed changes', () => {
    createWrapper()

    expect(stats.liveRegions().exists()).toBe(false)
  })
})
