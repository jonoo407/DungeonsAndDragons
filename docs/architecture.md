# Architecture Overview

## Technology Stack

- **React + TypeScript** for component-driven UI with strong typing.
- **Vite** as the build/dev server for fast module bundling and HMR.
- **React Hook Form** managing character sheet state with minimal re-renders.
- **Zod** schemas providing runtime validation + static inference for form data.

## Directory Layout

```
src/
  App.tsx                # Root layout and form provider
  App.css                # Global panel + field styling
  components/
    CharacterIdentitySection.tsx
  lib/
    dice.ts              # Dice parsing, RNG helpers, method metadata
  schema/
    character.ts         # Zod schema, defaults, alignment options
  types/
    character.ts         # Reusable enums, labels, defaults
```

Public assets live in `public/`; Vite handles asset inlining under `src/assets/`.

## Component Structure

`App.tsx` wraps the sheet in `FormProvider`, exposing:

- **CharacterIdentitySection** — Captures name, class, ancestry, background, alignment, and player info. Uses datalists for quick suggestions and displays inline validation.
- **Ability Score Roller Panel** — Presents dice method selector, optional expression input, and roll trigger.
- **Current Scores Panel** — Renders six ability score cards with calculated modifiers.

Future sections (combat, spellbook, equipment, notes) can follow the same `panel` pattern for consistent layout.

## State & Validation Flow

1. `characterFormSchema` defines `diceMethod`, `diceExpression`, `abilityScores`, and `identity`.
2. `useForm` seeds defaults derived from dice utilities and identity constants.
3. When dice method changes, the app recalculates ability scores via `rollAbilityScores` (passing expressions where necessary).
4. Custom expressions leverage `parseDiceExpression` to ensure safe, bounded rolling before touching form state.

## Dice Utilities

`lib/dice.ts` standardises all rolling logic:

- Supported methods: `custom_expression`, `four_d6_drop_lowest`, `three_d6`, `three_d6_reroll_ones`.
- Expression parser accepts additive/subtractive chains (e.g. `2d6+1d4+3`) with guardrails (`MAX_DICE_COUNT`, `MAX_DICE_SIDES`).
- `isDiceExpressionValid` underpins schema refinements and UI validation, while `rollAbilityScores` outputs an `AbilityScores` map keyed by ability.

## Styling System

Global aesthetics are handled in `App.css` and `index.css`:

- Panel-based grid layout with responsive breakpoints.
- Reusable `.field`, `.field__error`, `.field__description`, and `.helper-text` classes for form elements.
- Parchment-inspired palette (creams, browns, violets) to reinforce the in-world journal motif.

## Extensibility Notes

- Additional sections should declare dedicated components under `src/components/`.
- Extend `characterFormSchema` incrementally; mirrored types live in `types/character.ts`.
- For advanced dice features (advantage, exploding dice), expand `parseDiceExpression` with new token types and update validation copy in both schema and UI.
