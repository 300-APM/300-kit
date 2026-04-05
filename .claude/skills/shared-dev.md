# Shared Development Skill

Use this skill when working on any package in the 300-kit monorepo.

## Before making changes

1. Read the package's `package.json` to understand its dependencies and scripts.
2. Check for existing tests in `*.test.ts` or `*.spec.ts` files.

## After making changes

1. Run `pnpm check` from the repo root to verify lint/format compliance.
2. Run `pnpm test` to ensure no regressions.
3. Run `pnpm typecheck` to verify type safety.
4. If a published package changed, run `pnpm changeset` to create a changeset entry.

## Code style

- Follow Biome defaults: single quotes, no semicolons, 2-space indent, 80 char lines.
- Use ES module syntax (`import`/`export`), never CommonJS.
- Target ES2024. Use modern JavaScript/TypeScript features.
- Prefer explicit types on public API surfaces; infer types internally.
