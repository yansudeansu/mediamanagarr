import { test, expect } from '../fixtures/extension.fixture'
import { appSelectors } from '../../../src/test/selectors/app.selectors'
import { settingsViewSelectors } from '../../../src/test/selectors/views/settingsView.selectors'
import { mmSettingsTemplateSelectors } from '../../../src/test/selectors/templates/mmSettingsTemplate.selectors'
import { mmServiceFormSelectors } from '../../../src/test/selectors/organisms/mmServiceForm.selectors'
import { mmServiceSelectorSelectors } from '../../../src/test/selectors/organisms/mmServiceSelector.selectors'
import { mmTabsSelectors } from '../../../src/test/selectors/molecules/mmTabs.selectors'
import { configuredServices } from '../fixtures/services.fixture'
import { SONARR_TEST_API_KEY } from '../fixtures/mock-services.fixture'

test('shows Connections by default', async ({ extensionPage }) => {
  const app = appSelectors((selector) => extensionPage.locator(selector))
  const settings = settingsViewSelectors((selector) => extensionPage.locator(selector))
  const template = mmSettingsTemplateSelectors((selector) => extensionPage.locator(selector))
  const services = mmServiceSelectorSelectors((selector) => extensionPage.locator(selector))
  const form = mmServiceFormSelectors((selector) => extensionPage.locator(selector))

  await app.setupSettings().click()

  await expect(settings.get()).toBeVisible()
  await expect(template.content()).toBeVisible()
  await expect(settings.connections()).toBeVisible()
  await expect(settings.connectionsTitle()).toHaveText('Service Connections')
  await expect(services.labelled('Service connections')).toBeVisible()
  await expect(form.labelled('Jellyfin')).toBeVisible()
})

test('lists all five supported services', async ({ extensionPage }) => {
  const app = appSelectors((selector) => extensionPage.locator(selector))
  const services = mmServiceSelectorSelectors((selector) => extensionPage.locator(selector))

  await app.setupSettings().click()

  await expect(services.cards()).toHaveCount(5)
  await expect(services.names()).toHaveText([
    'Jellyfin',
    'Seerr',
    'Sonarr',
    'Radarr',
    'qBittorrent',
  ])
})

test('selects a service and updates the configuration form', async ({ extensionPage }) => {
  const app = appSelectors((selector) => extensionPage.locator(selector))
  const services = mmServiceSelectorSelectors((selector) => extensionPage.locator(selector))
  const form = mmServiceFormSelectors((selector) => extensionPage.locator(selector))

  await app.setupSettings().click()

  await services.cards().filter({ hasText: 'Sonarr' }).click()

  await expect(services.selected()).toContainText('Sonarr')
  await expect(form.labelled('Sonarr')).toBeVisible()
  await expect(form.title()).toHaveText('Sonarr')

  await services.cards().filter({ hasText: 'Radarr' }).click()

  await expect(services.selected()).toContainText('Radarr')
  await expect(form.labelled('Radarr')).toBeVisible()
})

test('validates a missing API key', async ({ extensionPage }) => {
  const app = appSelectors((selector) => extensionPage.locator(selector))
  const form = mmServiceFormSelectors((selector) => extensionPage.locator(selector))

  await app.setupSettings().click()

  await form.url().fill('https://jellyfin.example.test')
  await form.connect().click()

  await expect(form.error()).toHaveText('Enter an API key.')
})

test('switches between Connections and Workspace', async ({ extensionPage }) => {
  const app = appSelectors((selector) => extensionPage.locator(selector))
  const settings = settingsViewSelectors((selector) => extensionPage.locator(selector))
  const tabs = mmTabsSelectors((selector) => extensionPage.locator(selector))

  await app.setupSettings().click()

  await expect(tabs.labelled('Settings sections')).toBeVisible()
  await expect(settings.connections()).toBeVisible()

  await settings.workspaceTab().click()

  await expect(settings.workspace()).toBeVisible()
  await expect(settings.workspaceTitle()).toHaveText('Workspace')
  await expect(settings.workspaceSelect()).toBeVisible()
  await expect(settings.openSidebar()).toBeVisible()
  await expect(settings.openDetached()).toBeVisible()

  await settings.connectionsTab().click()

  await expect(settings.connections()).toBeVisible()
  await expect(settings.workspace()).toHaveCount(0)
})

test.describe('configured services', () => {
  test.use({
    storageSeed: {
      services: configuredServices('sonarr'),
    },
  })

  test('shows saved configuration and connection actions', async ({ extensionPage }) => {
    const app = appSelectors((selector) => extensionPage.locator(selector))
    const services = mmServiceSelectorSelectors((selector) => extensionPage.locator(selector))
    const form = mmServiceFormSelectors((selector) => extensionPage.locator(selector))

    await app.quickAccess().click()
    await app.openSettings().click()

    await services.cards().filter({ hasText: 'Sonarr' }).click()

    await expect(form.labelled('Sonarr')).toBeVisible()
    await expect(form.url()).toHaveValue('https://sonarr.example.test')
    await expect(form.apiKey()).toBeEmpty()
    await expect(form.testConnection()).toBeVisible()
    await expect(form.requestRemoval()).toBeVisible()
  })

  test('shows removal confirmation and allows cancellation', async ({ extensionPage }) => {
    const app = appSelectors((selector) => extensionPage.locator(selector))
    const services = mmServiceSelectorSelectors((selector) => extensionPage.locator(selector))
    const form = mmServiceFormSelectors((selector) => extensionPage.locator(selector))

    await app.quickAccess().click()
    await app.openSettings().click()

    await services.cards().filter({ hasText: 'Sonarr' }).click()
    await expect(form.requestRemoval()).toBeVisible()

    await form.requestRemoval().click()

    await expect(form.confirmationLabelled('Sonarr')).toBeVisible()
    await expect(form.confirmationTitle()).toHaveText('Remove Sonarr server?')
    await expect(form.cancelRemoval()).toBeVisible()
    await expect(form.confirmRemoval()).toBeVisible()

    await form.cancelRemoval().click()

    await expect(form.confirmation()).toHaveCount(0)
    await expect(form.requestRemoval()).toBeVisible()
  })

  test('keeps the saved API key hidden', async ({ extensionPage }) => {
    const app = appSelectors((selector) => extensionPage.locator(selector))
    const services = mmServiceSelectorSelectors((selector) => extensionPage.locator(selector))
    const form = mmServiceFormSelectors((selector) => extensionPage.locator(selector))

    await app.quickAccess().click()
    await app.openSettings().click()

    await services.cards().filter({ hasText: 'Sonarr' }).click()

    await expect(form.apiKey()).toHaveAttribute('type', 'password')
    await expect(form.apiKey()).toBeEmpty()
    await expect(form.apiKey()).toHaveAttribute('placeholder', 'Leave blank to keep saved key')
  })

  test('requires a new API key when the server URL changes', async ({ extensionPage }) => {
    const app = appSelectors((selector) => extensionPage.locator(selector))
    const services = mmServiceSelectorSelectors((selector) => extensionPage.locator(selector))
    const form = mmServiceFormSelectors((selector) => extensionPage.locator(selector))

    await app.quickAccess().click()
    await app.openSettings().click()

    await services.cards().filter({ hasText: 'Sonarr' }).click()

    await form.url().fill('https://different-sonarr.example.test')
    await form.connect().click()

    await expect(form.error()).toHaveText('Enter an API key.')
    await expect(form.url()).toHaveValue('https://different-sonarr.example.test')
  })

  test('removes a configured service and persists removal after reload', async ({
    extensionPage,
  }) => {
    const app = appSelectors((selector) => extensionPage.locator(selector))
    const services = mmServiceSelectorSelectors((selector) => extensionPage.locator(selector))
    const form = mmServiceFormSelectors((selector) => extensionPage.locator(selector))

    await app.quickAccess().click()
    await app.openSettings().click()

    await services.cards().filter({ hasText: 'Sonarr' }).click()

    await form.requestRemoval().click()
    await expect(form.confirmationLabelled('Sonarr')).toBeVisible()

    await form.confirmRemoval().click()

    await expect(form.success()).toHaveText('Sonarr server removed successfully.')
    await expect(form.requestRemoval()).toHaveCount(0)

    await extensionPage.reload()

    const savedServices = await extensionPage.evaluate(async () => {
      const result = await chrome.storage.local.get('mediaManagarrServices')
      return result.mediaManagarrServices
    })

    expect(savedServices?.sonarr).toBeUndefined()
  })
})

test('connects to Sonarr using the mock server', async ({ extensionPage, mockSonarr }) => {
  const app = appSelectors((selector) => extensionPage.locator(selector))
  const services = mmServiceSelectorSelectors((selector) => extensionPage.locator(selector))
  const form = mmServiceFormSelectors((selector) => extensionPage.locator(selector))

  const permissionGranted = await extensionPage.evaluate(async (url) => {
    const origin = new URL(url)

    return chrome.permissions.contains({
      origins: [`${origin.protocol}//${origin.host}/*`],
    })
  }, mockSonarr.url)

  expect(permissionGranted).toBe(true)

  await app.setupSettings().click()
  await services.cards().filter({ hasText: 'Sonarr' }).click()

  await form.url().fill(mockSonarr.url)
  await form.apiKey().fill(SONARR_TEST_API_KEY)
  await form.connect().click()

  await expect(form.success()).toHaveText('Connected to Sonarr successfully.')
  await expect(form.requestRemoval()).toBeVisible()

  expect(mockSonarr.requests()).toBeGreaterThan(0)
})
