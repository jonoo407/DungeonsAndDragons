# Dungeons & Dragons Character Sheet

A React + TypeScript application for crafting richly themed Dungeons & Dragons character sheets. The UI focuses on an enchanted journal aesthetic and prioritises fast iteration on core stats, identity details, and long-term sheet extensibility.

## Project Highlights

- Ability score roller supporting classic methods and custom dice expressions with validation.
- React Hook Form + Zod schema defining character identity and ability score structure.
- Modular component layout (identity, combat readiness, ability roller, live score grid) ready for upcoming spellbook and equipment sections.
- Styling tuned for a parchment-inspired interface with responsive panels and reusable field primitives.
- Character portrait hero panel that swaps artwork based on ancestry, class, and gender selections with graceful fallbacks.
- Class selection flow including subclasses, fighting styles, and prepared spell toggles that feed combat defaults.

## Getting Started

1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`
3. Open `http://127.0.0.1:5173` to view the app. Hot reloading is enabled by default.

Recommended environment: Node.js 20+.

## Key Commands

- `npm run dev` — Launches the Vite dev server with hot module replacement.
- `npm run build` — Type-checks via `tsc` and produces a production bundle.
- `npm run preview` — Serves the built assets locally for smoke testing.
- `npm run lint` — Runs the ESLint configuration supplied by the Vite React template.

## Documentation Map

- `docs/architecture.md` — Component layout, state management, and dice utilities.
- `docs/development.md` — Environment setup, workflow conventions, and testing guidance.
- `docs/status.md` — Current milestone snapshot, open questions, and next steps for contributors.
- `AGENTS.md` — Contributor workflow, coding standards, and pull request expectations.

## GitHub Pages Deployment

The repository ships with a GitHub Actions workflow that builds the production bundle and publishes it to the `gh-pages` branch. Once GitHub Pages is enabled for the repository, every push to `main` will redeploy the site at [`https://jonoo407.github.io/DungeonsAndDragons/`](https://jonoo407.github.io/DungeonsAndDragons/).

### Enable the workflow

1. Open **Settings → Pages** in GitHub and choose **GitHub Actions** as the source.
2. Push to `main` (or re-run the workflow from the **Actions** tab) to build and deploy the site.

### Manual deployment (optional)

If you prefer to publish from your local environment, run `npm run deploy`. The script will build the app and push the compiled assets to the `gh-pages` branch using the [`gh-pages`](https://github.com/tschaub/gh-pages) CLI.

## Contributing

New collaborators should start with `AGENTS.md`, then review the deeper references under `docs/`. Issues, improvements, and questions can be captured in `docs/status.md` so future sessions pick up seamlessly.
