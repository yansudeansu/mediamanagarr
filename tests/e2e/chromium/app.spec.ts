import { test, expect } from '../fixtures/extension.fixture'
import { appSelectors } from '../../../src/test/selectors/app.selectors'
import { configuredServices, allServices } from '../fixtures/services.fixture'

test('renders the MediaManagarr application shell', async ({ extensionPage }) => {
  const app = appSelectors((selector) => extensionPage.locator(selector))

  await expect(app.get()).toBeVisible()
  await expect(app.content()).toBeVisible()
  await expect(app.footer()).toBeVisible()
})

test('shows setup guidance when no services are configured', async ({ extensionPage }) => {
  const app = appSelectors((selector) => extensionPage.locator(selector))

  await expect(app.emptyNavigation()).toBeVisible()
  await expect(app.emptyNavigation()).toContainText('No services configured yet.')
  await expect(app.navigation()).toHaveCount(0)
})

test('opens Settings from Quick Access', async ({ extensionPage }) => {
  const app = appSelectors((selector) => extensionPage.locator(selector))

  await app.quickAccess().click()
  await app.openSettings().click()

  await expect(app.settingsContent()).toBeVisible()
  await expect(app.back()).toBeVisible()
})

test('opens Settings from the empty setup state', async ({ extensionPage }) => {
  const app = appSelectors((selector) => extensionPage.locator(selector))

  await app.setupSettings().click()

  await expect(app.settingsContent()).toBeVisible()
})

test.describe('workspace restoration', () => {
  test.use({
    storageSeed: {
      workspace: {
        activeView: 'calendar',
        settingsOpen: true,
      },
    },
  })

  test('restores Settings from session storage', async ({ extensionPage }) => {
    const app = appSelectors((selector) => extensionPage.locator(selector))

    await expect(app.settingsContent()).toBeVisible()
    await expect(app.back()).toBeVisible()
  })

  test('persists closing Settings', async ({ extensionPage }) => {
    const app = appSelectors((selector) => extensionPage.locator(selector))

    await app.back().click()

    await expect
      .poll(async () => {
        return extensionPage.evaluate(async () => {
          const result = await chrome.storage.session.get('workspaceNavigationState')
          return result.workspaceNavigationState
        })
      })
      .toEqual({
        activeView: 'calendar',
        settingsOpen: false,
      })
  })
})

test.describe('configured navigation', () => {
  test.use({
    storageSeed: {
      services: allServices,
    },
  })

  test('shows all available views', async ({ extensionPage }) => {
    const app = appSelectors((selector) => extensionPage.locator(selector))

    await expect(app.navigation()).toBeVisible()
    await expect(app.navigation()).toContainText('Requests')
    await expect(app.navigation()).toContainText('Up Next')
    await expect(app.navigation()).toContainText('Calendar')
    await expect(app.navigation()).toContainText('Downloads')
  })

  test('navigates between available views', async ({ extensionPage }) => {
    const app = appSelectors((selector) => extensionPage.locator(selector))
    const navigation = extensionPage.getByRole('navigation', { name: 'Main navigation' })

    await navigation.getByRole('button', { name: 'Calendar' }).click()
    await expect(app.currentPage()).toContainText('Calendar')

    await navigation.getByRole('button', { name: 'Downloads' }).click()
    await expect(app.currentPage()).toContainText('Downloads')

    await navigation.getByRole('button', { name: 'Requests' }).click()
    await expect(app.currentPage()).toContainText('Requests')
  })

  test('preserves the selected view when Settings closes', async ({ extensionPage }) => {
    const app = appSelectors((selector) => extensionPage.locator(selector))
    const navigation = extensionPage.getByRole('navigation', { name: 'Main navigation' })

    await navigation.getByRole('button', { name: 'Calendar' }).click()
    await app.quickAccess().click()
    await app.openSettings().click()

    await expect(app.settingsContent()).toBeVisible()

    await app.back().click()

    await expect(app.currentPage()).toContainText('Calendar')
  })

  test('persists navigation in session storage', async ({ extensionPage }) => {
    const navigation = extensionPage.getByRole('navigation', { name: 'Main navigation' })

    await navigation.getByRole('button', { name: 'Downloads' }).click()

    await expect
      .poll(async () => {
        return extensionPage.evaluate(async () => {
          const result = await chrome.storage.session.get('workspaceNavigationState')
          return result.workspaceNavigationState?.activeView
        })
      })
      .toBe('downloads')
  })

  test('restores the selected view after reloading', async ({ extensionPage }) => {
    const app = appSelectors((selector) => extensionPage.locator(selector))
    const navigation = extensionPage.getByRole('navigation', { name: 'Main navigation' })

    await navigation.getByRole('button', { name: 'Calendar' }).click()

    await expect
      .poll(async () => {
        return extensionPage.evaluate(async () => {
          const result = await chrome.storage.session.get('workspaceNavigationState')
          return result.workspaceNavigationState?.activeView
        })
      })
      .toBe('calendar')

    await extensionPage.reload()

    await expect(app.currentPage()).toContainText('Calendar')
  })
})

test.describe('capability-based navigation', () => {
  test.use({
    storageSeed: {
      services: configuredServices('jellyfin', 'sonarr'),
    },
  })

  test('shows only the supported navigation items', async ({ extensionPage }) => {
    const app = appSelectors((selector) => extensionPage.locator(selector))

    await expect(app.navigation()).toBeVisible()
    await expect(app.navigation()).toContainText('Up Next')
    await expect(app.navigation()).toContainText('Calendar')
    await expect(app.navigation()).not.toContainText('Requests')
    await expect(app.navigation()).not.toContainText('Downloads')
  })
})

test.describe('single-service navigation', () => {
  test.use({
    storageSeed: {
      services: configuredServices('jellyfin'),
    },
  })

  test('hides navigation when only one view is available', async ({ extensionPage }) => {
    const app = appSelectors((selector) => extensionPage.locator(selector))

    await expect(app.navigation()).toHaveCount(0)
    await expect(app.content()).toBeVisible()
    await expect(app.emptyNavigation()).toHaveCount(0)
  })
})
