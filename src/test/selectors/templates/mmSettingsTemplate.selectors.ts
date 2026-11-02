type Query<T> = (selector: string) => T

export function mmSettingsTemplateSelectors<T>(query: Query<T>) {
  const root = '.settings-template'
  const content = `${root} .settings-template__content`
  const navigation = `${root} > nav`

  return {
    get: () => query(root),
    navigation: () => query(navigation),
    labelledNavigation: (label: string) => query(`${navigation}[aria-label="${label}"]`),
    navigationButtons: () => query(`${navigation} button`),
    content: () => query(content),
    sections: () => query(`${content} section`),
    labelledSection: (label: string) => query(`${content} section[aria-label="${label}"]`),
    headings: () => query(`${content} h1, ${content} h2, ${content} h3`),
    labels: () => query(`${content} label`),
    inputs: () => query(`${content} input`),
  }
}
