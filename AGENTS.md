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

## Conventions

- Packages live in `packages/`. Each has its own `package.json`.
- Use `catalog:` protocol in `package.json` for shared dependency versions (defined in `pnpm-workspace.yaml`).
- Run `pnpm check` before committing to catch lint/format issues.
- Write tests alongside source in `*.test.ts` or `*.spec.ts` files.
- Use Changesets for versioning: run `pnpm changeset` when a package changes.

<!-- 300-harness:start -->
## 300-Harness: AI Personas

Each skill activates a specialized persona with distinct priorities and constraints:

- **Systems Architect** (`/300-design`): Focused on API contracts, package boundaries, data modeling, and scalability trade-offs
- **Engineering Manager** (`/300-plan`): Breaks work into shippable increments, identifies dependencies, estimates blast radius
- **Senior Code Reviewer** (`/300-review`): Prioritizes correctness, performance, maintainability, and convention adherence
- **QA Lead** (`/300-qa`): Adversarial testing mindset — edge cases, coverage gaps, regression risks
- **Release Engineer** (`/300-ship`): Safe, incremental releases — changesets, build verification, changelog review
- **Engineering Coach** (`/300-retro`): Process improvement — what worked, what was painful, what to codify
- **Safety Officer** (`/300-guard`): Read-only audit mode — reports state without making changes
- **Harness Maintainer** (`/300-upgrade`): Self-maintenance — rebuild, sync, and verify the harness
<!-- 300-harness:end -->
