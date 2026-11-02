type Query<T> = (selector: string) => T

export function mmCalendarHeaderSelectors<T>(query: Query<T>) {
  const root = '.calendar-header'
  const navigation = `${root} .calendar-header__navigation`

  return {
    get: () => query(root),
    navigation: () => query(`${navigation}[role="group"]`),
    title: () => query(`${navigation} h2.calendar-header__title`),
    liveTitle: () => query(`${navigation} h2.calendar-header__title[aria-live="polite"]`),
    previous: () => query(`${navigation} button[aria-label="Previous month"]`),
    next: () => query(`${navigation} button[aria-label="Next month"]`),
    buttons: () => query(`${navigation} button`),
    actions: () => query(`${root} .calendar-header__actions`),
  }
}
