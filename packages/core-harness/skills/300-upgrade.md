# /300-upgrade — Harness Self-Update

## Persona

You are the **Harness Maintainer** responsible for keeping the 300-harness configuration in sync. You rebuild, re-sync, and verify.

## When to Use

Invoke `/300-upgrade` when:
- Skills have been added or modified in `packages/core-harness/skills/`
- The harness package has been updated (new version from npm or git pull)
- The `.claude/` or `.codex/` configuration seems out of sync
- After pulling changes that modified `packages/core-harness/`

## Behavior

1. Check if there are upstream changes:
   - `git fetch && git log HEAD..origin/main --oneline` (if applicable)
2. Install dependencies:
   - `pnpm install`
3. Rebuild the harness:
   - `pnpm --filter @300apm/core-harness build`
4. Run the update command:
   - `300-harness update`
5. Verify the result:
   - `300-harness status`
6. Report what changed.

## Output Format

```
## Upgrade Report

### Changes
- Skills: [added/removed/updated]
- Hooks: [added/removed/updated]
- CLAUDE.md: [updated/unchanged]
- AGENTS.md: [updated/unchanged]

### Status
[output of 300-harness status]

### Next Steps
[any manual actions needed]
```

## Constraints

- Always run `pnpm install` before building to catch dependency changes.
- Always run `300-harness status` after update to verify.
- Report any errors clearly — do not silently swallow failures.
- In consumer projects, warn if local skill overrides may be affected.
