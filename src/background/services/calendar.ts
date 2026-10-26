import type {
  CalendarItem,
  CalendarResult,
  CalendarServiceId,
  CalendarServiceStatus,
} from '../../types/calendar'
import type { ServiceConfig } from '../../types/service'
import { getServiceConfig } from '../../utils/service-storage'
import { getHostPermission } from '../../utils/service-config'
import { calendarItemDateKey } from '../../utils/calendar-date'
import { fetchSonarrCalendar } from './sonarr-calendar'
import { fetchRadarrCalendar } from './radarr-calendar'

interface CalendarService {
  id: CalendarServiceId
  fetch: (config: ServiceConfig, start: Date, end: Date) => Promise<CalendarItem[]>
}

const CALENDAR_SERVICES: CalendarService[] = [
  {
    id: 'sonarr',
    fetch: fetchSonarrCalendar,
  },
  {
    id: 'radarr',
    fetch: fetchRadarrCalendar,
  },
]

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'An unexpected error occurred.'
}

async function loadServiceCalendar(
  service: CalendarService,
  start: Date,
  end: Date,
): Promise<{
  items: CalendarItem[]
  status: CalendarServiceStatus
}> {
  const config = await getServiceConfig(service.id)

  if (!config) {
    return {
      items: [],
      status: {
        service: service.id,
        state: 'not-configured',
      },
    }
  }

  const hasPermission = await chrome.permissions.contains({
    origins: [getHostPermission(config.url)],
  })

  if (!hasPermission) {
    return {
      items: [],
      status: {
        service: service.id,
        state: 'failed',
        error: `${service.id === 'sonarr' ? 'Sonarr' : 'Radarr'} server access has not been granted.`,
      },
    }
  }

  const items = await service.fetch(config, start, end)

  return {
    items,
    status: {
      service: service.id,
      state: 'connected',
    },
  }
}

export async function loadCalendar(start: Date, end: Date): Promise<CalendarResult> {
  if (
    !Number.isFinite(start.getTime()) ||
    !Number.isFinite(end.getTime()) ||
    start.getTime() >= end.getTime()
  ) {
    throw new Error('Invalid calendar date range.')
  }

  const results = await Promise.allSettled(
    CALENDAR_SERVICES.map((service) => loadServiceCalendar(service, start, end)),
  )

  const items: CalendarItem[] = []
  const services: CalendarServiceStatus[] = []

  results.forEach((result, index) => {
    const service = CALENDAR_SERVICES[index]

    if (result.status === 'fulfilled') {
      items.push(...result.value.items)
      services.push(result.value.status)
      return
    }

    services.push({
      service: service.id,
      state: 'failed',
      error: getErrorMessage(result.reason),
    })
  })

  items.sort((first, second) => {
    const firstDate = calendarItemDateKey(first.date) ?? ''
    const secondDate = calendarItemDateKey(second.date) ?? ''

    const dateComparison = firstDate.localeCompare(secondDate)

    if (dateComparison !== 0) {
      return dateComparison
    }

    return first.id.localeCompare(second.id)
  })

  return {
    items,
    services,
  }
}
