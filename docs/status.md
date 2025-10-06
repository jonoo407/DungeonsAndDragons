# Project Status - 05 Oct 2025

## Snapshot

- Vite + React + TypeScript scaffold in place with form infrastructure (React Hook Form + Zod).
- Character identity, combat stats, and ability score roller panels live with shared validation + styling.
- Documentation refactored; contributor guide and development references ready for collaborators.

## Recently Completed

- Added `CombatStatsSection` with bounded numeric inputs, helper copy, and default values in `schema/character.ts`.
- Expanded `schema/character.ts` to cover combat defaults and prevent current HP from exceeding max HP.
- Implemented `lib/dice.ts` parser supporting additive/subtractive dice expressions and reusable RNG helpers.
- Integrated dice method selector + custom expression input into the main form, with friendly validation feedback.
- Refreshed styling to accommodate multi-panel layout and reusable field styles.
- Established documentation structure (`README.md`, `docs/`, `AGENTS.md`).

## In Progress / Needs Attention

- No automated tests yet; manual smoke checks cover builds and dice validation only.
- Git default branch remains `master`; confirm if rename to `main` is desired.
- Accessibility pass pending (focus states exist, but semantic review is outstanding).

## Next Steps

1. **Class Selection Slice** - Introduce structured class data (base class list plus optional archetypes), extend `schema/character.ts` and form types, add a `ClassSelectionSection`, and propagate class defaults (hit dice, proficiency hints) into the combat panel.
2. **Form Expansion** - Continue the panel pattern for skills, equipment, spellcasting, and session notes once class selection is stable.
3. **Persistence** - Implement localStorage autosave plus import/export of character JSON for cross-session editing.
4. **Validation Enhancements** - Extend dice parser for advanced mechanics (keep/drop dice, advantage/disadvantage) and ensure class-derived constraints stay coherent.
5. **Testing** - Stand up Vitest plus React Testing Library, prioritising coverage for `ClassSelectionSection`, `schema/character.ts`, and existing dice utilities.
6. **Design Polish** - Create a print-friendly layout or PDF export after the new panels land.

## Open Questions

- Should ability scores remain read-only derived values, or will manual overrides be allowed per house rules?
- What level of spell management is expected (full spellbook vs. quick summary)?
- Are there external data integrations planned (SRD APIs, compendium imports)?

Capture answers or new tasks here before closing any future work sessions.
