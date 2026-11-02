import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import MmCalendarTooltip from './MmCalendarTooltip.vue'
import { mmCalendarTooltipSelectors } from '../../../test/selectors/molecules/mmCalendarTooltip.selectors'
import type { CalendarItem } from '../../../types/calendar'

const tvItem: CalendarItem = {
  id: 'sonarr-101',
  source: 'sonarr',
  type: 'tv',
  title: 'Example Series',
  subtitle: 'S02E03 · The Adventure',
  date: '2026-11-05',
  releaseType: 'air',
  posterUrl: null,
}

const movieItem: CalendarItem = {
  id: 'radarr-201',
  source: 'radarr',
  type: 'movie',
  title: 'Example Movie',
  subtitle: '2026',
  date: '2026-11-05',
  releaseType: 'digital',
  posterUrl: null,
}

let wrapper: VueWrapper

const tooltip = mmCalendarTooltipSelectors((selector) => {
  if (wrapper.element.matches(selector)) return wrapper
  return wrapper.find(selector.replace(/^\.calendar-tooltip\[role="tooltip"\] /, ''))
})

function mountTooltip(items: CalendarItem[] = [tvItem], date = '2026-11-05') {
  wrapper = mount(MmCalendarTooltip, { props: { date, items } })
  return wrapper
}

describe('MmCalendarTooltip', () => {
  it('renders an accessible tooltip', () => {
    mountTooltip()

    expect(tooltip.get().attributes('role')).toBe('tooltip')
    expect(tooltip.date().text()).toBe('Thursday, November 5')
  })

  it('renders release titles and subtitles', () => {
    mountTooltip([tvItem, movieItem])

    expect(tooltip.itemTitle(0).text()).toBe('Example Series')
    expect(tooltip.itemSubtitle(0).text()).toBe('S02E03 · The Adventure')
    expect(tooltip.itemTitle(1).text()).toBe('Example Movie')
    expect(tooltip.itemSubtitle(1).text()).toBe('2026')
  })

  it('renders media indicators', () => {
    mountTooltip([tvItem, movieItem])

    expect(tooltip.tvIndicators().exists()).toBe(true)
    expect(tooltip.movieIndicators().exists()).toBe(true)
    expect(tooltip.decorativeIndicators().exists()).toBe(true)
  })

  it('shows the plural release count', () => {
    mountTooltip([tvItem, movieItem])

    expect(tooltip.count().text()).toBe('2 releases')
  })

  it('shows the singular release count', () => {
    mountTooltip([tvItem])

    expect(tooltip.count().text()).toBe('1 release')
  })

  it('shows zero releases when the day is empty', () => {
    mountTooltip([])

    expect(tooltip.count().text()).toBe('0 releases')
    expect(tooltip.firstItem().exists()).toBe(false)
  })

  it('limits the preview to four releases', () => {
    const items = Array.from({ length: 6 }, (_, index) => ({
      ...tvItem,
      id: `sonarr-${index}`,
      title: `Series ${index}`,
    }))

    mountTooltip(items)

    expect(tooltip.item(0).exists()).toBe(true)
    expect(tooltip.item(3).exists()).toBe(true)
    expect(tooltip.item(4).exists()).toBe(false)
    expect(tooltip.remaining().text()).toBe('+2 more')
    expect(tooltip.count().text()).toBe('6 releases')
  })

  it('handles invalid dates', () => {
    mountTooltip([tvItem], 'invalid')

    expect(tooltip.date().text()).toBe('Unknown date')
  })
})
