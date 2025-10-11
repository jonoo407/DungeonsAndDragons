# Character Portrait Integration Plan

## Objective
- Display a hero portrait at the top of the sheet that automatically reflects the selected ancestry (race), class, and gender.
- Keep portrait logic extensible so new assets or selection options can be added without refactoring form components.

## Assumptions
- Character gender will be captured as a limited enum (e.g., `"female" | "male" | "nonbinary" | "custom"`) with optional custom text for edge cases.
- Portraits will live in `public/portraits/` so they can be referenced via simple URLs without going through the bundler.
- Each portrait variant follows a predictable file naming convention: `<ancestry>__<class>__<gender>.svg` with lowercase, kebab-case identifiers that align with our existing enums.
- When an exact match is missing we can fall back in order: full triple → ancestry+gender → class+gender → ancestry only → global default.

## Workstreams

### 1. Domain Modeling & Types
1. Extend `src/types/character.ts` with a `GenderId` union and helper arrays similar to `raceIds`/`classIds`.
2. Add a `CharacterGender` type to allow custom labels when the user selects an "other" option.
3. Define a `PortraitId` helper that captures the tuple `(ancestry, classId, gender)` to reduce ad-hoc string building elsewhere.
4. Create `src/lib/portraits.ts` exporting:
   - A `PORTRAIT_MANIFEST` record keyed by ancestry/class/gender combos.
   - A `resolvePortraitSource` function that implements the fallback chain described above.
   - Optional metadata (e.g., attribution text) for future display beneath the image.

### 2. Schema & Defaults
1. Update `characterIdentitySchema` in `src/schema/character.ts` to include `genderId` (enum) and optional `customGenderLabel` when `genderId === "custom"`.
2. Extend `defaultCharacterIdentity` to seed a default gender.
3. Add refinements ensuring the custom label is populated when the custom gender option is selected.

### 3. UI Enhancements
1. Create a new `CharacterPortrait` component under `src/components/` responsible solely for rendering the image, alt text, loading skeleton, and attribution copy.
2. In `App.tsx`, `useWatch` the trio `identity.ancestry`, `classSelection.classId`, and `identity.genderId` to compute the current portrait URL via `resolvePortraitSource`.
3. Render `CharacterPortrait` above the existing form panels, using a layout wrapper (e.g., `hero-header`) in `App.css` to ensure responsive behavior.
4. Update `CharacterIdentitySection` to collect gender using a select input with optional text input for custom values, reusing any helper arrays exported from the schema/types layer.
5. Provide alt text by combining the selected ancestry, class, and gender label (falling back to generic descriptors when data is missing).

### 4. Asset Management
1. Add a handful of starter portrait images to `public/portraits/` that cover representative combinations (ensure we have at least one fallback per ancestry and class group).
2. Document the naming scheme inside `docs/development.md` so contributors can drop in additional variants without code changes.
3. Consider introducing `public/portraits/fallback.svg` as the universal default referenced by `resolvePortraitSource`.

### 5. Styling & Accessibility
1. Add portrait-specific styles to `App.css` (e.g., max-width, aspect ratio, shadow) while keeping overrides minimal.
2. Ensure the image has `role="img"` and descriptive `alt` text for screen reader support.
3. Provide a skeleton or blurred placeholder while the asset loads to avoid layout jank, potentially via CSS `background-color` or a small `loading="lazy"` + `aria-live` hint.

### 6. Testing & QA
1. Add unit tests for `resolvePortraitSource` verifying each fallback path using the lightweight Node harness (or future testing framework).
2. Manually verify portrait updates when toggling ancestry, class, and gender in the UI; record the steps in `docs/development.md`.
3. Confirm the portrait is responsive in narrow viewports and does not push the form below the fold excessively.

### 7. Documentation & Follow-up
1. Update `docs/status.md` once the feature is implemented to reflect the new portrait system.
2. Create a short contributor guide snippet covering how to add new portrait assets, including naming and compression tips.
3. Capture open questions for future work, such as user-uploaded portraits or integration with remote asset galleries.

## Open Questions
- Should players be able to override the auto-selected portrait with a manual choice or upload?
- Do we need to support animated or multi-frame portraits (e.g., WebP with animation)?
- Should class-specific gear (armor, weapons) be layered dynamically or baked into each image asset?
