type Query<T> = (selector: string) => T

export function mmCalendarTemplateSelectors<T>(query: Query<T>) {
  const root = '.calendar-template'
  const toolbar = `${root} section.calendar-template__toolbar`
  const content = `${root} section.calendar-template__content`

  return {
    get: () => query(root),
    header: () => query(`${root} header.calendar-template__header`),
    heading: () => query(`${root} .calendar-template__heading`),
    title: () => query(`${root} h2#calendar-title.calendar-template__title`),
    description: () => query(`${root} .calendar-template__description`),
    toolbar: () => query(toolbar),
    labelledToolbar: () => query(`${toolbar}[aria-label="Calendar controls"]`),
    filters: () => query(`${toolbar} .calendar-template__filters`),
    actions: () => query(`${toolbar} .calendar-template__actions`),
    navigation: () => query(`${root} section.calendar-template__navigation`),
    labelledNavigation: () =>
      query(`${root} section.calendar-template__navigation[aria-label="Calendar navigation"]`),
    status: () => query(`${root} .calendar-template__status`),
    statusMessage: () => query(`${root} .calendar-template__status [role="status"]`),
    content: () => query(content),
    labelledContent: () => query(`${content}[aria-labelledby="calendar-title"]`),
    details: () => query(`${root} .calendar-template__details`),
  }
}
