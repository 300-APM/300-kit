import { existsSync, readdirSync, readFileSync, readlinkSync } from 'node:fs'
import { resolve } from 'node:path'
import { detectContext } from '../utils/context.js'
import { hasSentinelSection } from '../utils/markdown.js'
import { isHarnessHook, type SettingsJson } from '../utils/merge.js'
import {
  findProjectRoot,
  getClaudeDir,
  getSkillsSource,
  getSkillsTarget,
} from '../utils/paths.js'

export async function status(): Promise<void> {
  const root = findProjectRoot()
  const context = detectContext()

  console.log(`[300-harness] mode: ${context}`)
  console.log(`[300-harness] root: ${root}`)
  console.log()

  // Skills status
  const source = getSkillsSource()
  const target = getSkillsTarget(root)
  const sourceSkills = existsSync(source)
    ? readdirSync(source).filter(
        (f) => f.startsWith('300-') && f.endsWith('.md'),
      )
    : []

  console.log(`Skills (${sourceSkills.length} defined):`)
  for (const skill of sourceSkills) {
    const targetPath = resolve(target, skill)
    if (!existsSync(targetPath)) {
      console.log(`  [MISSING] ${skill}`)
      continue
    }

    if (context === 'monorepo') {
      try {
        const link = readlinkSync(targetPath)
        console.log(`  [LINKED]  ${skill} -> ${link}`)
      } catch {
        console.log(`  [FILE]    ${skill} (not a symlink)`)
      }
    } else {
      const content = readFileSync(targetPath, 'utf-8')
      const isDefault = /^<!-- @300-harness v[\d.]+ -->/.test(content)
      console.log(`  [${isDefault ? 'DEFAULT' : 'CUSTOM'}]  ${skill}`)
    }
  }

  // Settings status
  console.log()
  const settingsPath = resolve(getClaudeDir(root), 'settings.json')
  if (existsSync(settingsPath)) {
    const settings = JSON.parse(
      readFileSync(settingsPath, 'utf-8'),
    ) as SettingsJson
    const allHooks = Object.values(settings.hooks ?? {}).flat()
    const harnessCount = allHooks.filter(isHarnessHook).length
    const userCount = allHooks.length - harnessCount
    console.log(
      `Settings: ${harnessCount} harness hooks, ${userCount} user hooks`,
    )
  } else {
    console.log('Settings: [MISSING] .claude/settings.json')
  }

  // CLAUDE.md status
  console.log()
  const claudeMdPath = resolve(root, 'CLAUDE.md')
  if (existsSync(claudeMdPath)) {
    const content = readFileSync(claudeMdPath, 'utf-8')
    const has = hasSentinelSection(content, '300-harness')
    console.log(
      `CLAUDE.md: ${has ? 'harness section present' : '[MISSING] harness section'}`,
    )
  } else {
    console.log('CLAUDE.md: [MISSING]')
  }

  // AGENTS.md status
  const agentsMdPath = resolve(root, 'AGENTS.md')
  if (existsSync(agentsMdPath)) {
    const content = readFileSync(agentsMdPath, 'utf-8')
    const has = hasSentinelSection(content, '300-harness')
    console.log(
      `AGENTS.md: ${has ? 'harness section present' : '[MISSING] harness section'}`,
    )
  } else {
    console.log('AGENTS.md: [MISSING]')
  }

  // Codex status
  const codexSkills = resolve(root, '.codex', 'skills')
  if (existsSync(codexSkills)) {
    try {
      const link = readlinkSync(codexSkills)
      console.log(`Codex:     skills -> ${link}`)
    } catch {
      console.log('Codex:     skills exists (not a symlink)')
    }
  } else {
    console.log('Codex:     [MISSING] .codex/skills')
  }
}
