import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { findProjectRoot } from './paths.js'

export type HarnessContext = 'monorepo' | 'consumer'

export function detectContext(): HarnessContext {
  const root = findProjectRoot()
  const hasWorkspaceConfig = existsSync(resolve(root, 'pnpm-workspace.yaml'))
  const hasCoreHarness = existsSync(
    resolve(root, 'packages', 'core-harness', 'skills'),
  )

  if (hasWorkspaceConfig && hasCoreHarness) {
    return 'monorepo'
  }

  return 'consumer'
}
