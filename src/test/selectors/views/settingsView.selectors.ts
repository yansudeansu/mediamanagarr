type Query<T> = (selector: string) => T

export function settingsViewSelectors<T>(query: Query<T>) {
  const root = '.settings-template'
  const section = `${root} .settings-section`
  const connections = `${section}[aria-labelledby="service-connections-title"]`
  const workspace = `${section}[aria-labelledby="workspace-settings-title"]`
  const health = `${connections} .service-health`
  const form = `${connections} .service-form`

  return {
    get: () => query(root),
    navigation: () => query(`${root} .settings-template__navigation`),
    tabs: () => query(`${root} .tabs`),
    tablist: () => query(`${root} [role="tablist"]`),
    connectionsTab: () => query(`${root} .tabs__items button.tabs__item:nth-child(1)`),
    workspaceTab: () => query(`${root} .tabs__items button.tabs__item:nth-child(2)`),
    selectedTab: () => query(`${root} [role="tab"][aria-selected="true"]`),
    sections: () => query(section),
    connections: () => query(connections),
    connectionsTitle: () => query(`${connections} #service-connections-title`),
    serviceSelector: () => query(`${connections} .service-selector`),
    serviceCards: () => query(`${connections} .service-card`),
    serviceForm: () => query(form),
    serviceError: () => query(`${form} .service-form__error`),
    serviceSuccess: () => query(`${form} .service-form__success`),
    health: () => query(health),
    healthBadge: () => query(`${health} .status-badge__label`),
    healthTime: () => query(`${health} .service-health__time`),
    healthAlert: () => query(`${health} [role="alert"]`),
    workspace: () => query(workspace),
    workspaceTitle: () => query(`${workspace} #workspace-settings-title`),
    workspacePanel: () => query(`${workspace} .mm-panel`),
    workspaceSelect: () => query(`${workspace} .select-field`),
    workspaceTrigger: () => query(`${workspace} .select-field__trigger`),
    workspaceActions: () => query(`${workspace} .settings-section__actions`),
    openSidebar: () => query(`${workspace} .settings-section__actions button:first-of-type`),
    openDetached: () => query(`${workspace} .settings-section__actions button:last-of-type`),
    workspaceError: () => query(`${workspace} .settings-section__error[role="alert"]`),
    workspaceSuccess: () => query(`${workspace} .settings-section__success[role="status"]`),
  }
}
