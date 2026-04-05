# Sprint Lifecycle

The harness skills map to phases of a development sprint. This document
explains how the phases connect, when to use each, and what the transitions
look like in practice.

## The Phases

```
Design  ->  Plan  ->  Build  ->  Review  ->  QA  ->  Ship  ->  Reflect
  |           |         |          |          |        |          |
/300-      /300-     (normal    /300-      /300-    /300-      /300-
design     plan      Claude)    review     qa       ship       retro
```

**Build** is the only phase without a dedicated skill. Normal Claude Code usage
covers it — the skills exist for the phases where Claude benefits from a
constrained persona.

## Phase Details

### 1. Design (`/300-design`)

**Entry condition:** A feature request, bug report, or idea exists.

**Exit condition:** A design document exists with:
- Where the code will live (package placement)
- What the API surface looks like (types and interfaces)
- What the trade-offs are between approaches
- What open questions remain

**Transition to Plan:** Once the design document is reviewed and agreed upon,
invoke `/300-plan` to break it into tasks.

**When to skip:** Trivial changes (typo fix, config tweak, single-file bug fix)
that do not involve structural decisions. If you are asking "where should this
code live?" or "what should the API look like?", you need Design.

---

### 2. Plan (`/300-plan`)

**Entry condition:** A design document exists, or a feature request is small
enough to plan directly.

**Exit condition:** An ordered task list exists with:
- File-level impact per task
- "Done when" criteria for each task
- Dependency ordering
- Blast radius assessment

**Transition to Build:** Work through tasks in order.

**When to skip:** Single-task changes where the work is obvious and self-
contained. If you can describe the entire change in one sentence and it
touches fewer than 3 files, you may not need a formal plan.

---

### 3. Build (no skill)

**Entry condition:** A plan exists (or the task is trivial enough to not need
one).

**Exit condition:** Code is written and you believe it works.

**Transition to Review:** Invoke `/300-review` to get structured feedback on the
code you wrote.

**Why no skill:** Claude's default coding mode is already well-suited for
implementation. Adding a "build" persona would add overhead without changing
behavior. The value of skills is in phases where Claude's default behavior is
insufficient.

---

### 4. Review (`/300-review`)

**Entry condition:** Code changes exist (committed or uncommitted).

**Exit condition:** Code receives APPROVE, REQUEST_CHANGES, or COMMENT verdict
with all blockers resolved.

**Transition to QA:** After review issues are addressed, invoke `/300-qa` to
find test gaps.

**When to loop back:** If the review verdict is REQUEST_CHANGES, fix the issues
and re-invoke `/300-review`. Do not skip back to Build without re-reviewing.

---

### 5. QA (`/300-qa`)

**Entry condition:** Code has passed review.

**Exit condition:** Coverage gaps are identified, missing tests are written and
passing. The QA report shows acceptable risk.

**Transition to Ship:** Once tests pass and coverage is acceptable, invoke
`/300-ship` to prepare the release.

**When to loop back:** If QA discovers a significant bug (not just a missing
test), loop back to Build to fix it, then Review again.

---

### 6. Ship (`/300-ship`)

**Entry condition:** Code has passed review and QA. Tests are green. Checks
pass.

**Exit condition:** Changesets are created, builds are verified, a commit is
prepared. The user has been given the summary and decides when to push/merge.

**Transition to Reflect:** After shipping, invoke `/300-retro` to review the
process.

**What Ship does not do:** Ship does not push to remote or merge PRs. It
prepares everything and hands control back to the user.

---

### 7. Reflect (`/300-retro`)

**Entry condition:** A feature has been shipped, or a sprint is complete.

**Exit condition:** A retro document exists with actionable improvements and
any suggested harness changes.

**Transition:** Back to Design for the next feature.

**When to skip:** Only skip if the work was truly trivial and took one
iteration with no surprises.

---

## Cross-Cutting Skills

Two skills operate outside the linear lifecycle:

### /300-guard (Safety Mode)

Usable at any phase. Invoke when you want to audit state without risk. Common
scenarios:

- Before a risky operation (force push, major refactor)
- When debugging a production issue
- When reviewing unfamiliar code from another contributor
- When you suspect the repository is in a bad state

### /300-upgrade (Harness Self-Update)

Usable at any time. Invoke when the harness itself needs updating:

- After pulling changes that modified `packages/core-harness/`
- After adding or editing skill files
- When `.claude/skills/` seems out of sync with the source

---

## Example Feature Flow

Here is a concrete example of the lifecycle for adding an authentication module:

```
1. /300-design
   "Design an auth module for the NestJS app"
   → Outputs design doc: package placement, API surface, dependencies

2. /300-plan
   "Break the auth design into tasks"
   → Outputs 6 tasks: create module, add guards, add JWT strategy,
     add user entity, write tests, update CLAUDE.md

3. (Build)
   Work through tasks 1-6 using normal Claude Code

4. /300-review
   "Review my auth implementation"
   → Verdict: REQUEST_CHANGES (missing error types on guard)
   → Fix the issue

5. /300-review
   "Re-review the auth changes"
   → Verdict: APPROVE

6. /300-qa
   "Find gaps in my auth tests"
   → Writes 4 missing edge-case tests, all pass

7. /300-ship
   "Prepare auth module for release"
   → Creates changeset, verifies build, prepares commit

8. /300-retro
   "Review how the auth implementation went"
   → Notes: tests were added late; suggests TDD for next feature
```

## When to Break the Lifecycle

The lifecycle is a guide, not a cage. Break it when:

- **Hotfixes:** Skip Design and Plan. Go straight to Build → Review → Ship.
- **Exploration:** Use `/300-guard` to audit, then decide if you need Design.
- **Refactoring:** May skip Design if the structural decisions are unchanged.
  Go Plan → Build → Review → QA → Ship.
- **Documentation-only changes:** Skip QA. Go Build → Review → Ship.
