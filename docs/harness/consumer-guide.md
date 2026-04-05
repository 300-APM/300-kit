# Consumer Guide

This document explains how to use `@300apm/core-harness` in a project that
depends on 300-kit — i.e., a project where the harness is installed from npm
rather than being part of the monorepo.

## Installation

```sh
pnpm add -D @300apm/core-harness
```

## Initial Setup

After installing, bootstrap the harness:

```sh
npx 300-harness update
```

This creates:

- `.claude/skills/300-*.md` — Copied skill files (8 files).
- `.claude/settings.json` — Safety hooks merged in.
- `CLAUDE.md` — Harness section appended (or inserted between markers if they
  already exist).
- `AGENTS.md` — Harness section appended.
- `.codex/skills` — Symlink to `../.claude/skills`.

## Keeping Up to Date

When you update `@300apm/core-harness` to a new version:

```sh
pnpm update @300apm/core-harness
npx 300-harness update
```

The update command will overwrite skill files that still have the harness
version stamp, and skip any you have customized.

### Optional: Automate with a `prepare` Script

Add to your project's `package.json`:

```json
{
  "scripts": {
    "prepare": "300-harness update"
  }
}
```

This runs the harness update after every `pnpm install`, keeping skills and
hooks in sync automatically.

## Customizing Skills

Every skill file copied to `.claude/skills/` has a version stamp on the first
line:

```markdown
<!-- @300-harness v0.0.1 -->
# /300-review — Code Review
...
```

### To customize a skill:

1. Open `.claude/skills/300-review.md`.
2. Remove the `<!-- @300-harness v... -->` line.
3. Edit the skill content to match your project's needs.

The next `300-harness update` will skip this file because it no longer has the
version stamp. Your customization is preserved.

### To restore a skill to the default:

Delete the customized file and re-run:

```sh
rm .claude/skills/300-review.md
npx 300-harness update
```

Or use `--force` to overwrite all skills:

```sh
npx 300-harness update --force
```

**Warning:** `--force` overwrites all skill files, including customized ones.

## Checking Status

```sh
npx 300-harness status
```

Output in consumer mode:

```
[300-harness] mode: consumer
[300-harness] root: /path/to/your-project

Skills (8 defined):
  [DEFAULT]  300-design.md
  [DEFAULT]  300-guard.md
  [CUSTOM]   300-review.md        <-- you customized this one
  [DEFAULT]  300-plan.md
  ...

Settings: 3 harness hooks, 1 user hooks

CLAUDE.md: harness section present
AGENTS.md: harness section present
Codex:     skills -> ../.claude/skills
```

`[DEFAULT]` means the file is harness-owned (has version stamp).
`[CUSTOM]` means you have customized it (no version stamp).

## Adding Project-Specific Skills

You can add your own skills alongside the harness skills:

```sh
# Create a custom skill
cat > .claude/skills/project-deploy.md << 'EOF'
# /project-deploy — Deployment

## Persona
You are a deployment specialist for this specific project.

## Behavior
1. Run the deployment script...
EOF
```

Custom skills that do not start with `300-` are completely ignored by the
harness. They will never be modified or deleted by `300-harness update`.

## Adding Custom Hooks

Add hooks directly to `.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hook_command": "your custom hook here"
      }
    ]
  }
}
```

The harness only manages hooks containing `# @300-harness` in their
`hook_command`. Your custom hooks are preserved across updates.

## Git Tracking

Recommended `.gitignore` additions:

```gitignore
# Track customized skills and settings
# (these are project-specific configuration)
!.claude/settings.json
!.claude/skills/
```

The harness-generated files should be committed to your repository so that
team members and CI environments have the correct configuration without
running `300-harness update`.

## Differences from Monorepo Mode

| Behavior | Monorepo | Consumer |
|----------|----------|----------|
| Skills deployment | Symlinks (hot-reload) | File copies |
| Skill editing | Edit source in `packages/core-harness/skills/` | Edit copies in `.claude/skills/` |
| Override protection | N/A (symlinks always point to source) | Version stamp check |
| `--force` flag | No effect | Overwrites user-customized skills |
| Stale cleanup | Removes orphaned symlinks | Removes orphaned harness-stamped files |
