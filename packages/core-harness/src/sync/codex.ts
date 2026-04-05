import {
  existsSync,
  mkdirSync,
  readlinkSync,
  symlinkSync,
  unlinkSync,
} from 'node:fs'
import { resolve } from 'node:path'
import { getCodexDir } from '../utils/paths.js'

const CODEX_SKILLS_LINK = '../.claude/skills'

export function syncCodex(root: string): void {
  const codexDir = getCodexDir(root)
  const skillsLink = resolve(codexDir, 'skills')

  if (!existsSync(codexDir)) {
    mkdirSync(codexDir, { recursive: true })
  }

  if (existsSync(skillsLink)) {
    try {
      const target = readlinkSync(skillsLink)
      if (target === CODEX_SKILLS_LINK) {
        return
      }
      unlinkSync(skillsLink)
    } catch {
      // exists but not a symlink — leave it
      return
    }
  }

  symlinkSync(CODEX_SKILLS_LINK, skillsLink)
}
