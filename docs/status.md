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
- Automated GitHub Pages deployment through a build-and-publish workflow targeting the `gh-pages` branch.
- Adjusted GitHub Pages workflow triggers so deployments run from `main` or the legacy `master` branch.
- Delivered class selection flow with SRD class metadata, subclass enforcement, fighting style radios, and prepared-spell toggle backed by new `lib/classes.ts` helpers.
- Surfaced class-derived defaults in the combat panel, including an "apply defaults" action and ability-focused copy in the ability roller.
- Implemented an ancestry/class/gender-aware portrait system with resolver fallbacks, loading skeleton, and starter assets.

## In Progress / Needs Attention

- Automated coverage currently only targets the portrait resolver via a Node-based harness; broader form and dice coverage remains manual.
- Git default branch remains `master`; confirm if rename to `main` is desired.
- Accessibility pass pending (focus states exist, but semantic review is outstanding).

## Next Steps

1. **Form Expansion** - Continue the panel pattern for skills, equipment, spellcasting, and session notes building on the new class infrastructure.
2. **Persistence** - Implement localStorage autosave plus import/export of character JSON for cross-session editing.
3. **Validation Enhancements** - Extend dice parser for advanced mechanics (keep/drop dice, advantage/disadvantage) and ensure class-derived constraints stay coherent.
4. **Testing** - Expand the new Node-based harness (or introduce a richer framework) to cover `ClassSelectionSection`, `schema/character.ts`, and existing dice utilities.
5. **Design Polish** - Create a print-friendly layout or PDF export after the new panels land.

## Open Questions

- Should ability scores remain read-only derived values, or will manual overrides be allowed per house rules?
- What level of spell management is expected (full spellbook vs. quick summary)?
- Are there external data integrations planned (SRD APIs, compendium imports)?
- Should players be able to override the auto-selected portrait with manual picks or uploads?
- Do we need animated or multi-frame portrait support for future theming?

Capture answers or new tasks here before closing any future work sessions.
