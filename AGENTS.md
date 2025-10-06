# Repository Guidelines

## Project Structure & Module Organization
- `src/App.tsx` hosts the form provider and primary panels; additional panels live under `src/components/`.
- Domain types live in `src/types/character.ts`; reuse these instead of redefining literals.
- Validation and defaults live in `src/schema/character.ts`, while dice logic sits in `src/lib/dice.ts`.
- Asset pipeline follows the Vite convention: static files in `public/`, React assets under `src/assets/`.

## Build, Test, and Development Commands
- `npm run dev` — Start the Vite dev server at `http://127.0.0.1:5173` with HMR.
- `npm run build` — Run `tsc -b` then emit a production bundle; use before pushing.
- `npm run preview` — Serve the built assets locally for sanity checks.
- `npm run lint` — Execute the ESLint ruleset; extend via `eslint.config.js` if the project grows.

## Coding Style & Naming Conventions
- TypeScript only; favour explicit types exported from `src/types/character.ts`.
- Components use PascalCase filenames (e.g., `CharacterIdentitySection.tsx`); hooks/utilities use camelCase.
- Keep styling within `App.css`/`index.css` for shared primitives; add component-specific classes rather than inline styles.
- Comments are reserved for domain context or non-obvious logic—avoid restating the code.

## Testing Guidelines
- Manual checks: `npm run build`, swap through each dice method, and validate the custom expression input (`4d6`, `2d8+3`, `banana` error state`).
- Confirm the combat fields accept reasonable values (AC, HP, speed) and surface errors for out-of-range inputs or HP > max.
- When automated tests are introduced, target `lib/dice.ts` parsing edge cases and form validation with Vitest + React Testing Library.
- Record new manual or automated expectations in `docs/development.md` so others can repeat them.

## Commit & Pull Request Guidelines
- Commit messages follow `type: summary` (e.g., `feat: add spellbook panel`).
- Scope each PR around a single feature or bugfix; include screenshots or GIFs for notable UI changes.
- Link GitHub issues when available and update `docs/status.md` with major decisions or TODOs before merging.
- Request review for schema or dice changes—these impact validation shared across the app.
