export function generateClaudeMdSection(): string {
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

## Sprint Lifecycle

Follow this progression when building features:

**Design** (\`/300-design\`) -> **Plan** (\`/300-plan\`) -> **Build** -> **Review** (\`/300-review\`) -> **QA** (\`/300-qa\`) -> **Ship** (\`/300-ship\`) -> **Reflect** (\`/300-retro\`)

## Active Safety Hooks

- **PreToolUse/Bash**: Blocks force-push to main/master
- **PreToolUse/Bash**: Blocks staging secret files (.env, .pem, .tfvars)
- **PreToolUse/Bash**: Warns on destructive git operations (reset --hard, clean -f)`
}
