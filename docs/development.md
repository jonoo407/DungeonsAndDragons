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
| Preview build | `npm run preview` | Requires a prior `npm run build`. |

## Coding Standards

- Follow the guidelines in `AGENTS.md` for naming, file placement, and pull request hygiene.
- Prefer TypeScript types exported from `src/types/character.ts` rather than re-declaring literals.
- Create new panels/components under `src/components/` with self-contained styling hooks where possible.
- Keep comments purposeful—explain non-obvious logic or domain rules rather than restating code.

## Validation & Testing

Automated testing is not yet configured; rely on the following manual checks:

1. `npm run build` — Ensures TypeScript + Vite compilation succeeds.
2. Exercise the ability roller in dev mode:
   - Switch between each predefined method.
   - Enter valid/invalid custom expressions (e.g. `4d6`, `2d8+3`, `3d6-1`, `banana`). Confirm error states and disabled roll button.
3. Verify identity form validation triggers when fields are left blank and recovers on fix.
4. Adjust combat fields (AC, HP, speed) to ensure min/max limits and HP > Max validation behave as expected.

Additions to the dice parser or schema should include unit coverage (e.g., Vitest) in future iterations; see `docs/status.md` for current testing roadmap.

## Git & Branching

- Main branch: `master` (rename to `main` if team prefers).
- Use feature branches per change set; rebase before opening a PR.
- Commit messages follow conventional `type: summary` style (e.g., `feat: scaffold character ability roller`).

## Future Enhancements

- Introduce automated tests (Vitest + React Testing Library) once more sheet sections exist.
- Add continuous integration (GitHub Actions) to run `npm run build` and `npm run lint` on pull requests.
- Consider integrating Storybook or Ladle for isolated component development as the sheet grows.
