# 300-Harness Documentation

The 300-harness is the AI-agent configuration layer for 300-kit. It manages
the skills, safety hooks, and configuration files that shape how Claude Code
and Codex behave inside this monorepo and any project that depends on it.

## Table of Contents

| Document | What it covers |
|----------|---------------|
| [Architecture](./architecture.md) | How the harness is built, dual-mode operation, file layout |
| [Skills](./skills.md) | Every skill, its persona, when to use it, exact behavior |
| [Lifecycle](./lifecycle.md) | The sprint lifecycle and how skills chain together |
| [Safety Hooks](./safety-hooks.md) | What the hooks block, what they warn, how they work |
| [CLI Reference](./cli.md) | `300-harness update` and `300-harness status` in detail |
| [Consumer Guide](./consumer-guide.md) | Using the harness in a project that depends on 300-kit |
| [Scope](./scope.md) | What the harness does, and what it consciously does not do |

## Quick Start

```sh
# In the 300-kit monorepo:
pnpm --filter @300apm/core-harness build
pnpm harness:update
pnpm harness:status

# Then use skills as slash commands in Claude Code:
# /300-design, /300-plan, /300-review, /300-qa, /300-ship, /300-retro, /300-guard, /300-upgrade
```

## One-Sentence Summary

The harness turns Claude Code from a generic assistant into a team of
specialized roles (architect, reviewer, QA lead, release engineer, etc.) that
follow a structured sprint lifecycle, enforced by safety hooks that prevent
dangerous operations.
