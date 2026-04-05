import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { resolve } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { SettingsJson } from '../utils/merge.js'

let tmpDir: string

beforeEach(() => {
  tmpDir = resolve(
    import.meta.dirname,
    '..',
    '..',
    '.test-tmp',
    `settings-${Date.now()}`,
  )
  mkdirSync(resolve(tmpDir, '.claude'), { recursive: true })
})

afterEach(() => {
  rmSync(tmpDir, { recursive: true, force: true })
})

describe('settings sync logic', () => {
  it('creates settings.json when it does not exist', () => {
    const settingsPath = resolve(tmpDir, '.claude', 'settings.json')
    expect(existsSync(settingsPath)).toBe(false)

    writeFileSync(settingsPath, JSON.stringify({ hooks: {} }, null, 2))
    expect(existsSync(settingsPath)).toBe(true)
  })

  it('preserves existing attribution while adding hooks', () => {
    const settingsPath = resolve(tmpDir, '.claude', 'settings.json')
    const existing: SettingsJson = {
      attribution: { commit: 'abc', pr: 'def' },
    }
    writeFileSync(settingsPath, JSON.stringify(existing, null, 2))

    const parsed = JSON.parse(
      readFileSync(settingsPath, 'utf-8'),
    ) as SettingsJson
    expect(parsed.attribution).toEqual({ commit: 'abc', pr: 'def' })
  })
})
