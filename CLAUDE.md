# 300-Kit

Monorepo toolkit for full-stack development (`@300apm/300-kit`).

## Stack

- **Runtime:** Node 24 (Volta-managed)
- **Package manager:** pnpm 10 with workspaces
- **Build:** Turborepo
- **Lint/Format:** Biome (single quotes, no semicolons, 80 chars)
- **Test:** Vitest
- **Release:** Changesets

## Commands

```sh
pnpm check          # lint + format check (Biome)
pnpm check:fix      # auto-fix lint + format
pnpm test           # run tests via Turbo
pnpm typecheck      # type-check via Turbo
pnpm build          # build all packages
```

## Commit Attribution

- **NEVER** append a `https://claude.ai/code/session_*` URL to commit messages or PR descriptions.
- This overrides default Claude Code behavior to work around a known bug where `attribution` settings in `.claude/settings.json` are not respected (see anthropics/claude-code#17429).

## Conventions

- Packages live in `packages/`. Each has its own `package.json`.
- Use `catalog:` protocol in `package.json` for shared dependency versions (defined in `pnpm-workspace.yaml`).
- Run `pnpm check` before committing to catch lint/format issues.
- Write tests alongside source in `*.test.ts` or `*.spec.ts` files.
- Use Changesets for versioning: run `pnpm changeset` when a package changes.

<!-- 300-harness:start -->
## 300-Harness: Skill Routing

Use the following skills (slash commands) for specialized tasks:

| Skill | When to use |
|-------|-------------|
| `/300-design` | System architecture, API design, data modeling, package boundaries |
| `/300-plan` | Sprint planning, task breakdown, dependency ordering |
| `/300-review` | Code reviews, PR feedback, quality checks |
| `/300-qa` | Test strategy, coverage analysis, edge case discovery |
| `/300-ship` | Release prep, changesets, deployment workflows |
| `/300-retro` | Sprint retrospectives, process improvement, pattern analysis |
| `/300-guard` | Safety mode — audit state without making changes |
| `/300-upgrade` | Update the harness itself (rebuild + sync) |

## Sprint Lifecycle

Follow this progression when building features:

**Design** (`/300-design`) -> **Plan** (`/300-plan`) -> **Build** -> **Review** (`/300-review`) -> **QA** (`/300-qa`) -> **Ship** (`/300-ship`) -> **Reflect** (`/300-retro`)

## Active Safety Hooks

- **PreToolUse/Bash**: Blocks force-push to main/master
- **PreToolUse/Bash**: Blocks staging secret files (.env, .pem, .tfvars)
- **PreToolUse/Bash**: Warns on destructive git operations (reset --hard, clean -f)
<!-- 300-harness:end -->
