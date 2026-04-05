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
