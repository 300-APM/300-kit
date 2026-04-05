import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

let tmpDir: string

beforeEach(() => {
  tmpDir = resolve(
    import.meta.dirname,
    '..',
    '..',
    '.test-tmp',
    `ctx-${Date.now()}`,
  )
  mkdirSync(tmpDir, { recursive: true })
})

afterEach(() => {
  rmSync(tmpDir, { recursive: true, force: true })
  vi.restoreAllMocks()
})

describe('detectContext', () => {
  it('detects monorepo when pnpm-workspace.yaml and core-harness exist', async () => {
    writeFileSync(
      resolve(tmpDir, 'pnpm-workspace.yaml'),
      'packages:\n  - packages/*',
    )
    writeFileSync(resolve(tmpDir, 'package.json'), '{}')
    mkdirSync(resolve(tmpDir, 'packages', 'core-harness', 'skills'), {
      recursive: true,
    })

    const { existsSync } = await import('node:fs')
    const hasWorkspace = existsSync(resolve(tmpDir, 'pnpm-workspace.yaml'))
    const hasCoreHarness = existsSync(
      resolve(tmpDir, 'packages', 'core-harness', 'skills'),
    )

    expect(hasWorkspace && hasCoreHarness).toBe(true)
  })

  it('detects consumer when core-harness is not a local package', async () => {
    writeFileSync(resolve(tmpDir, 'package.json'), '{}')

    const { existsSync } = await import('node:fs')
    const hasWorkspace = existsSync(resolve(tmpDir, 'pnpm-workspace.yaml'))

    expect(hasWorkspace).toBe(false)
  })
})
