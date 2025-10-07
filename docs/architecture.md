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
    ClassSelectionSection.tsx
    CombatStatsSection.tsx
  lib/
    classes.ts           # Class metadata, helpers for defaults & summaries
    dice.ts              # Dice parsing, RNG helpers, method metadata
  schema/
    character.ts         # Zod schema, defaults, alignment/combat options
  types/
    character.ts         # Reusable enums, labels, defaults
```

Public assets live in `public/`; Vite handles asset inlining under `src/assets/`.

## Component Structure

`App.tsx` wraps the sheet in `FormProvider`, exposing:

- **CharacterIdentitySection** – Captures name, level, ancestry, background, alignment, and player info. Uses datalists for quick suggestions and displays inline validation.
- **ClassSelectionSection** – Presents a SRD-compliant class list, subclass picker, prepared-spell toggle, and fighting style radios backed by class metadata. Emits helper text describing hit dice, primary abilities, and saving throws.
- **CombatStatsSection** – Collects AC, initiative bonus, speed, hit points, and hit dice with bounded numeric inputs, plus class-aware recommendations and an "apply defaults" action.
- **Ability Score Roller Panel** – Presents dice method selector, optional expression input, and roll trigger; now surfaces the selected class’ primary ability.
- **Current Scores Panel** – Renders six ability score cards with calculated modifiers.

Every panel uses the shared `panel` styling for a consistent parchment card aesthetic; components can opt into `panel--span-2` when they should stretch across the grid.

## State & Validation Flow

1. `characterFormSchema` defines `diceMethod`, `diceExpression`, `abilityScores`, `identity`, `classSelection`, and `combat`.
2. `useForm` seeds defaults derived from dice utilities, identity constants, `defaultClassSelection`, and `defaultCombatStats` (derived from the default class at level 1).
3. When dice method changes, the app recalculates ability scores via `rollAbilityScores` (passing expressions where necessary).
4. Combat inputs stay controlled via React Hook Form and Zod, which clamps numeric ranges, prevents current HP from exceeding max HP, and provides class-derived guidance without forcing overrides.
5. Custom expressions leverage `parseDiceExpression` to ensure safe, bounded rolling before touching form state.

## Dice Utilities

`lib/classes.ts` houses reusable class metadata:

- `CLASS_DEFINITIONS` tracks SRD-friendly class, subclass, fighting style, and spellcasting info.
- `getClassDefaults` returns hit dice strings, baseline hit points, and ability/saving throw summaries.
- `classOptions`, `getSubclassOptions`, and validation helpers ensure the schema + UI stay in sync.

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
