import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { harnessHooks } from '../hooks/definitions.js'
import { mergeHooks, type SettingsJson } from '../utils/merge.js'
import { getClaudeDir } from '../utils/paths.js'

export function syncSettings(root: string): void {
  const claudeDir = getClaudeDir(root)
  const settingsPath = resolve(claudeDir, 'settings.json')

  if (!existsSync(dirname(settingsPath))) {
    mkdirSync(dirname(settingsPath), { recursive: true })
  }

  let existing: SettingsJson = {}
  if (existsSync(settingsPath)) {
    existing = JSON.parse(readFileSync(settingsPath, 'utf-8')) as SettingsJson
  }

  const merged = mergeHooks(existing, harnessHooks)
  writeFileSync(settingsPath, `${JSON.stringify(merged, null, 2)}\n`)
}
