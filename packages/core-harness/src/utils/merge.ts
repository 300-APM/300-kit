const HARNESS_MARKER = '# @300-harness'

export interface HookEntry {
  matcher: string
  hook_command: string
}

export interface SettingsJson {
  attribution?: Record<string, string>
  hooks?: Record<string, HookEntry[]>
  [key: string]: unknown
}

export function isHarnessHook(hook: HookEntry): boolean {
  return hook.hook_command.includes(HARNESS_MARKER)
}

export function mergeHooks(
  existing: SettingsJson,
  harnessHooks: Record<string, HookEntry[]>,
): SettingsJson {
  const result = { ...existing }
  const merged: Record<string, HookEntry[]> = {}

  for (const [event, hooks] of Object.entries(existing.hooks ?? {})) {
    merged[event] = hooks.filter((h) => !isHarnessHook(h))
  }

  for (const [event, hooks] of Object.entries(harnessHooks)) {
    const current = merged[event] ?? []
    merged[event] = [...current, ...hooks]
  }

  result.hooks = merged
  return result
}
