# Class Selection Implementation Plan

## Goals
- Allow players to choose a character class during sheet creation.
- Surface class-specific options (e.g., archetypes, spellcasting focus) as follow-up fields.
- Apply class-derived defaults or modifiers to combat stats (hit points, hit dice, proficiencies) while keeping manual overrides possible.

## Assumptions
- The existing form architecture (React Hook Form + Zod) remains the backbone for new inputs.
- Class data will follow SRD-friendly naming and avoid proprietary content.
- Default combat stats can be recalculated when class selection changes, but users may subsequently edit them.

## Workstreams

### 1. Domain Modeling
1. Define `ClassId`, `ClassOption`, and `SubclassOption` types in `src/types/character.ts`.
2. Capture class metadata (hit dice, primary ability, saving throw proficiencies, optional subclasses, spellcasting flag) in a new `CLASS_DEFINITIONS` record under `src/lib/`.
3. Export derived helpers (e.g., `getClassDefaults(classId)`) for reuse across schema and UI.

### 2. Schema & Defaults
1. Extend `characterFormSchema` in `src/schema/character.ts` with a `classSelection` object containing:
   - `classId` (enum of `ClassId`).
   - Optional `subclassId` with per-class validation.
   - Flags for spellcasting preparation or martial fighting style when applicable.
2. Seed `defaultCharacter` with a fallback class (e.g., `fighter`) and neutral subclass fields.
3. Introduce derived combat defaults (hit die, hit point baseline, proficiency hints) via refinement that reacts to class choice but still respects manual overrides.

### 3. UI Components
1. Create `ClassSelectionSection.tsx` under `src/components/` with:
   - Primary select for class.
   - Conditional select/radio groups for subclasses or fighting styles.
   - Helper text summarizing hit dice and proficiencies.
2. Integrate the section into `App.tsx`, placing it near the identity panel.
3. Ensure conditional fields mount/unmount gracefully and retain state per class.

### 4. Combat Panel Integration
1. Update `CombatStatsSection` to display class-derived defaults (hit die, proficiency bonus guidance).
2. When a class changes, provide an option to apply recommended values (e.g., button or toast) without overwriting manual entries silently.
3. Highlight any discrepancies between class defaults and current values for user awareness.

### 5. Dice & Ability Score Interplay
1. Tag classes with their primary ability to inform the ability score roller copy.
2. Optionally add a UI hint suggesting which score to prioritize based on class selection.

### 6. Validation & Cross-Field Effects
1. Ensure schema refinements prevent invalid combinations (e.g., selecting a subclass before choosing its parent class).
2. Add form-level effect or hook to reset subclass/spellcasting options when the base class changes.
3. Write unit tests (Vitest + RTL) covering schema behavior and conditional UI rendering.

### 7. Documentation & Status Updates
1. Document class data structure and defaults in `docs/architecture.md` or a new `docs/data-model.md` section.
2. Update `docs/development.md` with manual testing steps for class changes impacting combat stats.
3. Amend `docs/status.md` to reflect completion and note any outstanding class-related enhancements (e.g., subclass features).

## Open Questions
- Should class defaults auto-apply on initial selection or require explicit confirmation?
- How deep should subclass-specific configuration go in the first iteration (e.g., spell lists, fighting styles)?
- Do we need to support multiclassing, or is a single-class model sufficient for now?
