import { syncAgentsMd } from '../sync/agents-md.js'
import { syncClaudeMd } from '../sync/claude-md.js'
import { syncCodex } from '../sync/codex.js'
import { syncDesignSystems } from '../sync/design-systems.js'
import { syncSettings } from '../sync/settings.js'
import { syncSkills } from '../sync/skills.js'
import { detectContext } from '../utils/context.js'
import { findProjectRoot } from '../utils/paths.js'

interface UpdateOptions {
  force?: boolean
}

export async function update(options: UpdateOptions = {}): Promise<void> {
  const root = findProjectRoot()
  const context = detectContext()

  console.log(`[300-harness] mode: ${context}`)
  console.log(`[300-harness] root: ${root}`)

  console.log('[300-harness] syncing skills...')
  const result = syncSkills(root, context, options.force)
  if (context === 'monorepo') {
    console.log(`  linked: ${result.linked.join(', ') || '(none)'}`)
  } else {
    console.log(`  copied: ${result.copied.join(', ') || '(none)'}`)
    if (result.skipped.length > 0) {
      console.log(`  skipped (user-owned): ${result.skipped.join(', ')}`)
    }
  }
  if (result.removed.length > 0) {
    console.log(`  removed (stale): ${result.removed.join(', ')}`)
  }

  console.log('[300-harness] syncing design systems...')
  const dsResult = syncDesignSystems(root, context, options.force)
  if (context === 'monorepo') {
    console.log(`  linked: ${dsResult.linked.length} design systems`)
  } else {
    console.log(`  copied: ${dsResult.copied.length} design systems`)
    if (dsResult.skipped.length > 0) {
      console.log(
        `  skipped (user-owned): ${dsResult.skipped.length} design systems`,
      )
    }
  }
  if (dsResult.removed.length > 0) {
    console.log(`  removed (stale): ${dsResult.removed.join(', ')}`)
  }

  console.log('[300-harness] syncing settings.json hooks...')
  syncSettings(root)

  console.log('[300-harness] syncing CLAUDE.md...')
  syncClaudeMd(root)

  console.log('[300-harness] syncing AGENTS.md...')
  syncAgentsMd(root)

  console.log('[300-harness] syncing .codex/skills...')
  syncCodex(root)

  console.log('[300-harness] update complete.')
}
