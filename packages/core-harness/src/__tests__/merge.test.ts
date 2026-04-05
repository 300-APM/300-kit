import { describe, expect, it } from 'vitest'
import {
  type HookEntry,
  isHarnessHook,
  mergeHooks,
  type SettingsJson,
} from '../utils/merge.js'

const harnessHook: HookEntry = {
  matcher: 'Bash',
  hook_command: 'echo "test # @300-harness"',
}

const userHook: HookEntry = {
  matcher: 'Bash',
  hook_command: 'echo "user hook"',
}

describe('isHarnessHook', () => {
  it('identifies harness hooks by marker', () => {
    expect(isHarnessHook(harnessHook)).toBe(true)
  })

  it('returns false for user hooks', () => {
    expect(isHarnessHook(userHook)).toBe(false)
  })
})

describe('mergeHooks', () => {
  it('adds harness hooks to empty settings', () => {
    const existing: SettingsJson = {}
    const result = mergeHooks(existing, {
      PreToolUse: [harnessHook],
    })
    expect(result.hooks?.PreToolUse).toEqual([harnessHook])
  })

  it('preserves user hooks while adding harness hooks', () => {
    const existing: SettingsJson = {
      hooks: { PreToolUse: [userHook] },
    }
    const result = mergeHooks(existing, {
      PreToolUse: [harnessHook],
    })
    expect(result.hooks?.PreToolUse).toEqual([userHook, harnessHook])
  })

  it('replaces old harness hooks with new ones', () => {
    const oldHarness: HookEntry = {
      matcher: 'Bash',
      hook_command: 'echo "old # @300-harness"',
    }
    const existing: SettingsJson = {
      hooks: { PreToolUse: [userHook, oldHarness] },
    }
    const result = mergeHooks(existing, {
      PreToolUse: [harnessHook],
    })
    expect(result.hooks?.PreToolUse).toEqual([userHook, harnessHook])
  })

  it('preserves non-hook settings', () => {
    const existing: SettingsJson = {
      attribution: { commit: '', pr: '' },
    }
    const result = mergeHooks(existing, {
      PreToolUse: [harnessHook],
    })
    expect(result.attribution).toEqual({ commit: '', pr: '' })
  })
})
