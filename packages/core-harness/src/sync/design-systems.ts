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
import {
  getDesignSystemsSource,
  getDesignSystemsTarget,
} from '../utils/paths.js'

const DESIGN_SUFFIX = '.design.md'
const VERSION_STAMP_RE = /^<!-- @300-harness v[\d.]+ -->\n/

function getVersion(): string {
  const pkg = JSON.parse(
    readFileSync(
      resolve(getDesignSystemsSource(), '..', '..', 'package.json'),
      'utf-8',
    ),
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

export function listDesignSystems(): string[] {
  const source = getDesignSystemsSource()
  if (!existsSync(source)) return []
  return readdirSync(source)
    .filter((f) => f.endsWith(DESIGN_SUFFIX))
    .map((f) => f.replace(DESIGN_SUFFIX, ''))
    .sort()
}

export function syncDesignSystems(
  root: string,
  context: HarnessContext,
  force = false,
): {
  linked: string[]
  copied: string[]
  skipped: string[]
  removed: string[]
} {
  const source = getDesignSystemsSource()
  const target = getDesignSystemsTarget(root)
  const result = {
    linked: [] as string[],
    copied: [] as string[],
    skipped: [] as string[],
    removed: [] as string[],
  }

  if (!existsSync(source)) return result

  if (!existsSync(target)) {
    mkdirSync(target, { recursive: true })
  }

  const sourceFiles = readdirSync(source).filter((f) =>
    f.endsWith(DESIGN_SUFFIX),
  )
  const sourceNames = new Set(sourceFiles)

  for (const file of sourceFiles) {
    const targetPath = resolve(target, file)
    const sourcePath = resolve(source, file)

    if (context === 'monorepo') {
      const relPath = relative(target, sourcePath)

      if (existsSync(targetPath)) {
        try {
          const currentLink = readlinkSync(targetPath)
          if (currentLink === relPath) {
            result.linked.push(file)
            continue
          }
        } catch {
          // not a symlink
        }
        unlinkSync(targetPath)
      }

      symlinkSync(relPath, targetPath)
      result.linked.push(file)
    } else {
      if (!force && isUserOwned(targetPath)) {
        result.skipped.push(file)
        continue
      }

      const content = readFileSync(sourcePath, 'utf-8')
      const stamped = stampContent(content, getVersion())
      writeFileSync(targetPath, stamped)
      result.copied.push(file)
    }
  }

  // Clean stale entries
  if (existsSync(target)) {
    const existing = readdirSync(target).filter((f) =>
      f.endsWith(DESIGN_SUFFIX),
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
  }

  return result
}
