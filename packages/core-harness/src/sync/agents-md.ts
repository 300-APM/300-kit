import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { generateAgentsMdSection } from '../templates/agents-md.js'
import { replaceSentinelSection } from '../utils/markdown.js'

const TAG = '300-harness'

export function syncAgentsMd(root: string): void {
  const filePath = resolve(root, 'AGENTS.md')

  let content = ''
  if (existsSync(filePath)) {
    content = readFileSync(filePath, 'utf-8')
  }

  const section = generateAgentsMdSection()
  const updated = replaceSentinelSection(content, TAG, section)
  writeFileSync(filePath, updated)
}
