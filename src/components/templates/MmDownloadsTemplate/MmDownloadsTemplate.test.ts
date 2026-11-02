import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import MmDownloadsTemplate from './MmDownloadsTemplate.vue'
import { mmDownloadsTemplateSelectors } from '../../../test/selectors/templates/mmDownloadsTemplate.selectors'

let wrapper: VueWrapper

const template = mmDownloadsTemplateSelectors((selector) => {
  if (wrapper.element instanceof Element && wrapper.element.matches(selector)) return wrapper
  return wrapper.find(selector.replace(/^\.downloads-template /, ''))
})

describe('MmDownloadsTemplate', () => {
  it('renders the Downloads heading', () => {
    wrapper = mount(MmDownloadsTemplate)

    expect(template.title().text()).toBe('Downloads')
  })

  it('renders the description', () => {
    wrapper = mount(MmDownloadsTemplate)

    expect(template.description().text()).toBe('Monitor and manage torrents from qBittorrent.')
  })

  it('renders default slot content', () => {
    wrapper = mount(MmDownloadsTemplate, {
      slots: { default: '<article>Example torrent</article>' },
    })

    expect(template.content().text()).toBe('Example torrent')
  })

  it('renders actions when provided', () => {
    wrapper = mount(MmDownloadsTemplate, {
      slots: { actions: '<button>Refresh</button>' },
    })

    expect(template.actionButtons().text()).toBe('Refresh')
  })

  it('renders transfer statistics when provided', () => {
    wrapper = mount(MmDownloadsTemplate, {
      slots: { stats: '<div>Download: 2 MiB/s</div>' },
    })

    expect(template.stats().text()).toBe('Download: 2 MiB/s')
  })

  it('renders removal confirmation when provided', () => {
    wrapper = mount(MmDownloadsTemplate, {
      slots: { confirmation: '<div>Remove this torrent?</div>' },
    })

    expect(template.confirmation().text()).toBe('Remove this torrent?')
  })

  it('does not render unused optional sections', () => {
    wrapper = mount(MmDownloadsTemplate)

    expect(template.actions().exists()).toBe(false)
    expect(template.stats().exists()).toBe(false)
    expect(template.confirmation().exists()).toBe(false)
  })

  it('provides an accessible label for transfer statistics', () => {
    wrapper = mount(MmDownloadsTemplate, {
      slots: { stats: '<div>Transfer statistics</div>' },
    })

    expect(template.labelledStats().exists()).toBe(true)
    expect(template.stats().attributes('aria-label')).toBe('Transfer statistics')
  })

  it('provides an accessible label for removal confirmation', () => {
    wrapper = mount(MmDownloadsTemplate, {
      slots: { confirmation: '<div>Remove torrent?</div>' },
    })

    expect(template.labelledConfirmation().exists()).toBe(true)
    expect(template.confirmation().attributes('aria-label')).toBe('Torrent removal confirmation')
  })

  it('associates the content with the Downloads heading', () => {
    wrapper = mount(MmDownloadsTemplate)

    expect(template.labelledContent().exists()).toBe(true)
    expect(template.title().attributes('id')).toBe('downloads-title')
  })

  it('renders all slots together', () => {
    wrapper = mount(MmDownloadsTemplate, {
      slots: {
        actions: '<button>Refresh</button>',
        stats: '<div>Download: 2 MiB/s</div>',
        confirmation: '<div>Remove torrent?</div>',
        default: '<article>Example torrent</article>',
      },
    })

    expect(template.actions().text()).toContain('Refresh')
    expect(template.stats().text()).toContain('Download: 2 MiB/s')
    expect(template.confirmation().text()).toContain('Remove torrent?')
    expect(template.content().text()).toContain('Example torrent')
  })

  it('renders confirmation before the torrent list', () => {
    wrapper = mount(MmDownloadsTemplate, {
      slots: {
        confirmation: '<div>Remove torrent?</div>',
        default: '<article>Example torrent</article>',
      },
    })

    const confirmation = template.confirmation().element
    const content = template.content().element

    expect(
      confirmation.compareDocumentPosition(content) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })
})
