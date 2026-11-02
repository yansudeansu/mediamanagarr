import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import MmCalendarView from './MmCalendarView.vue'
import MmCalendarHeader from '../components/molecules/MmCalendarHeader/MmCalendarHeader.vue'
import MmCalendarGrid from '../components/organisms/MmCalendarGrid/MmCalendarGrid.vue'
import MmCalendarDetails from '../components/organisms/MmCalendarDetails/MmCalendarDetails.vue'
import MmFilterGroup from '../components/molecules/MmFilterGroup/MmFilterGroup.vue'
import type { CalendarItem, CalendarResult } from '../types/calendar'
import { sendBackgroundMessage } from '../utils/background-messaging'
import { mmCalendarViewSelectors } from '../test/selectors/views/mmCalendarView.selectors'

vi.mock('../utils/background-messaging', () => ({
  sendBackgroundMessage: vi.fn(),
}))

const mockedSendMessage = vi.mocked(sendBackgroundMessage)

const tvItem: CalendarItem = {
  id: 'sonarr-1',
  source: 'sonarr',
  type: 'tv',
  title: 'Example Series',
  subtitle: 'S01E01',
  date: '2026-11-05',
  releaseType: 'air',
  posterUrl: null,
}

const movieItem: CalendarItem = {
  id: 'radarr-1',
  source: 'radarr',
  type: 'movie',
  title: 'Example Movie',
  subtitle: '2026',
  date: '2026-11-12',
  releaseType: 'digital',
  posterUrl: null,
}

const calendar: CalendarResult = {
  items: [tvItem, movieItem],
  services: [
    { service: 'sonarr', state: 'connected' },
    { service: 'radarr', state: 'connected' },
  ],
}

const storageGet = vi.fn()
const storageSet = vi.fn()

let wrapper: VueWrapper

const view = mmCalendarViewSelectors((selector) => {
  if (wrapper.element instanceof Element && wrapper.element.matches(selector)) return wrapper
  return wrapper.find(selector.replace(/^\.calendar-template /, ''))
})

function mountView() {
  wrapper = mount(MmCalendarView)
  return wrapper
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.useFakeTimers()
  vi.setSystemTime(new Date(2026, 10, 5, 12))

  storageGet.mockResolvedValue({})
  storageSet.mockResolvedValue(undefined)

  vi.stubGlobal('chrome', {
    storage: {
      local: {
        get: storageGet,
        set: storageSet,
      },
    },
  })

  mockedSendMessage.mockResolvedValue({
    success: true,
    calendar,
  })
})

describe('MmCalendarView', () => {
  it('loads the current month on mount', async () => {
    mountView()
    await flushPromises()

    expect(mockedSendMessage).toHaveBeenCalledWith({
      type: 'GET_CALENDAR',
      start: '2026-11-01',
      end: '2026-12-01',
    })
  })

  it('renders calendar releases', async () => {
    mountView()
    await flushPromises()

    expect(wrapper.findComponent(MmCalendarGrid).props('items')).toEqual([tvItem, movieItem])
  })

  it('renders the release count', async () => {
    mountView()
    await flushPromises()

    expect(view.description().text()).toContain('2 releases this month')
  })

  it('places filters and actions in the same toolbar', async () => {
    mountView()
    await flushPromises()

    expect(view.toolbar().exists()).toBe(true)
    expect(view.filters().exists()).toBe(true)
    expect(view.actions().exists()).toBe(true)
  })

  it('renders Today and Refresh outside the month navigation', async () => {
    mountView()
    await flushPromises()

    expect(view.actions().text()).toContain('Today')
    expect(view.refresh().exists()).toBe(true)
    expect(view.navigation().text()).not.toContain('Today')
    expect(view.navigation().find('button[aria-label="Refresh calendar"]').exists()).toBe(false)
  })

  it('filters releases by TV', async () => {
    mountView()
    await flushPromises()

    wrapper.findComponent(MmFilterGroup).vm.$emit('update:modelValue', 'tv')
    await flushPromises()

    expect(wrapper.findComponent(MmCalendarGrid).props('items')).toEqual([tvItem])
  })

  it('filters releases by movies', async () => {
    mountView()
    await flushPromises()

    wrapper.findComponent(MmFilterGroup).vm.$emit('update:modelValue', 'movie')
    await flushPromises()

    expect(wrapper.findComponent(MmCalendarGrid).props('items')).toEqual([movieItem])
  })

  it('ignores unsupported filter values', async () => {
    mountView()
    await flushPromises()

    wrapper.findComponent(MmFilterGroup).vm.$emit('update:modelValue', 'invalid')
    await flushPromises()

    expect(wrapper.findComponent(MmCalendarGrid).props('items')).toEqual([tvItem, movieItem])
  })

  it('shows releases for the selected day', async () => {
    mountView()
    await flushPromises()

    expect(wrapper.findComponent(MmCalendarDetails).props('items')).toEqual([tvItem])

    wrapper.findComponent(MmCalendarGrid).vm.$emit('select', '2026-11-12')
    await flushPromises()

    expect(wrapper.findComponent(MmCalendarDetails).props('items')).toEqual([movieItem])
  })

  it('loads the previous month', async () => {
    mountView()
    await flushPromises()

    wrapper.findComponent(MmCalendarHeader).vm.$emit('previous')
    await flushPromises()

    expect(mockedSendMessage).toHaveBeenLastCalledWith({
      type: 'GET_CALENDAR',
      start: '2026-10-01',
      end: '2026-11-01',
    })
  })

  it('loads the next month', async () => {
    mountView()
    await flushPromises()

    wrapper.findComponent(MmCalendarHeader).vm.$emit('next')
    await flushPromises()

    expect(mockedSendMessage).toHaveBeenLastCalledWith({
      type: 'GET_CALENDAR',
      start: '2026-12-01',
      end: '2027-01-01',
    })
  })

  it('returns to today from another month', async () => {
    mountView()
    await flushPromises()

    wrapper.findComponent(MmCalendarHeader).vm.$emit('next')
    await flushPromises()

    expect(view.today().text().trim()).toBe('Today')

    await view.today().trigger('click')
    await flushPromises()

    expect(wrapper.findComponent(MmCalendarHeader).props('month')).toBe('2026-11-01')
    expect(wrapper.findComponent(MmCalendarDetails).props('date')).toBe('2026-11-05')
  })

  it('returns to today when already viewing the current month', async () => {
    mountView()
    await flushPromises()

    wrapper.findComponent(MmCalendarGrid).vm.$emit('select', '2026-11-12')
    await flushPromises()

    expect(view.today().text().trim()).toBe('Today')
    expect(view.today().attributes('disabled')).toBeUndefined()

    await view.today().trigger('click')
    await flushPromises()

    expect(wrapper.findComponent(MmCalendarDetails).props('date')).toBe('2026-11-05')
  })

  it('refreshes the current month', async () => {
    mountView()
    await flushPromises()

    expect(view.refresh().exists()).toBe(true)

    await view.refresh().trigger('click')
    await flushPromises()

    expect(mockedSendMessage).toHaveBeenCalledTimes(2)
  })

  it('disables Refresh while loading', async () => {
    let resolveRequest: ((value: { success: true; calendar: CalendarResult }) => void) | undefined

    mockedSendMessage.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve as typeof resolveRequest
        }),
    )

    mountView()
    await flushPromises()

    expect(view.refreshDisabled().exists()).toBe(true)

    resolveRequest?.({ success: true, calendar })
    await flushPromises()

    expect(view.refreshEnabled().exists()).toBe(true)
  })

  it('persists the selected date', async () => {
    mountView()
    await flushPromises()

    wrapper.findComponent(MmCalendarGrid).vm.$emit('select', '2026-11-12')
    await flushPromises()

    expect(storageSet).toHaveBeenCalledWith({
      mediaManagarrCalendarPosition: {
        month: '2026-11-01',
        selectedDate: '2026-11-12',
      },
    })
  })

  it('restores the saved calendar position', async () => {
    storageGet.mockResolvedValue({
      mediaManagarrCalendarPosition: {
        month: '2026-12-01',
        selectedDate: '2026-12-15',
      },
    })

    mountView()
    await flushPromises()

    expect(wrapper.findComponent(MmCalendarHeader).props('month')).toBe('2026-12-01')
    expect(wrapper.findComponent(MmCalendarDetails).props('date')).toBe('2026-12-15')

    expect(mockedSendMessage).toHaveBeenCalledWith({
      type: 'GET_CALENDAR',
      start: '2026-12-01',
      end: '2027-01-01',
    })
  })

  it('ignores invalid saved calendar positions', async () => {
    storageGet.mockResolvedValue({
      mediaManagarrCalendarPosition: {
        month: 'invalid',
        selectedDate: '2026-12-15',
      },
    })

    mountView()
    await flushPromises()

    expect(wrapper.findComponent(MmCalendarHeader).props('month')).toBe('2026-11-01')
  })

  it('shows a warning when one service fails', async () => {
    mockedSendMessage.mockResolvedValue({
      success: true,
      calendar: {
        items: [tvItem],
        services: [
          { service: 'sonarr', state: 'connected' },
          { service: 'radarr', state: 'failed', error: 'Connection timed out.' },
        ],
      },
    })

    mountView()
    await flushPromises()

    expect(view.warnings().text()).toContain('Radarr:')
    expect(view.warnings().text()).toContain('Connection timed out.')
    expect(wrapper.findComponent(MmCalendarGrid).props('items')).toEqual([tvItem])
  })

  it('shows setup guidance when neither service is configured', async () => {
    mockedSendMessage.mockResolvedValue({
      success: true,
      calendar: {
        items: [],
        services: [
          { service: 'sonarr', state: 'not-configured' },
          { service: 'radarr', state: 'not-configured' },
        ],
      },
    })

    mountView()
    await flushPromises()

    expect(view.setupGuidance().text()).toContain('Connect Sonarr or Radarr in Settings')
  })

  it('shows a retry action when loading fails', async () => {
    mockedSendMessage.mockResolvedValue({
      success: false,
      error: 'Background service unavailable.',
    })

    mountView()
    await flushPromises()

    expect(view.error().text()).toContain('Background service unavailable.')
    expect(view.retry().text()).toContain('Retry')
  })

  it('ignores stale responses after changing months', async () => {
    let resolveOldRequest:
      ((value: { success: true; calendar: CalendarResult }) => void) | undefined

    mockedSendMessage
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveOldRequest = resolve as typeof resolveOldRequest
          }),
      )
      .mockResolvedValue({
        success: true,
        calendar: {
          items: [movieItem],
          services: calendar.services,
        },
      })

    mountView()
    await flushPromises()

    wrapper.findComponent(MmCalendarHeader).vm.$emit('next')
    await flushPromises()

    resolveOldRequest?.({
      success: true,
      calendar,
    })
    await flushPromises()

    expect(wrapper.findComponent(MmCalendarGrid).props('items')).toEqual([movieItem])
  })

  it('does not load the calendar after unmounting during position restoration', async () => {
    let resolveStorage:
      | ((value: {
          mediaManagarrCalendarPosition: {
            month: string
            selectedDate: string
          }
        }) => void)
      | undefined

    storageGet.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveStorage = resolve
        }),
    )

    mountView()
    wrapper.unmount()

    resolveStorage?.({
      mediaManagarrCalendarPosition: {
        month: '2026-12-01',
        selectedDate: '2026-12-15',
      },
    })

    await flushPromises()

    expect(mockedSendMessage).not.toHaveBeenCalled()
    expect(storageSet).not.toHaveBeenCalled()
  })

  it('ignores a pending calendar response after unmount', async () => {
    let resolveRequest: ((value: { success: true; calendar: CalendarResult }) => void) | undefined

    mockedSendMessage.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve as typeof resolveRequest
        }),
    )

    mountView()
    await flushPromises()

    expect(mockedSendMessage).toHaveBeenCalledWith({
      type: 'GET_CALENDAR',
      start: '2026-11-01',
      end: '2026-12-01',
    })

    wrapper.unmount()

    resolveRequest?.({ success: true, calendar })
    await flushPromises()

    expect(wrapper.vm.$.isUnmounted).toBe(true)
    expect(mockedSendMessage).toHaveBeenCalledTimes(1)
  })

  it('ignores a pending poster image response after unmount', async () => {
    const posterItem: CalendarItem = {
      ...tvItem,
      posterUrl: '/example-poster.jpg',
      posterMediaId: 42,
    }

    let resolveImage: ((value: { success: true; image: string }) => void) | undefined

    mockedSendMessage.mockImplementation((message) => {
      if (message.type === 'GET_CALENDAR_IMAGE') {
        return new Promise((resolve) => {
          resolveImage = resolve as typeof resolveImage
        })
      }

      return Promise.resolve({
        success: true,
        calendar: {
          items: [posterItem],
          services: calendar.services,
        },
      })
    })

    mountView()
    await flushPromises()

    expect(mockedSendMessage).toHaveBeenCalledWith({
      type: 'GET_CALENDAR_IMAGE',
      service: 'sonarr',
      mediaId: 42,
    })

    wrapper.unmount()

    resolveImage?.({
      success: true,
      image: 'data:image/png;base64,example',
    })

    await flushPromises()

    expect(wrapper.vm.$.isUnmounted).toBe(true)
    expect(mockedSendMessage).toHaveBeenCalledTimes(2)
  })
})
