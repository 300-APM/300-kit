# Scope

This document defines what the harness does, what it does not do, and why
the boundary is where it is.

---

## What the Harness Does

### 1. Manages AI Skill Definitions

The harness owns the 8 skill markdown files that define specialized personas
for Claude Code. Each skill is a structured document (persona, behavior,
constraints, output format) that activates when invoked as a slash command.

**Files:** `packages/core-harness/skills/300-*.md`
→ deployed to `.claude/skills/300-*.md`

### 2. Deploys Skills to Claude Code and Codex

The harness syncs skill files from the package to the locations where Claude
Code (`.claude/skills/`) and Codex (`.codex/skills/`) read them. In the
monorepo, this is via symlinks. In consumer projects, via file copies.

### 3. Installs Safety Hooks

The harness writes three `PreToolUse` hooks to `.claude/settings.json`:
- Block force-push to main/master.
- Block staging of common secret file types.
- Warn on destructive git operations.

### 4. Maintains Configuration Sections in Shared Markdown Files

The harness appends/updates a clearly-delimited section in `CLAUDE.md` (skill
routing table) and `AGENTS.md` (persona descriptions). Content outside the
sentinel markers is never touched.

### 5. Provides a CLI for Syncing

`300-harness update` and `300-harness status` are the two commands. Update
syncs all managed files. Status reports the current state.

### 6. Supports Dual-Mode Operation

The same package works inside the 300-kit monorepo (symlinks, hot-reload) and
in downstream consumer projects (copies, version stamps, override protection).

---

## What the Harness Does Not Do

Each of these is a conscious decision, not an oversight. They are documented
here so that future contributors understand the boundary and do not accidentally
expand the harness beyond its intended scope.

### Does Not Execute Skills

The harness deploys skill files. It does not interpret, run, or orchestrate
them. Claude Code reads the markdown files and follows the persona instructions
on its own. The harness has no runtime presence during a Claude Code session —
it only runs at setup/sync time.

**Why:** Skills are consumed by the Claude Code runtime, not by our code. The
harness is a file deployment tool, not an AI orchestration framework.

### Does Not Enforce the Sprint Lifecycle

The lifecycle (Design → Plan → Build → Review → QA → Ship → Reflect) is
documented and recommended, but not enforced. There is no gate that prevents
invoking `/300-ship` before `/300-review`. The skills are independent — any
can be invoked at any time in any order.

**Why:** Rigid enforcement would be counterproductive. Hotfixes need to skip
Design. Refactoring may skip QA. The lifecycle is a guide for common feature
work, not a mandatory process.

### Does Not Validate Hook Effectiveness

The safety hooks use regex text matching on command strings. The harness does
not test whether the hooks actually catch the commands they target, does not
handle command obfuscation or aliasing, and does not verify that Claude Code
honors the hook exit codes.

**Why:** Hooks are best-effort safety nets, not security controls. They catch
common mistakes during normal AI-assisted development. Robust command blocking
requires branch protection rules, CI checks, and `.gitignore` configuration —
which are outside the harness scope.

### Does Not Manage Source Code

The harness never reads, writes, or modifies TypeScript, JavaScript, or any
other source code file. It only manages configuration files: markdown skills,
JSON settings, and symlinks.

**Why:** Source code management is Claude Code's job. The harness manages the
configuration that shapes Claude Code's behavior. Mixing the two would create a
confusing layering violation.

### Does Not Manage `package.json` or `tsconfig.json`

The harness does not modify any `package.json`, `tsconfig.json`, `turbo.json`,
`biome.json`, or other project configuration file. The only root-level file
modifications are to `CLAUDE.md`, `AGENTS.md`, and `.claude/settings.json`.

**Why:** These files have complex structures, are heavily customized per
project, and are critical to the build pipeline. Modifying them from a harness
sync would be fragile and surprising.

### Does Not Auto-Update on Install

There is no `postinstall` hook. The harness requires explicit invocation:
`300-harness update`. Consumer projects can opt into automatic updates by
adding a `prepare` script, but this is not the default.

**Why:** Implicit post-install behavior is surprising, can be skipped by
`--ignore-scripts`, and slows down installs. Explicit invocation is predictable
and debuggable.

### Does Not Watch for File Changes

There is no file watcher or daemon. The harness runs once when you invoke it
and exits. Skills are hot-reloaded via symlinks in monorepo mode (which is
instant and requires no watcher), and via manual `update` in consumer mode.

**Why:** A watcher adds process management complexity for minimal benefit.
Symlinks already provide instant hot-reload for the primary development case
(monorepo). Consumer projects rarely edit skills frequently enough to need a
watcher.

### Does Not Manage Git Hooks

The harness manages Claude Code hooks (`.claude/settings.json`), not Git hooks
(`.husky/`, `.git/hooks/`). It does not set up pre-commit hooks, pre-push
hooks, or any other Git hook.

**Why:** Git hooks are a separate concern with established tools (Husky,
lint-staged). The harness safety hooks operate at the Claude Code tool level,
which is a different interception point than Git hooks. Mixing the two would
create confusing overlap.

### Does Not Provide a Plugin or Extension System

There is no mechanism for third-party skill packs, hook plugins, or extension
points. Skills are files in a directory. Hooks are entries in a JSON file. To
add more, edit the source.

**Why:** Extension systems add indirection and complexity. At the current scale
(8 skills, 3 hooks), the direct approach is simpler. If the harness grows to
dozens of skills, a plugin system may be warranted. Until then, direct editing
is sufficient.

### Does Not Persist State or History

The harness does not track which skills have been invoked, how often, in what
order, or with what results. There is no database, no log file, no analytics.
The `status` command reads the current filesystem state — it does not know
what happened previously.

**Why:** State tracking would require either a persistent process or a log file
that grows indefinitely. The harness is a stateless sync tool. Retrospective
analysis (via `/300-retro`) uses git history as its state source, which is
already persistent and queryable.

### Does Not Generate Code Scaffolds

The harness does not generate boilerplate code, project templates, module
scaffolds, or any code artifacts. It generates configuration files only.

**Why:** Code generation is a different tool category (Yeoman, Plop, Nx
generators). The harness is concerned with AI behavior configuration, not
code structure.

### Does Not Manage Secrets or Environment Variables

The harness blocks staging of common secret file types (`.env`, `.pem`,
`.tfvars`, `.clerk`) but does not manage, rotate, encrypt, or validate secrets
themselves.

**Why:** Secret management is a dedicated infrastructure concern (Vault,
1Password, AWS Secrets Manager). The harness hook is a thin safety net against
accidental commits, not a secret management system.

### Does Not Configure CI/CD

The harness does not create or modify GitHub Actions workflows, deployment
configurations, or CI pipeline definitions.

**Why:** CI/CD configuration is project-specific and often involves secrets,
environment variables, and infrastructure details. It is not within the scope
of AI behavior configuration.

### Does Not Support Partial Updates

`300-harness update` syncs everything — skills, settings, CLAUDE.md, AGENTS.md,
and Codex. There is no flag to sync only skills, or only hooks.

**Why:** The operations are fast (< 100ms total), idempotent, and independent.
Partial updates add complexity to the CLI for negligible time savings. If a
specific sync step is problematic, it is better to fix the root cause than to
skip it.

### Does Not Manage Multiple Skill Sets or Profiles

There is no concept of "profiles" (e.g., a minimal set for solo work, a full
set for team work). All 8 skills are always deployed.

**Why:** Skills are cheap (they are markdown files). Having unused skills causes
no harm — Claude Code only reads them when explicitly invoked via slash command.
Profile management adds complexity without clear benefit.

### Does Not Interact with Claude Code at Runtime

The harness has no integration with the Claude Code process. It cannot read
conversation history, intercept tool calls, or modify Claude's behavior during
a session. All configuration is pre-session: files on disk that Claude Code
reads at startup.

**Why:** Claude Code does not expose a runtime API for extensions. The harness
operates at the only available integration point: configuration files and
hooks.

---

## Boundary Summary

```
┌─────────────────────────────────────────────────────┐
│                    300-Harness Does                  │
│                                                     │
│  Deploy skill markdown files (symlink or copy)      │
│  Install safety hooks in .claude/settings.json      │
│  Update harness sections in CLAUDE.md / AGENTS.md   │
│  Maintain .codex/skills symlink                     │
│  Detect monorepo vs consumer context                │
│  Report current harness state                       │
│                                                     │
├─────────────────────────────────────────────────────┤
│               300-Harness Does Not                  │
│                                                     │
│  Execute or orchestrate skills                      │
│  Enforce the sprint lifecycle ordering              │
│  Manage source code or project config files         │
│  Auto-update on install                             │
│  Watch for file changes                             │
│  Manage Git hooks                                   │
│  Provide a plugin/extension system                  │
│  Persist state or history                           │
│  Generate code scaffolds                            │
│  Manage secrets or environment variables            │
│  Configure CI/CD pipelines                          │
│  Support partial or selective updates               │
│  Manage multiple skill profiles                     │
│  Interact with Claude Code at runtime               │
│  Validate hook effectiveness                        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## When to Expand the Scope

The boundary above should only be moved when:

1. **There is a concrete, recurring problem** that the harness is uniquely
   positioned to solve. "It would be nice to have" is not sufficient.
2. **The solution is simple.** If the implementation requires a daemon, a
   database, or a plugin registry, it probably belongs in a different tool.
3. **The new capability does not overlap** with an existing tool (Husky, Turbo,
   Changesets, Biome, etc.). Duplicating functionality creates confusion about
   which tool is authoritative.
4. **The zero-dependency constraint is maintained.** Adding runtime dependencies
   for a convenience feature is not worth the supply chain risk.
