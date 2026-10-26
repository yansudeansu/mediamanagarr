import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmTransferStats from './MmTransferStats.vue'

describe('MmTransferStats', () => {
  const defaultProps = {
    downloadSpeed: 1024,
    uploadSpeed: 512,
  }

  it('renders the transfer statistics panel', () => {
    const wrapper = mount(MmTransferStats, {
      props: defaultProps,
    })

    expect(wrapper.find('.transfer-stats').exists()).toBe(true)
  })

  it('uses the shared card component', () => {
    const wrapper = mount(MmTransferStats, {
      props: defaultProps,
    })

    expect(wrapper.find('.mm-card').exists()).toBe(true)
  })

  it('provides an accessible section label', () => {
    const wrapper = mount(MmTransferStats, {
      props: defaultProps,
    })

    expect(wrapper.get('section').attributes('aria-label')).toBe('Overall transfer speeds')
  })

  it('displays download and upload labels', () => {
    const wrapper = mount(MmTransferStats, {
      props: defaultProps,
    })

    expect(wrapper.text()).toContain('Download')
    expect(wrapper.text()).toContain('Upload')
  })

  it('formats download and upload speeds', () => {
    const wrapper = mount(MmTransferStats, {
      props: {
        downloadSpeed: 1024 * 1024,
        uploadSpeed: 512 * 1024,
      },
    })

    const values = wrapper.findAll('.transfer-stats__value')

    expect(values).toHaveLength(2)
    expect(values[0].text()).toBe('1.0 MiB/s')
    expect(values[1].text()).toBe('512 KiB/s')
  })

  it('displays zero speeds correctly', () => {
    const wrapper = mount(MmTransferStats, {
      props: {
        downloadSpeed: 0,
        uploadSpeed: 0,
      },
    })

    const values = wrapper.findAll('.transfer-stats__value')

    expect(values[0].text()).toBe('0 B/s')
    expect(values[1].text()).toBe('0 B/s')
  })

  it('handles large transfer speeds', () => {
    const wrapper = mount(MmTransferStats, {
      props: {
        downloadSpeed: 1024 ** 3,
        uploadSpeed: 1024 ** 2 * 25,
      },
    })

    const values = wrapper.findAll('.transfer-stats__value')

    expect(values[0].text()).toBe('1.0 GiB/s')
    expect(values[1].text()).toBe('25 MiB/s')
  })

  it.each([NaN, Infinity, -Infinity, -1024])('handles invalid speed %s safely', (speed) => {
    const wrapper = mount(MmTransferStats, {
      props: {
        downloadSpeed: speed,
        uploadSpeed: speed,
      },
    })

    const values = wrapper.findAll('.transfer-stats__value')

    expect(values[0].text()).toBe('0 B/s')
    expect(values[1].text()).toBe('0 B/s')
  })

  it('updates when transfer speeds change', async () => {
    const wrapper = mount(MmTransferStats, {
      props: {
        downloadSpeed: 0,
        uploadSpeed: 0,
      },
    })

    await wrapper.setProps({
      downloadSpeed: 1024 * 1024 * 2,
      uploadSpeed: 1024 * 512,
    })

    const values = wrapper.findAll('.transfer-stats__value')

    expect(values[0].text()).toBe('2.0 MiB/s')
    expect(values[1].text()).toBe('512 KiB/s')
  })

  it('renders the download and upload icons', () => {
    const wrapper = mount(MmTransferStats, {
      props: defaultProps,
    })

    const icons = wrapper.findAll('.transfer-stats__icon svg')

    expect(icons).toHaveLength(2)

    for (const icon of icons) {
      expect(icon.attributes('aria-hidden')).toBe('true')
      expect(icon.attributes('focusable')).toBe('false')
    }
  })

  it('does not use prohibited ARIA attributes on value spans', () => {
    const wrapper = mount(MmTransferStats, {
      props: defaultProps,
    })

    const values = wrapper.findAll('.transfer-stats__value')

    expect(values).toHaveLength(2)

    for (const value of values) {
      expect(value.attributes('aria-label')).toBeUndefined()
    }
  })

  it('does not automatically announce frequent speed changes', () => {
    const wrapper = mount(MmTransferStats, {
      props: defaultProps,
    })

    expect(wrapper.find('[aria-live]').exists()).toBe(false)
  })
})
