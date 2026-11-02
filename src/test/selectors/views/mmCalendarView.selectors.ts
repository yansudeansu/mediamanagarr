type Query<T> = (selector: string) => T

export function mmCalendarViewSelectors<T>(query: Query<T>) {
  const root = '.calendar-template'
  const toolbar = `${root} .calendar-template__toolbar`
  const actions = `${toolbar} .calendar-template__actions`
  const navigation = `${root} .calendar-template__navigation`
  const status = `${root} .calendar-template__status`
  const content = `${root} .calendar-template__content`

  return {
    get: () => query(root),
    title: () => query(`${root} #calendar-title`),
    description: () => query(`${root} .calendar-template__description`),
    toolbar: () => query(toolbar),
    filters: () => query(`${toolbar} .calendar-template__filters`),
    filterButtons: () => query(`${toolbar} .filter-group__button`),
    actions: () => query(actions),
    today: () => query(`${actions} button:first-child`),
    refresh: () => query(`${actions} button[aria-label="Refresh calendar"]`),
    refreshDisabled: () => query(`${actions} button[aria-label="Refresh calendar"]:disabled`),
    refreshEnabled: () => query(`${actions} button[aria-label="Refresh calendar"]:enabled`),
    navigation: () => query(navigation),
    previous: () => query(`${navigation} button[aria-label="Previous month"]`),
    next: () => query(`${navigation} button[aria-label="Next month"]`),
    status: () => query(status),
    loading: () => query(`${status} .calendar-view__message[role="status"]`),
    error: () => query(`${status} .calendar-view__error[role="alert"]`),
    retry: () => query(`${status} .calendar-view__error button`),
    warnings: () => query(`${status} .calendar-view__warning[role="status"]`),
    content: () => query(content),
    setupGuidance: () => query(`${content} .calendar-view__message`),
    grid: () => query(`${content} .calendar-grid`),
    details: () => query(`${root} .calendar-template__details`),
  }
}
