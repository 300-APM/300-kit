# CLI Reference

The harness CLI is the `300-harness` binary, registered via the `bin` field in
`packages/core-harness/package.json`. In the monorepo, it is invoked via the
root `package.json` scripts:

```sh
pnpm harness:update        # equivalent to: node packages/core-harness/dist/cli.js update
pnpm harness:status        # equivalent to: node packages/core-harness/dist/cli.js status
```

In consumer projects where `@300apm/core-harness` is installed as a dependency,
the binary is available directly:

```sh
npx 300-harness update
npx 300-harness status
```

---

## `300-harness update`

Syncs all harness-managed files from `packages/core-harness/` (or
`node_modules/@300apm/core-harness/`) to the project root.

### Usage

```sh
300-harness update [--force]
```

### What It Does (in order)

1. **Detects context** — Monorepo or consumer mode (see
   [Architecture](./architecture.md#dual-mode-operation)).
2. **Syncs skills** — Creates symlinks (monorepo) or copies files (consumer)
   for all `300-*.md` files from the skills source directory to
   `.claude/skills/`. Removes stale entries.
3. **Syncs settings.json** — Reads `.claude/settings.json`, strips old harness
   hooks (identified by `# @300-harness` marker), inserts current harness
   hooks, preserves all user-added hooks and settings. Creates the file if it
   does not exist.
4. **Syncs CLAUDE.md** — Updates the content between
   `<!-- 300-harness:start -->` and `<!-- 300-harness:end -->` markers with the
   current skill routing table and sprint lifecycle. Appends the section if
   markers do not exist. Preserves all content outside the markers.
5. **Syncs AGENTS.md** — Same sentinel-marker approach with persona
   descriptions.
6. **Syncs .codex/skills** — Verifies the `.codex/skills` symlink points to
   `../.claude/skills`. Creates or recreates it if missing or incorrect.

### Flags

| Flag | Effect |
|------|--------|
| `--force` | In consumer mode, overwrites user-modified skill files (those without the `<!-- @300-harness v... -->` stamp). In monorepo mode, this flag has no effect (symlinks are always recreated). |

### Output

```
[300-harness] mode: monorepo
[300-harness] root: /path/to/project
[300-harness] syncing skills...
  linked: 300-design.md, 300-guard.md, 300-plan.md, ...
[300-harness] syncing settings.json hooks...
[300-harness] syncing CLAUDE.md...
[300-harness] syncing AGENTS.md...
[300-harness] syncing .codex/skills...
[300-harness] update complete.
```

In consumer mode, the skills section shows `copied` instead of `linked`, and
may show `skipped (user-owned)` for customized files.

### Idempotency

Running `update` multiple times produces the same result. Symlinks that already
point to the correct target are left in place. Sentinel-marked sections are
replaced with identical content. Settings hooks are stripped and re-added,
producing the same JSON.

---

## `300-harness status`

Reports the current state of all harness-managed files. Does not modify
anything. Useful for diagnosing sync issues.

### Usage

```sh
300-harness status
```

### Output

```
[300-harness] mode: monorepo
[300-harness] root: /path/to/project

Skills (8 defined):
  [LINKED]  300-design.md -> ../../packages/core-harness/skills/300-design.md
  [LINKED]  300-guard.md -> ../../packages/core-harness/skills/300-guard.md
  ...

Settings: 3 harness hooks, 0 user hooks

CLAUDE.md: harness section present
AGENTS.md: harness section present
Codex:     skills -> ../.claude/skills
```

### Skill Status Labels

| Label | Meaning |
|-------|---------|
| `[LINKED]` | Monorepo mode: symlink exists and points to the correct source. |
| `[FILE]` | Monorepo mode: file exists but is not a symlink (unexpected). |
| `[DEFAULT]` | Consumer mode: file has the `<!-- @300-harness v... -->` stamp (harness-owned). |
| `[CUSTOM]` | Consumer mode: file lacks the stamp (user-owned, will be skipped on update). |
| `[MISSING]` | Skill source exists but no corresponding file in `.claude/skills/`. |

### Settings Status

Shows the count of hooks identified as harness-managed (containing
`# @300-harness`) vs user-added (not containing the marker).

### Markdown Status

Shows whether the `<!-- 300-harness:start/end -->` sentinel markers are present
in CLAUDE.md and AGENTS.md.

### Codex Status

Shows the `.codex/skills` symlink target, or `[MISSING]` if it does not exist.

---

## Exit Codes

| Code | Meaning |
|------|---------|
| `0` | Success |
| `1` | Unknown command or usage error |

Both `update` and `status` currently exit `0` even if individual sync steps
encounter issues (e.g., permission errors). Errors are printed to stderr but
do not halt the process.

---

## Prerequisites

Before running the CLI, the package must be built:

```sh
pnpm --filter @300apm/core-harness build
```

The CLI runs the compiled JavaScript from `dist/cli.js`. Editing TypeScript
source without rebuilding will not be reflected in CLI behavior. (Skill
markdown files do not need a rebuild — they are read at runtime from `skills/`.)
