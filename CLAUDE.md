# CLAUDE.md

## Commands
- Install deps: `pnpm install`
- Start dev server: `pnpm dev`
- Lint: `pnpm lint`
- Run all tests: `pnpm test`
- Run tests (watch): `pnpm test:watch`
- Run tests (coverage): `pnpm test:coverage`
- Add shadcn component: `pnpm dlx shadcn@latest add <component>`

## Architecture

Single-page brewing batch record form. No backend, no routing, no database.

- `src/types/brew.ts` — `BrewBatch` is the single source of truth for all state shape
- `src/hooks/useBrewBatch.ts` — all state lives here; `setBatch` always runs `applyDerivedStats` so ABV/attenuation stay in sync
- `src/lib/storage/adapter.ts` — `LocalStorageAdapter` behind a `StorageAdapter` interface; key is `brew-day-record-v2`
- `src/lib/calculations/brewing.ts` — pure functions for ABV, attenuation, gravity parsing
- `src/lib/normalizeBrewBatch.ts` — normalizes imported JSON against the Jola catalog; called on load and import
- `src/lib/defaults.ts` — factory functions (`createEmptyFermentable`, `createDefaultBrewBatch`, etc.)
- `src/constants/jolaCatalog.ts`, `src/constants/theSwaenBeerMalts.ts` — ingredient catalogs
- `src/app/page.tsx` — single page, wires `useBrewBatch` into tabbed section components

Path alias: `@/` → `src/`

## Constraints
- No backend — do not add API routes, server actions, or a database
- No new pages — intentionally single-page
- No state manager (Redux, Zustand, Jotai, etc.) — `useState` + `useBrewBatch` is sufficient
- Do not write shadcn components by hand — always use the CLI to add them

## Code style
- TypeScript strict mode
- Single quotes, no semicolons
- Functional patterns; avoid classes except where already used (`LocalStorageAdapter`)

## Design system
- shadcn/ui — https://ui.shadcn.com/

## Testing

Stack: **Vitest** + **React Testing Library** + **jsdom**

### What to test and where

| Layer | What | Location |
|---|---|---|
| Pure functions | All exports in `src/lib/calculations/` | `src/lib/calculations/__tests__/` |
| Normalisation | `normalizeBrewBatch`, row normalizers | `src/lib/__tests__/` |
| Custom hooks | `useBrewBatch` — save/load/reset/import/export/derived stats | `src/hooks/__tests__/` |
| Components | Render, user interaction, edge cases for key sections | `src/components/brew/__tests__/` |

### Conventions
- Co-locate tests under `__tests__/` next to the code they cover
- One `describe` block per module/component; group related cases with nested `describe`
- Name tests `it('does X when Y')` — readable as a sentence
- Use `@testing-library/user-event` over `fireEvent` for interaction tests
- Mock `localStorage` with `vi.stubGlobal` or `vitest-localstorage-mock`; never let tests share storage state
- Prefer `screen.getByRole` / `getByLabelText` over `getByTestId` — test behaviour, not implementation
- Avoid snapshot tests for logic-heavy components; prefer explicit assertions
