import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MmDownloadsTemplate from './MmDownloadsTemplate.vue'

describe('MmDownloadsTemplate', () => {
  it('renders the Downloads heading', () => {
    const wrapper = mount(MmDownloadsTemplate)

    expect(wrapper.get('#downloads-title').text()).toBe('Downloads')
  })

  it('renders the description', () => {
    const wrapper = mount(MmDownloadsTemplate)

    expect(wrapper.text()).toContain('Monitor and manage torrents from qBittorrent.')
  })

  it('renders default slot content', () => {
    const wrapper = mount(MmDownloadsTemplate, {
      slots: {
        default: '<article>Example torrent</article>',
      },
    })

    expect(wrapper.get('.downloads-template__content').text()).toBe('Example torrent')
  })

  it('renders actions when provided', () => {
    const wrapper = mount(MmDownloadsTemplate, {
      slots: {
        actions: '<button>Refresh</button>',
      },
    })

    expect(wrapper.get('.downloads-template__actions button').text()).toBe('Refresh')
  })

  it('renders transfer statistics when provided', () => {
    const wrapper = mount(MmDownloadsTemplate, {
      slots: {
        stats: '<div>Download: 2 MiB/s</div>',
      },
    })

    expect(wrapper.get('.downloads-template__stats').text()).toBe('Download: 2 MiB/s')
  })

  it('renders removal confirmation when provided', () => {
    const wrapper = mount(MmDownloadsTemplate, {
      slots: {
        confirmation: '<div>Remove this torrent?</div>',
      },
    })

    expect(wrapper.get('.downloads-template__confirmation').text()).toBe('Remove this torrent?')
  })

  it('does not render unused optional sections', () => {
    const wrapper = mount(MmDownloadsTemplate)

    expect(wrapper.find('.downloads-template__actions').exists()).toBe(false)
    expect(wrapper.find('.downloads-template__stats').exists()).toBe(false)
    expect(wrapper.find('.downloads-template__confirmation').exists()).toBe(false)
  })

  it('provides an accessible label for transfer statistics', () => {
    const wrapper = mount(MmDownloadsTemplate, {
      slots: {
        stats: '<div>Transfer statistics</div>',
      },
    })

    expect(wrapper.get('.downloads-template__stats').attributes('aria-label')).toBe(
      'Transfer statistics',
    )
  })

  it('provides an accessible label for removal confirmation', () => {
    const wrapper = mount(MmDownloadsTemplate, {
      slots: {
        confirmation: '<div>Remove torrent?</div>',
      },
    })

    expect(wrapper.get('.downloads-template__confirmation').attributes('aria-label')).toBe(
      'Torrent removal confirmation',
    )
  })

  it('associates the content with the Downloads heading', () => {
    const wrapper = mount(MmDownloadsTemplate)

    expect(wrapper.get('.downloads-template__content').attributes('aria-labelledby')).toBe(
      'downloads-title',
    )
  })

  it('renders all slots together', () => {
    const wrapper = mount(MmDownloadsTemplate, {
      slots: {
        actions: '<button>Refresh</button>',
        stats: '<div>Download: 2 MiB/s</div>',
        confirmation: '<div>Remove torrent?</div>',
        default: '<article>Example torrent</article>',
      },
    })

    expect(wrapper.text()).toContain('Refresh')
    expect(wrapper.text()).toContain('Download: 2 MiB/s')
    expect(wrapper.text()).toContain('Remove torrent?')
    expect(wrapper.text()).toContain('Example torrent')
  })

  it('renders confirmation before the torrent list', () => {
    const wrapper = mount(MmDownloadsTemplate, {
      slots: {
        confirmation: '<div>Remove torrent?</div>',
        default: '<article>Example torrent</article>',
      },
    })

    const confirmation = wrapper.get('.downloads-template__confirmation').element
    const content = wrapper.get('.downloads-template__content').element

    expect(
      confirmation.compareDocumentPosition(content) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })
})
