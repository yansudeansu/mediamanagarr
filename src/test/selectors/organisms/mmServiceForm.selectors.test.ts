import { describe, expect, it, vi } from 'vitest'
import { mmServiceFormSelectors } from './mmServiceForm.selectors'

describe('mmServiceFormSelectors', () => {
  const select = () => mmServiceFormSelectors((selector) => selector)
  const root = '.service-form'
  const form = `${root} form.service-form__fields`
  const confirmation = `${form} .service-form__confirmation[role="group"]`

  it('selects the root and accessible label', () => {
    const service = select()

    expect(service.get()).toBe(root)
    expect(service.labelled('Jellyfin')).toBe(`${root}[aria-label="Jellyfin configuration"]`)
  })

  it('selects the heading and description', () => {
    const service = select()

    expect(service.heading()).toBe(`${root} .service-form__heading`)
    expect(service.title()).toBe(`${root} h2.service-form__title`)
    expect(service.description()).toBe(`${root} .service-form__description`)
  })

  it('selects the form and credentials', () => {
    const service = select()

    expect(service.fields()).toBe(form)
    expect(service.url()).toBe(`${form} input[type="url"]`)
    expect(service.apiKey()).toBe(`${form} input[type="password"]`)
  })

  it('selects optional user controls and feedback', () => {
    const service = select()

    expect(service.userSelection()).toBe(`${form} .service-form__user-selection`)
    expect(service.userFeedback()).toBe(`${form} .service-form__user-feedback[role="status"]`)
    expect(service.userSuccess()).toBe(
      `${form} .service-form__user-selection .service-form__success[role="status"]`,
    )
  })

  it('selects connection feedback', () => {
    const service = select()

    expect(service.error()).toBe(`${form} .service-form__error[role="alert"]`)
    expect(service.success()).toBe(`${form} > .service-form__success[role="status"]`)
    expect(service.statuses()).toBe(`${form} [role="status"]`)
    expect(service.alerts()).toBe(`${form} [role="alert"]`)
  })

  it('selects action buttons', () => {
    const service = select()

    expect(service.buttons()).toBe(`${form} button`)
    expect(service.connect()).toBe(`${form} button[type="submit"]`)
    expect(service.testConnection()).toBe(`${form} button[type="button"].button--secondary`)
    expect(service.remove()).toBe(`${form} button[type="button"].button--danger`)
  })

  it('selects removal confirmation', () => {
    const service = select()

    expect(service.confirmation()).toBe(confirmation)
    expect(service.confirmationLabelled('Jellyfin')).toBe(
      `${confirmation}[aria-label="Remove Jellyfin server confirmation"]`,
    )
    expect(service.confirmationTitle()).toBe(`${confirmation} .service-form__confirmation-title`)
    expect(service.confirmationDescription()).toBe(
      `${confirmation} .service-form__confirmation-description`,
    )
    expect(service.confirmationActions()).toBe(
      `${confirmation} .service-form__confirmation-actions`,
    )
  })

  it('distinguishes removal actions', () => {
    const service = select()

    expect(service.cancelRemoval()).toBe(`${confirmation} button.button--secondary`)
    expect(service.confirmRemoval()).toBe(`${confirmation} button.button--danger`)
    expect(service.requestRemoval()).toBe(`${form} > button.button--danger`)
  })

  it('delegates queries', () => {
    const query = vi.fn((selector: string) => ({ selector }))
    const service = mmServiceFormSelectors(query)

    expect(service.url()).toEqual({ selector: `${form} input[type="url"]` })
    expect(service.confirmation()).toEqual({ selector: confirmation })
    expect(query).toHaveBeenCalledTimes(2)
  })

  it('supports scoped queries', () => {
    const service = mmServiceFormSelectors((selector) => `#settings ${selector}`)

    expect(service.get()).toBe('#settings .service-form')
    expect(service.apiKey()).toBe(`#settings ${form} input[type="password"]`)
  })

  it('evaluates queries lazily', () => {
    const query = vi.fn((selector: string) => selector)

    mmServiceFormSelectors(query)

    expect(query).not.toHaveBeenCalled()
  })
})
