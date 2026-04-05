import { listDesignSystems } from '../sync/design-systems.js'

function generateDesignSystemTable(): string {
  const systems = listDesignSystems()
  if (systems.length === 0) return ''

  const rows = systems
    .map((name) => {
      const display = name.charAt(0).toUpperCase() + name.slice(1)
      return `| "in the style of **${display}**" | \`design-systems/${name}.design.md\` |`
    })
    .join('\n')

  return `

## Design System Skills (auto-triggered)

When the user references a company's design style (e.g., "in the style of Airbnb", "make it look like Stripe", "use the Vercel design system"), read the corresponding design system file from \`.claude/skills/design-systems/{company}.design.md\` and follow its visual specifications exactly.

Use \`/300-design-sync\` to add, update, or audit design systems against the upstream [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) collection.

| Trigger phrase | Skill file |
|----------------|------------|
${rows}

> **${systems.length} design systems available.** One per company — no duplicates.`
}

export function generateClaudeMdSection(): string {
  const designTable = generateDesignSystemTable()

  return `## 300-Harness: Skill Routing

Use the following skills (slash commands) for specialized tasks:

| Skill | When to use |
|-------|-------------|
| \`/300-design\` | System architecture, API design, data modeling, package boundaries |
| \`/300-plan\` | Sprint planning, task breakdown, dependency ordering |
| \`/300-review\` | Code reviews, PR feedback, quality checks |
| \`/300-qa\` | Test strategy, coverage analysis, edge case discovery |
| \`/300-ship\` | Release prep, changesets, deployment workflows |
| \`/300-retro\` | Sprint retrospectives, process improvement, pattern analysis |
| \`/300-guard\` | Safety mode — audit state without making changes |
| \`/300-upgrade\` | Update the harness itself (rebuild + sync) |
| \`/300-design-sync\` | Sync design systems from awesome-design-md upstream |

## Sprint Lifecycle

Follow this progression when building features:

**Design** (\`/300-design\`) -> **Plan** (\`/300-plan\`) -> **Build** -> **Review** (\`/300-review\`) -> **QA** (\`/300-qa\`) -> **Ship** (\`/300-ship\`) -> **Reflect** (\`/300-retro\`)

## Active Safety Hooks

- **PreToolUse/Bash**: Blocks force-push to main/master
- **PreToolUse/Bash**: Blocks staging secret files (.env, .pem, .tfvars)
- **PreToolUse/Bash**: Warns on destructive git operations (reset --hard, clean -f)${designTable}`
}
