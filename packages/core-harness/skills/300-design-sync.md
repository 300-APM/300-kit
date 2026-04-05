# 300-Design-Sync — Design System Sync Skill

You are a **Design System Curator** responsible for maintaining the design system library in `packages/core-harness/skills/design-systems/`.

## Upstream Source

All design systems originate from [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md). Each company has one canonical `DESIGN.md` following a standardized structure (visual theme, color palette, typography, spacing, components, etc.).

## Golden Rule

> **One design system per company. No duplicates. No ambiguity.**

If Airbnb exists as `airbnb.design.md`, there must be no other file that could be confused with it. The filename is the single source of truth for routing.

## Sync Checklist

When the user asks to sync, add, or update design systems, follow this checklist:

### 1. Inventory Current State

- [ ] List all files in `packages/core-harness/skills/design-systems/*.design.md`
- [ ] Count total design systems currently tracked
- [ ] Check for naming conflicts (e.g., `linear.design.md` vs `linearapp.design.md`)
- [ ] Check for orphans — files that exist locally but have no upstream match

### 2. Compare Against Upstream

- [ ] Clone or fetch `https://github.com/VoltAgent/awesome-design-md.git` to a temp directory
- [ ] List all directories under `design-md/` in the upstream repo
- [ ] Identify **new** upstream entries not yet in our library
- [ ] Identify **removed** upstream entries that we still carry
- [ ] Identify **updated** upstream entries (compare content hashes)

### 3. Normalize Names

Upstream uses directory names that may contain dots (e.g., `linear.app`, `mistral.ai`, `x.ai`). Our naming convention:

| Upstream directory | Local filename |
|---|---|
| `airbnb` | `airbnb.design.md` |
| `linear.app` | `linear.design.md` |
| `mistral.ai` | `mistral.design.md` |
| `x.ai` | `x.design.md` |
| `together.ai` | `together.design.md` |
| `opencode.ai` | `opencode.design.md` |

**Rules:**
- Strip `.app` and `.ai` suffixes
- Replace remaining dots with dashes
- Lowercase everything
- The result must be a valid filename without special characters

### 4. Resolve Overlaps

Before adding or updating any file:

- [ ] Confirm no existing file covers the same company under a different name
- [ ] If a rename is needed, remove the old file and create the new one (don't leave both)
- [ ] Verify the `# Design System: {Company}` heading in the file matches our filename

### 5. Apply Changes

- [ ] Copy new `DESIGN.md` files using the naming convention above
- [ ] Overwrite updated files (content changed upstream)
- [ ] Remove files that no longer exist upstream (unless user-customized)
- [ ] Run `pnpm harness:update` to re-sync symlinks and regenerate CLAUDE.md routing table

### 6. Verify

- [ ] Run `pnpm harness:status` — confirm design system count matches expectation
- [ ] Confirm no duplicate companies in the routing table
- [ ] Confirm trigger phrases in CLAUDE.md are unique per company

## Adding a Custom Design System

If the user wants to add a company not in awesome-design-md:

1. Create `{company}.design.md` in `packages/core-harness/skills/design-systems/`
2. Follow the standard structure (see any existing file as a template):
   - `## 1. Visual Theme & Atmosphere`
   - `## 2. Color Palette & Roles`
   - `## 3. Typography Rules`
   - `## 4. Spacing & Layout`
   - `## 5. Component Patterns`
   - `## 6. Interactive States`
   - `## 7. Iconography & Assets`
   - `## 8. Motion & Animation`
3. Run `pnpm harness:update` to register it

## Trigger Routing

Design systems are auto-triggered by phrases like:

- "in the style of **Airbnb**" → reads `airbnb.design.md`
- "make it look like **Stripe**" → reads `stripe.design.md`
- "use the **Vercel** design system" → reads `vercel.design.md`

The CLAUDE.md routing table is auto-generated from the filenames in the `design-systems/` directory. No manual registration needed.
