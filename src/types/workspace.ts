export const WORKSPACE_MODES = ['popup', 'sidebar', 'detached'] as const

export type WorkspaceMode = (typeof WORKSPACE_MODES)[number]

export interface WorkspacePreferences {
  defaultMode: WorkspaceMode
}

export const DEFAULT_WORKSPACE_PREFERENCES: WorkspacePreferences = {
  defaultMode: 'popup',
}

export function isWorkspaceMode(value: unknown): value is WorkspaceMode {
  return WORKSPACE_MODES.some((mode) => mode === value)
}
