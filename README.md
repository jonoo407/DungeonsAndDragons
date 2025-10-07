# Dungeons & Dragons Character Sheet

A React + TypeScript application for crafting richly themed Dungeons & Dragons character sheets. The UI focuses on an enchanted journal aesthetic and prioritises fast iteration on core stats, identity details, and long-term sheet extensibility.

## Project Highlights

- Ability score roller supporting classic methods and custom dice expressions with validation.
- React Hook Form + Zod schema defining character identity and ability score structure.
- Modular component layout (identity, combat readiness, ability roller, live score grid) ready for upcoming spellbook and equipment sections.
- Styling tuned for a parchment-inspired interface with responsive panels and reusable field primitives.

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

This project is configured for automatic deployment to GitHub Pages:

1. **Automatic Deployment**: The app automatically deploys when changes are pushed to the `main` or `master` branch via GitHub Actions
2. **Manual Deployment**: Run `npm run deploy` to manually deploy to GitHub Pages
3. **Live Site**: Once deployed, the app will be available at `https://[username].github.io/dnd/`

### Deployment Setup

1. Enable GitHub Pages in your repository settings:
   - Go to Settings → Pages
   - Select "GitHub Actions" as the source
2. The workflow will automatically build and deploy your app

## Contributing

New collaborators should start with `AGENTS.md`, then review the deeper references under `docs/`. Issues, improvements, and questions can be captured in `docs/status.md` so future sessions pick up seamlessly.
