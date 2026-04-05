import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  readlinkSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs'
import { relative, resolve } from 'node:path'
import type { HarnessContext } from '../utils/context.js'
import { getSkillsSource, getSkillsTarget } from '../utils/paths.js'

const SKILL_PREFIX = '300-'
const VERSION_STAMP_RE = /^<!-- @300-harness v[\d.]+ -->\n/

function getVersion(): string {
  const pkg = JSON.parse(
    readFileSync(resolve(getSkillsSource(), '..', 'package.json'), 'utf-8'),
  ) as { version: string }
  return pkg.version
}

function stampContent(content: string, version: string): string {
  return `<!-- @300-harness v${version} -->\n${content}`
}

function isUserOwned(filePath: string): boolean {
  if (!existsSync(filePath)) return false
  const content = readFileSync(filePath, 'utf-8')
  return !VERSION_STAMP_RE.test(content)
}

export function syncSkills(
  root: string,
  context: HarnessContext,
  force = false,
): {
  linked: string[]
  copied: string[]
  skipped: string[]
  removed: string[]
} {
  const source = getSkillsSource()
  const target = getSkillsTarget(root)
  const result = {
    linked: [] as string[],
    copied: [] as string[],
    skipped: [] as string[],
    removed: [] as string[],
  }

  if (!existsSync(target)) {
    mkdirSync(target, { recursive: true })
  }

  const sourceSkills = readdirSync(source).filter(
    (f) => f.startsWith(SKILL_PREFIX) && f.endsWith('.md'),
  )

  const sourceNames = new Set(sourceSkills)

  for (const skill of sourceSkills) {
    const targetPath = resolve(target, skill)
    const sourcePath = resolve(source, skill)

    if (context === 'monorepo') {
      const relPath = relative(target, sourcePath)

      if (existsSync(targetPath)) {
        try {
          const currentLink = readlinkSync(targetPath)
          if (currentLink === relPath) {
            result.linked.push(skill)
            continue
          }
        } catch {
          // not a symlink
        }
        unlinkSync(targetPath)
      }

      symlinkSync(relPath, targetPath)
      result.linked.push(skill)
    } else {
      if (!force && isUserOwned(targetPath)) {
        result.skipped.push(skill)
        continue
      }

      const content = readFileSync(sourcePath, 'utf-8')
      const stamped = stampContent(content, getVersion())
      writeFileSync(targetPath, stamped)
      result.copied.push(skill)
    }
  }

  const existing = readdirSync(target).filter(
    (f) => f.startsWith(SKILL_PREFIX) && f.endsWith('.md'),
  )
  for (const file of existing) {
    if (!sourceNames.has(file)) {
      const filePath = resolve(target, file)
      if (context === 'monorepo') {
        try {
          readlinkSync(filePath)
          unlinkSync(filePath)
          result.removed.push(file)
        } catch {
          // not a symlink (user file), leave it
        }
      } else {
        if (!isUserOwned(filePath)) {
          unlinkSync(filePath)
          result.removed.push(file)
        }
      }
    }
  }

  return result
}
