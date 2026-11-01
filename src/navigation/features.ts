import { SERVICES, serviceHasCapability } from '../services/registry'
import type { TabItem } from '../components/molecules/MmTabs/MmTabs.vue'
import type { ServiceCapability, SafeServiceConfigs } from '../types/service'
import type { NavigationView } from '../utils/workspace-state'

interface NavigationFeature {
  id: NavigationView
  label: string
  requiredCapability: ServiceCapability
}

export const NAVIGATION_FEATURES: readonly NavigationFeature[] = [
  {
    id: 'requests',
    label: 'Requests',
    requiredCapability: 'requests',
  },
  {
    id: 'up-next',
    label: 'Up Next',
    requiredCapability: 'up-next',
  },
  {
    id: 'calendar',
    label: 'Calendar',
    requiredCapability: 'calendar',
  },
  {
    id: 'downloads',
    label: 'Downloads',
    requiredCapability: 'downloads',
  },
]

export function getAvailableNavigationItems(configs: SafeServiceConfigs): TabItem[] {
  return NAVIGATION_FEATURES.filter((feature) =>
    SERVICES.some(
      (serviceId) =>
        configs[serviceId]?.configured === true &&
        serviceHasCapability(serviceId, feature.requiredCapability),
    ),
  ).map(({ id, label }) => ({ id, label }))
}
