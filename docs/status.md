# Project Status — 05 Oct 2025

## Snapshot

- Vite + React + TypeScript scaffold in place with form infrastructure (React Hook Form + Zod).
- Character identity panel and ability score roller panels live, including custom dice expression parsing.
- Documentation refactored; contributor guide and development references ready for collaborators.

## Recently Completed

- Added `schema/character.ts` with alignment options, ability defaults, and dice expression validation.
- Implemented `lib/dice.ts` parser supporting additive/subtractive dice expressions and reusable RNG helpers.
- Integrated dice method selector + custom expression input into the main form, with friendly validation feedback.
- Refreshed styling to accommodate multi-panel layout and reusable field styles.
- Established documentation structure (`README.md`, `docs/`, `AGENTS.md`).

## In Progress / Needs Attention

- No automated tests yet; manual smoke checks cover builds and dice validation only.
- Git default branch remains `master`; confirm if rename to `main` is desired.
- Accessibility pass pending (focus states exist, but semantic review is outstanding).

## Next Steps

1. **Form Expansion** — Add panels for combat stats (AC, initiative, HP), skills, equipment, and notes using the existing panel pattern.
2. **Persistence** — Implement localStorage autosave + import/export of character JSON.
3. **Validation Enhancements** — Extend dice parser for advanced mechanics (keep/drop dice, advantage/disadvantage) if required.
4. **Testing** — Introduce Vitest + React Testing Library for dice utilities and form behaviour.
5. **Design Polish** — Create a print-friendly layout or PDF export for completed sheets.

## Open Questions

- Should ability scores remain read-only derived values, or will manual overrides be allowed per house rules?
- What level of spell management is expected (full spellbook vs. quick summary)?
- Are there external data integrations planned (SRD APIs, compendium imports)?

Capture answers or new tasks here before closing any future work sessions.
