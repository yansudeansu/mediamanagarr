import type { NavigationView } from '../components/molecules/MmNavigation/MmNavigation.vue'

export interface WorkspaceNavigationState {
  activeView: NavigationView
  settingsOpen: boolean
}

const WORKSPACE_STATE_KEY = 'workspaceNavigationState'

const DEFAULT_WORKSPACE_STATE: WorkspaceNavigationState = {
  activeView: 'requests',
  settingsOpen: false,
}

const VALID_VIEWS: readonly NavigationView[] = ['requests', 'up-next', 'calendar', 'downloads']

function isWorkspaceNavigationState(value: unknown): value is WorkspaceNavigationState {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false
  }

  const state = value as Record<string, unknown>

  return (
    VALID_VIEWS.some((view) => view === state.activeView) && typeof state.settingsOpen === 'boolean'
  )
}

export async function getWorkspaceNavigationState(): Promise<WorkspaceNavigationState> {
  const result = await chrome.storage.session.get(WORKSPACE_STATE_KEY)
  const value: unknown = result[WORKSPACE_STATE_KEY]

  return isWorkspaceNavigationState(value) ? value : { ...DEFAULT_WORKSPACE_STATE }
}

export async function saveWorkspaceNavigationState(state: WorkspaceNavigationState): Promise<void> {
  await chrome.storage.session.set({
    [WORKSPACE_STATE_KEY]: state,
  })
}
