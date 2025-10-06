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
    CombatStatsSection.tsx
  lib/
    dice.ts              # Dice parsing, RNG helpers, method metadata
  schema/
    character.ts         # Zod schema, defaults, alignment/combat options
  types/
    character.ts         # Reusable enums, labels, defaults
```

Public assets live in `public/`; Vite handles asset inlining under `src/assets/`.

## Component Structure

`App.tsx` wraps the sheet in `FormProvider`, exposing:

- **CharacterIdentitySection** – Captures name, class, ancestry, background, alignment, and player info. Uses datalists for quick suggestions and displays inline validation.
- **CombatStatsSection** – Collects AC, initiative bonus, speed, hit points, and hit dice with bounded numeric inputs and helper copy.
- **Ability Score Roller Panel** – Presents dice method selector, optional expression input, and roll trigger.
- **Current Scores Panel** – Renders six ability score cards with calculated modifiers.

Every panel uses the shared `panel` styling for a consistent parchment card aesthetic; components can opt into `panel--span-2` when they should stretch across the grid.

## State & Validation Flow

1. `characterFormSchema` defines `diceMethod`, `diceExpression`, `abilityScores`, `identity`, and `combat`.
2. `useForm` seeds defaults derived from dice utilities, identity constants, and `defaultCombatStats` (AC 12, HP 10, speed 30).
3. When dice method changes, the app recalculates ability scores via `rollAbilityScores` (passing expressions where necessary).
4. Combat inputs stay controlled via React Hook Form and Zod, which clamps numeric ranges and prevents current HP from exceeding max HP.
5. Custom expressions leverage `parseDiceExpression` to ensure safe, bounded rolling before touching form state.

## Dice Utilities

`lib/dice.ts` standardises all rolling logic:

- Supported methods: `custom_expression`, `four_d6_drop_lowest`, `three_d6`, `three_d6_reroll_ones`.
- Expression parser accepts additive/subtractive chains (e.g. `2d6+1d4+3`) with guardrails (`MAX_DICE_COUNT`, `MAX_DICE_SIDES`).
- `isDiceExpressionValid` underpins schema refinements and UI validation, while `rollAbilityScores` outputs an `AbilityScores` map keyed by ability.

## Styling System

Global aesthetics are handled in `App.css` and `index.css`:

- Panel-based grid layout with responsive breakpoints.
- Reusable `.field`, `.field__error`, `.field__description`, and `.helper-text` classes for form elements.
- `.identity-grid` + `.combat-grid` compose responsive column layouts for grouped fields.
- Parchment-inspired palette (creams, browns, violets) reinforces the in-world journal motif.

## Extensibility Notes

- Additional sections should declare dedicated components under `src/components/`.
- Extend `characterFormSchema` incrementally; mirrored types live in `types/character.ts`.
- For advanced dice or combat features (advantage, exploding dice, death saves), expand the schema defaults first, then enhance `parseDiceExpression` and accompanying UI copy so validation stays in sync.
