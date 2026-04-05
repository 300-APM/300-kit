import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { generateClaudeMdSection } from '../templates/claude-md.js'
import { replaceSentinelSection } from '../utils/markdown.js'

const TAG = '300-harness'

export function syncClaudeMd(root: string): void {
  const filePath = resolve(root, 'CLAUDE.md')

  let content = ''
  if (existsSync(filePath)) {
    content = readFileSync(filePath, 'utf-8')
  }

  const section = generateClaudeMdSection()
  const updated = replaceSentinelSection(content, TAG, section)
  writeFileSync(filePath, updated)
}
