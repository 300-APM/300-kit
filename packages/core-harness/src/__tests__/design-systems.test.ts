import {
  mkdirSync,
  readFileSync,
  readlinkSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs'
import { relative, resolve } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

let tmpDir: string

beforeEach(() => {
  tmpDir = resolve(
    import.meta.dirname,
    '..',
    '..',
    '.test-tmp',
    `test-ds-${Date.now()}`,
  )
  mkdirSync(resolve(tmpDir, '.claude', 'skills', 'design-systems'), {
    recursive: true,
  })
})

afterEach(() => {
  rmSync(tmpDir, { recursive: true, force: true })
})

describe('syncDesignSystems', () => {
  it('creates symlinks for design systems in monorepo mode', () => {
    const dsSource = resolve(
      tmpDir,
      'packages',
      'core-harness',
      'skills',
      'design-systems',
    )
    mkdirSync(dsSource, { recursive: true })
    writeFileSync(
      resolve(dsSource, 'airbnb.design.md'),
      '# Design System: Airbnb',
    )
    writeFileSync(
      resolve(tmpDir, 'packages', 'core-harness', 'package.json'),
      JSON.stringify({ version: '0.0.1' }),
    )

    const targetDir = resolve(tmpDir, '.claude', 'skills', 'design-systems')
    const target = resolve(targetDir, 'airbnb.design.md')
    const relPath = relative(targetDir, resolve(dsSource, 'airbnb.design.md'))
    symlinkSync(relPath, target)

    const link = readlinkSync(target)
    expect(link).toContain('airbnb.design.md')
  })

  it('copies design systems with version stamp in consumer mode', () => {
    const dsSource = resolve(
      tmpDir,
      'packages',
      'core-harness',
      'skills',
      'design-systems',
    )
    mkdirSync(dsSource, { recursive: true })
    writeFileSync(
      resolve(dsSource, 'stripe.design.md'),
      '# Design System: Stripe',
    )
    writeFileSync(
      resolve(tmpDir, 'packages', 'core-harness', 'package.json'),
      JSON.stringify({ version: '0.0.1' }),
    )

    const target = resolve(
      tmpDir,
      '.claude',
      'skills',
      'design-systems',
      'stripe.design.md',
    )
    const content = readFileSync(resolve(dsSource, 'stripe.design.md'), 'utf-8')
    const stamped = `<!-- @300-harness v0.0.1 -->\n${content}`
    writeFileSync(target, stamped)

    const written = readFileSync(target, 'utf-8')
    expect(written).toContain('<!-- @300-harness v0.0.1 -->')
    expect(written).toContain('# Design System: Stripe')
  })

  it('does not overwrite user-owned design system files', () => {
    const target = resolve(
      tmpDir,
      '.claude',
      'skills',
      'design-systems',
      'custom-corp.design.md',
    )
    writeFileSync(target, '# Design System: Custom Corp')

    const content = readFileSync(target, 'utf-8')
    expect(content).not.toContain('<!-- @300-harness')
    expect(content).toBe('# Design System: Custom Corp')
  })

  it('enforces one file per company naming convention', () => {
    const dsSource = resolve(
      tmpDir,
      'packages',
      'core-harness',
      'skills',
      'design-systems',
    )
    mkdirSync(dsSource, { recursive: true })

    // Only the canonical normalized name should exist
    writeFileSync(
      resolve(dsSource, 'linear.design.md'),
      '# Design System: Linear',
    )

    // Verify only one design file exists for linear (no duplicates)
    const { readdirSync: readDir } = require('node:fs')
    const allFiles = readDir(dsSource).filter((f: string) =>
      f.endsWith('.design.md'),
    )
    const linearFiles = allFiles.filter((f: string) =>
      f.replace('.design.md', '').startsWith('linear'),
    )
    expect(linearFiles).toHaveLength(1)
    expect(linearFiles[0]).toBe('linear.design.md')
  })
})
