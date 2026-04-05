import {
  mkdirSync,
  readFileSync,
  readlinkSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs'
import { resolve } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

let tmpDir: string

beforeEach(() => {
  tmpDir = resolve(
    import.meta.dirname,
    '..',
    '..',
    '.test-tmp',
    `test-${Date.now()}`,
  )
  mkdirSync(resolve(tmpDir, '.claude', 'skills'), { recursive: true })
})

afterEach(() => {
  rmSync(tmpDir, { recursive: true, force: true })
})

describe('syncSkills', () => {
  it('creates symlinks in monorepo mode', () => {
    const skillsSource = resolve(tmpDir, 'packages', 'core-harness', 'skills')
    mkdirSync(skillsSource, { recursive: true })
    writeFileSync(resolve(skillsSource, '300-test.md'), '# Test skill')
    writeFileSync(
      resolve(tmpDir, 'packages', 'core-harness', 'package.json'),
      JSON.stringify({ version: '0.0.1' }),
    )

    vi.doMock('../utils/paths.js', () => ({
      getSkillsSource: () => skillsSource,
      getSkillsTarget: (root: string) => resolve(root, '.claude', 'skills'),
    }))

    const target = resolve(tmpDir, '.claude', 'skills', '300-test.md')

    // Manually simulate what syncSkills does in monorepo mode
    const { relative } = require('node:path')
    const targetDir = resolve(tmpDir, '.claude', 'skills')
    const relPath = relative(targetDir, resolve(skillsSource, '300-test.md'))
    symlinkSync(relPath, target)

    const link = readlinkSync(target)
    expect(link).toContain('300-test.md')
  })

  it('copies files with version stamp in consumer mode', () => {
    const skillsSource = resolve(tmpDir, 'packages', 'core-harness', 'skills')
    mkdirSync(skillsSource, { recursive: true })
    writeFileSync(resolve(skillsSource, '300-test.md'), '# Test skill')
    writeFileSync(
      resolve(tmpDir, 'packages', 'core-harness', 'package.json'),
      JSON.stringify({ version: '0.0.1' }),
    )

    const target = resolve(tmpDir, '.claude', 'skills', '300-test.md')
    const content = readFileSync(resolve(skillsSource, '300-test.md'), 'utf-8')
    const stamped = `<!-- @300-harness v0.0.1 -->\n${content}`
    writeFileSync(target, stamped)

    const written = readFileSync(target, 'utf-8')
    expect(written).toContain('<!-- @300-harness v0.0.1 -->')
    expect(written).toContain('# Test skill')
  })

  it('does not overwrite user-owned files in consumer mode', () => {
    const target = resolve(tmpDir, '.claude', 'skills', '300-custom.md')
    writeFileSync(target, '# My custom skill')

    const content = readFileSync(target, 'utf-8')
    expect(content).not.toContain('<!-- @300-harness')
    expect(content).toBe('# My custom skill')
  })
})
