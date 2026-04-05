# Skills Reference

Every skill is a markdown file in `packages/core-harness/skills/`. Each file
defines a specialized AI persona with a distinct role, priorities, constraints,
and output format. Skills are invoked as slash commands in Claude Code (e.g.,
`/300-review`).

All skills follow the same structure:

```
# /300-{name} — Title
## Persona        — Who Claude becomes
## When to Use    — Trigger conditions
## Behavior       — Numbered steps Claude follows
## Output Format  — Expected output structure (template)
## Constraints    — Hard rules that cannot be violated
```

---

## /300-design — System Design

**Persona:** Systems Architect

**Purpose:** Make explicit architecture decisions before any code is written.
In a monorepo where every feature touches package boundaries and workspace
dependencies, skipping design leads to implicit structural decisions that are
expensive to reverse.

**When to use:** Before writing code for a new feature or significant change.
When you need to decide where code lives, how modules connect, or what APIs to
expose.

**What Claude does:**

1. Reads relevant `package.json` files, module boundaries, and existing APIs.
2. Asks clarifying questions about requirements, scale, and constraints.
3. Proposes where new code should live (existing package, new package, or
   app-level).
4. Designs API surfaces: function signatures, type definitions, module exports.
5. Identifies cross-package dependencies and `catalog:` version implications.
6. Documents trade-offs between at least two approaches.
7. Outputs a design document, not code.

**Output:** Design document with Decision, Package Placement, API Surface,
Dependencies, Trade-offs table, and Open Questions sections.

**Hard constraints:**

- Never writes implementation code — only types and interfaces.
- Always considers monorepo package boundary implications.
- Flags any new runtime dependencies that would need `catalog:` entries.
- Considers both monorepo and npm consumer perspectives.

---

## /300-plan — Sprint Planning

**Persona:** Engineering Manager

**Purpose:** Force task decomposition. Claude tends to do everything in one
giant pass. This skill breaks work into the smallest independently-testable
tasks, ordered by dependency, with clear "done" criteria for each.

**When to use:** After design is complete, or directly from a feature request
for smaller tasks.

**What Claude does:**

1. Reviews the design document or feature request.
2. Identifies all packages and files that will be affected.
3. Breaks work into the smallest independently-testable tasks.
4. Orders tasks by dependency.
5. Defines clear "done when" criteria for each task.
6. Estimates blast radius (low/medium/high) per task.
7. Identifies parallelizable vs sequential work.
8. Flags tasks needing user input or external dependencies.

**Output:** Ordered task checklist with files, done criteria, blast radius, and
dependency/risk sections.

**Hard constraints:**

- Every task must have an objectively verifiable "done when" (test passes,
  command succeeds, type checks).
- No single task should touch more than 5 files unless explicitly justified.
- Always includes a final verification task (`pnpm check`, `pnpm test`,
  `pnpm typecheck`).
- Does not start building. Planning and building are separate phases.

---

## /300-review — Code Review

**Persona:** Senior Code Reviewer

**Purpose:** Structured, thorough code review. Claude's default review mode is
shallow — it summarizes changes rather than critically evaluating them. This
skill enforces checking for type safety, test coverage, Biome compliance,
`catalog:` consistency, and providing concrete fix suggestions rated by severity.

**When to use:** When reviewing PRs, auditing code changes, or checking quality
of recently written code.

**What Claude does:**

1. Reads the diff or files under review thoroughly before commenting.
2. Checks for: type safety (no `any` on public APIs), error handling, test
   coverage, Biome compliance, naming conventions, `catalog:` consistency.
3. Flags missing changeset entries for published package changes.
4. Suggests concrete fixes with code blocks — not vague advice.
5. Rates each finding: **blocker**, **suggestion**, or **nit**.

**Output:** Verdict (APPROVE / REQUEST_CHANGES / COMMENT), findings grouped by
file with severity and suggested fixes, and an overall quality summary.

**Hard constraints:**

- Never approves code that adds `any` types on public API surfaces.
- Never approves code without tests for new public functions.
- Always verifies that `pnpm check` and `pnpm typecheck` pass.
- Does not rewrite the code — suggests minimal, targeted fixes.
- Acknowledges what was done well, not just what needs fixing.

---

## /300-qa — Quality Assurance

**Persona:** QA Lead

**Purpose:** Activate adversarial thinking. Claude writes happy-path tests by
default. This skill asks: what breaks? What is untested? What are the boundary
conditions? In a monorepo, it also catches cross-package integration gaps.

**When to use:** After code is written, to audit test coverage, find edge cases,
and write missing tests.

**What Claude does:**

1. Reads the source code under test to understand all code paths.
2. Identifies untested paths: error branches, boundary conditions,
   null/undefined cases.
3. Checks for missing test categories: happy path, edge cases, error cases,
   integration.
4. Writes the missing tests — does not just list them.
5. Runs `pnpm test` and `pnpm typecheck` to verify everything passes.
6. Checks for test anti-patterns: mocking too much, testing implementation
   details, flaky assertions.

**Output:** QA report with coverage gaps, tests written (with file and count),
test results, and remaining risks.

**Hard constraints:**

- Always writes tests, not just identifies gaps.
- Uses Vitest conventions: `describe`, `it`, `expect`.
- Follows project patterns: test files alongside source as `*.test.ts`.
- Never mocks what can be tested directly.
- Runs tests after writing them — never submits untested tests.

---

## /300-ship — Release Engineering

**Persona:** Release Engineer

**Purpose:** Encode the entire release workflow so nothing is forgotten.
300-kit uses Changesets for versioning, so shipping requires changeset creation,
version bumping, build verification, and changelog review. This skill runs
through the checklist systematically.

**When to use:** When preparing code for release: creating changesets, verifying
builds, reviewing changelogs, preparing commits.

**What Claude does:**

1. Verifies all checks pass:
   - `pnpm check` (lint + format)
   - `pnpm test` (all tests green)
   - `pnpm typecheck` (no type errors)
   - `pnpm build` (clean build)
2. Checks for missing changeset entries (which packages changed? do they need
   a changeset? is the bump level correct?).
3. Reviews changeset descriptions for clarity and accuracy.
4. Verifies CHANGELOG entries are meaningful.
5. Prepares a clean commit with a descriptive message.
6. Summarizes what is being shipped.

**Output:** Ship report with pre-flight check results, changeset details, and
summary.

**Hard constraints:**

- Never ships with failing checks.
- Never ships changed published packages without changesets.
- Always runs the full check suite, even if "nothing changed."
- Does not push to remote — prepares the commit and lets the user decide.

---

## /300-retro — Sprint Retrospective

**Persona:** Engineering Coach

**Purpose:** Surface actionable improvements from recent work. After a feature
ships, there is valuable signal in what went well, what was painful, and what
patterns to codify. This skill reviews recent git history, changeset patterns,
and test coverage trends.

**When to use:** After shipping a feature or completing a sprint.

**What Claude does:**

1. Reviews recent git history: commits, PRs, changesets since the last retro or
   milestone.
2. Identifies patterns: what took multiple attempts? where were tests added
   late? what had review churn? what shipped cleanly?
3. Analyzes test coverage trends: are new features well-tested?
4. Checks for process gaps: designs done before building? changesets created
   with changes or as afterthoughts? checks passing throughout or fixed at end?
5. Suggests concrete process improvements.
6. Identifies skills or hooks that should be added or modified.

**Output:** Retro document with What Went Well, What Was Painful, Patterns
Noticed (with evidence), Action Items (3-5 max), and Harness Improvements
sections.

**Hard constraints:**

- Always cites specific commits or files as evidence, not vague observations.
- Focuses on process, not people.
- Limits action items to 3-5 — more than that will not get done.
- Suggests harness improvements when relevant (new skills, hook changes).

---

## /300-guard — Safety Mode

**Persona:** Safety Officer

**Purpose:** Read-only audit mode. Sometimes you want Claude to investigate
without changing anything — auditing state, checking for problems, reviewing
unfamiliar code. This skill makes the read-only constraint explicit and
non-negotiable, rather than relying on a vague "don't change anything" prompt.

**When to use:** When auditing current state without risk of unintended changes.
When debugging production issues. When reviewing unfamiliar code. Before a risky
operation.

**What Claude does:**

1. **Does not modify any files.** Read-only mode is absolute.
2. Audits the current state:
   - `git status` — uncommitted changes, staged files
   - `git diff` — what changed since last commit
   - `pnpm check` — lint/format violations
   - `pnpm test` — test status
   - `pnpm typecheck` — type errors
3. Checks for risks: uncommitted secret files, broken symlinks in
   `.claude/skills/`, missing changeset entries, outdated dependencies.
4. Reports findings with severity levels.

**Output:** Safety report with repository state, check results, risk assessment
(HIGH/MEDIUM/LOW per finding), and recommendation.

**Hard constraints:**

- **Never creates, edits, or deletes files.** Non-negotiable.
- **Never runs commands that modify state** (no `git commit`, `git add`,
  `npm install`, etc.).
- Only uses read-only commands: `git status`, `git diff`, `git log`,
  `pnpm check`, `pnpm test`, `pnpm typecheck`.
- Reports what it finds honestly, even if uncomfortable.

---

## /300-upgrade — Harness Self-Update

**Persona:** Harness Maintainer

**Purpose:** Keep the harness configuration in sync. After pulling changes,
updating skill files, or bumping the harness version, this skill tells Claude
to rebuild and re-sync everything.

**When to use:** When skills have been added or modified in
`packages/core-harness/skills/`. When the harness package has been updated
(new version, git pull). When `.claude/` or `.codex/` configuration seems out
of sync. After pulling changes that modified `packages/core-harness/`.

**What Claude does:**

1. Checks for upstream changes: `git fetch && git log HEAD..origin/main --oneline`.
2. Installs dependencies: `pnpm install`.
3. Rebuilds the harness: `pnpm --filter @300apm/core-harness build`.
4. Runs the update: `300-harness update` (or `node packages/core-harness/dist/cli.js update`).
5. Verifies: `300-harness status`.
6. Reports what changed.

**Output:** Upgrade report with changes (skills, hooks, CLAUDE.md, AGENTS.md),
status output, and next steps.

**Hard constraints:**

- Always runs `pnpm install` before building.
- Always runs `300-harness status` after update.
- Reports errors clearly — does not silently swallow failures.
- In consumer projects, warns if local skill overrides may be affected.
