import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export function findProjectRoot(from: string = process.cwd()): string {
  let dir = resolve(from)
  while (true) {
    if (existsSync(resolve(dir, 'package.json'))) {
      const parent = dirname(dir)
      if (existsSync(resolve(dir, 'pnpm-workspace.yaml')) || parent === dir) {
        return dir
      }
      if (existsSync(resolve(parent, 'pnpm-workspace.yaml'))) {
        return parent
      }
    }
    const parent = dirname(dir)
    if (parent === dir) {
      return from
    }
    dir = parent
  }
}

export function getSkillsSource(): string {
  return resolve(__dirname, '..', '..', 'skills')
}

export function getClaudeDir(root: string): string {
  return resolve(root, '.claude')
}

export function getSkillsTarget(root: string): string {
  return resolve(root, '.claude', 'skills')
}

export function getDesignSystemsSource(): string {
  return resolve(__dirname, '..', '..', 'skills', 'design-systems')
}

export function getDesignSystemsTarget(root: string): string {
  return resolve(root, '.claude', 'skills', 'design-systems')
}

export function getCodexDir(root: string): string {
  return resolve(root, '.codex')
}
