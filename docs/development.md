# Development Guide

## Prerequisites

- Node.js 20 or later (aligns with Vite 7 + React 19 requirements).
- npm 10 (bundled with recent Node releases).

Install dependencies once with `npm install`.

## Local Workflow

| Task | Command | Notes |
| ---- | ------- | ----- |
| Start dev server | `npm run dev` | Serves at `http://127.0.0.1:5173` with HMR. |
| Type-check & build | `npm run build` | Runs `tsc -b` before emitting the production bundle. |
| Lint | `npm run lint` | Uses the Vite template ESLint config; extend via `eslint.config.js`. |
| Run portrait resolver tests | `npm run test` | Compiles a minimal Node test harness and executes the resolver regression suite. |
| Preview build | `npm run preview` | Requires a prior `npm run build`. |

## Coding Standards

- Follow the guidelines in `AGENTS.md` for naming, file placement, and pull request hygiene.
- Prefer TypeScript types exported from `src/types/character.ts` rather than re-declaring literals.
- Create new panels/components under `src/components/` with self-contained styling hooks where possible.
- Keep comments purposeful—explain non-obvious logic or domain rules rather than restating code.

## Validation & Testing

Automated coverage currently exists for the portrait resolver via a lightweight Node harness (`npm run test`). Continue to rely on the following manual checks for the rest of the sheet until broader automation lands:

1. `npm run build` — Ensures TypeScript + Vite compilation succeeds.
2. Exercise the ability roller in dev mode:
   - Switch between each predefined method.
   - Enter valid/invalid custom expressions (e.g. `4d6`, `2d8+3`, `3d6-1`, `banana`). Confirm error states and disabled roll button.
3. Verify identity form validation triggers when fields are left blank and recovers on fix.
4. Walk through class selection:
   - Choose a class with subclasses (e.g. Cleric) and ensure the subclass select enforces a choice.
   - Toggle to a martial class (Fighter, Paladin, Ranger) and confirm fighting style radios appear and persist per class.
   - Switch to a prepared caster (Cleric, Druid, Wizard) and confirm the prepared-spell checkbox toggles without leaking to non-prepared classes.
   - Apply class defaults from the combat panel and verify hit dice / max HP update without overwriting custom current HP unless needed.
5. Adjust combat fields (AC, HP, speed) to ensure min/max limits and HP > Max validation behave as expected.
6. Verify the character portrait updates as ancestry, class, and gender selections change. Confirm the fallback image appears for unsupported combinations and that the layout stays responsive on narrow viewports.

## Portrait Assets

- Store portrait art in `public/portraits/` using the naming scheme `<ancestry>__<class>__<gender>.svg` (lowercase, kebab-case identifiers aligned with the schema enums). Partial fallbacks may omit class or gender segments (e.g. `dwarf.svg`, `fighter__male.svg`).
- Prefer lightweight SVG illustrations or other text-based formats so pull requests avoid binary asset diffs. If you must commit raster art, keep the file under version control through Git LFS.
- Run `npm run build` after adding art to ensure Vite picks up the new static files, and add a manifest entry in `src/lib/portraits.ts` so the resolver can find the asset.

Additions to the dice parser or schema should include unit coverage (using the existing harness or an expanded solution) in future iterations; see `docs/status.md` for the current testing roadmap.

## Git & Branching

- Main branch: `master` (rename to `main` if team prefers).
- Use feature branches per change set; rebase before opening a PR.
- Commit messages follow conventional `type: summary` style (e.g., `feat: scaffold character ability roller`).

## Future Enhancements

- Introduce broader automated tests (e.g., React Testing Library) once more sheet sections exist.
- Add continuous integration (GitHub Actions) to run `npm run build` and `npm run lint` on pull requests.
- Consider integrating Storybook or Ladle for isolated component development as the sheet grows.
