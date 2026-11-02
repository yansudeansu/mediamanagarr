type Query<T> = (selector: string) => T

export function mmServiceFormSelectors<T>(query: Query<T>) {
  const root = '.service-form'
  const form = `${root} form.service-form__fields`
  const button = `${form} button`
  const confirmation = `${form} .service-form__confirmation[role="group"]`

  return {
    get: () => query(root),
    labelled: (name: string) => query(`${root}[aria-label="${name} configuration"]`),
    heading: () => query(`${root} .service-form__heading`),
    title: () => query(`${root} h2.service-form__title`),
    description: () => query(`${root} .service-form__description`),
    fields: () => query(form),
    url: () => query(`${form} input[type="url"]`),
    apiKey: () => query(`${form} input[type="password"]`),
    userSelection: () => query(`${form} .service-form__user-selection`),
    userFeedback: () => query(`${form} .service-form__user-feedback[role="status"]`),
    userSuccess: () =>
      query(`${form} .service-form__user-selection .service-form__success[role="status"]`),
    error: () => query(`${form} .service-form__error[role="alert"]`),
    success: () => query(`${form} > .service-form__success[role="status"]`),
    statuses: () => query(`${form} [role="status"]`),
    alerts: () => query(`${form} [role="alert"]`),
    buttons: () => query(button),
    connect: () => query(`${form} button[type="submit"]`),
    testConnection: () => query(`${button}[type="button"].button--secondary`),
    remove: () => query(`${button}[type="button"].button--danger`),
    confirmation: () => query(confirmation),
    confirmationLabelled: (name: string) =>
      query(`${confirmation}[aria-label="Remove ${name} server confirmation"]`),
    confirmationTitle: () => query(`${confirmation} .service-form__confirmation-title`),
    confirmationDescription: () => query(`${confirmation} .service-form__confirmation-description`),
    confirmationActions: () => query(`${confirmation} .service-form__confirmation-actions`),
    cancelRemoval: () => query(`${confirmation} button.button--secondary`),
    confirmRemoval: () => query(`${confirmation} button.button--danger`),
    requestRemoval: () => query(`${form} > button.button--danger`),
  }
}
