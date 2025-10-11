import { useMemo } from "react"
import type { ChangeEvent } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  abilityScoreKeys,
  abilityScoreLabels,
  abilityScoreDefaultValue,
  createPortraitId,
  genderLabels,
  type DiceMethodId,
  type GenderId,
} from "./types/character"
import {
  diceMethods,
  getDiceMethod,
  isDiceExpressionValid,
  rollAbilityScores,
} from "./lib/dice"
import { applyRaceBonuses, getRaceDefinition } from "./lib/races"
import {
  formatSavingThrows,
  getClassDefaults,
  getClassDefinition,
} from "./lib/classes"
import {
  characterFormSchema,
  createBlankAbilityScores,
  defaultCharacterIdentity,
  defaultClassSelection,
  defaultCombatStats,
  defaultDiceExpressionValue,
  type CharacterFormInput,
} from "./schema/character"
import { CharacterIdentitySection } from "./components/CharacterIdentitySection"
import { ClassSelectionSection } from "./components/ClassSelectionSection"
import { CombatStatsSection } from "./components/CombatStatsSection"
import { CharacterPortrait } from "./components/CharacterPortrait"
import { resolvePortraitSource } from "./lib/portraits"
import "./App.css"
const DEFAULT_METHOD: DiceMethodId = "four_d6_drop_lowest"

const abilityMod = (score: number) => Math.floor((score - 10) / 2)

const formatModifier = (modifier: number) => (modifier >= 0 ? `+${modifier}` : `${modifier}`)

function App() {
  const initialAbilityScores = useMemo(
    () => rollAbilityScores(DEFAULT_METHOD) ?? createBlankAbilityScores(),
    [],
  )

  const form = useForm<CharacterFormInput>({
    resolver: zodResolver(characterFormSchema),
    defaultValues: {
      diceMethod: DEFAULT_METHOD,
      diceExpression: defaultDiceExpressionValue,
      abilityScores: initialAbilityScores,
      identity: defaultCharacterIdentity,
      classSelection: defaultClassSelection,
      combat: defaultCombatStats,
    },
  })

  const {
    watch,
    setValue,
    getValues,
    setError,
    clearErrors,
    register,
    formState: { errors },
  } = form

  const methodId = watch("diceMethod") ?? DEFAULT_METHOD
  const diceExpression = watch("diceExpression") ?? defaultDiceExpressionValue
  const abilityScores = watch("abilityScores")
  const classSelection = watch("classSelection")
  const level = watch("identity.level") ?? defaultCharacterIdentity.level
  const ancestry = watch("identity.ancestry")
  const genderId = (
    watch("identity.genderId") ?? defaultCharacterIdentity.genderId
  ) as GenderId
  const customGenderLabel =
    watch("identity.customGenderLabel") ?? defaultCharacterIdentity.customGenderLabel
  const selectedMethod = useMemo(() => getDiceMethod(methodId), [methodId])
  const classDefaults = useMemo(() => {
    if (!classSelection) {
      return null
    }

    return getClassDefaults(classSelection.classId, level)
  }, [classSelection, level])
  const classDefinition = useMemo(() => {
    if (!classSelection) {
      return null
    }

    return getClassDefinition(classSelection.classId)
  }, [classSelection])

  const selectedRace = useMemo(() => getRaceDefinition(ancestry), [ancestry])

  const adjustedAbilityScores = useMemo(
    () => applyRaceBonuses(abilityScores, ancestry),
    [abilityScores, ancestry],
  )

  const classId = classSelection?.classId ?? null
  const portraitSource = useMemo(
    () => resolvePortraitSource(createPortraitId(ancestry ?? null, classId, genderId)),
    [ancestry, classId, genderId],
  )
  const portraitGenderLabel = useMemo(() => {
    if (!genderId) {
      return null
    }

    if (genderId === "custom") {
      const trimmed = customGenderLabel?.trim()
      return trimmed && trimmed.length > 0 ? trimmed : "Custom"
    }

    return genderLabels[genderId]
  }, [customGenderLabel, genderId])

  const expressionRegister = register("diceExpression", {
    onChange: () => {
      if (errors.diceExpression) {
        clearErrors("diceExpression")
      }
    },
  })

  const isCustomExpressionValid =
    methodId !== "custom_expression" || isDiceExpressionValid(diceExpression)

  const handleMethodChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextId = event.target.value as DiceMethodId
    setValue("diceMethod", nextId, { shouldDirty: true })

    if (nextId !== "custom_expression") {
      clearErrors("diceExpression")
      // Clear the dice expression field when switching away from custom method
      setValue("diceExpression", defaultDiceExpressionValue, { shouldDirty: true })
    }

    const expression = nextId === "custom_expression" ? getValues("diceExpression") : undefined
    const rolled = rollAbilityScores(nextId, { expression })
    if (rolled) {
      setValue("abilityScores", rolled, { shouldDirty: true })
    } else {
      setValue("abilityScores", createBlankAbilityScores(abilityScoreDefaultValue), {
        shouldDirty: true,
      })
    }
  }

  const handleRollClick = () => {
    if (!selectedMethod.canAutoRoll) {
      return
    }

    if (methodId === "custom_expression") {
      const expression = getValues("diceExpression")
      if (!isDiceExpressionValid(expression)) {
        setError("diceExpression", {
          type: "manual",
          message: "Use format like 4d6+2",
        })
        return
      }

      clearErrors("diceExpression")
      const rolled = rollAbilityScores(methodId, { expression })
      if (rolled) {
        setValue("abilityScores", rolled, { shouldDirty: true })
      }
      return
    }

    const rolled = rollAbilityScores(methodId)
    if (rolled) {
      setValue("abilityScores", rolled, { shouldDirty: true })
    }
  }

  const diceExpressionError = errors.diceExpression?.message
  const rollDisabled = !selectedMethod.canAutoRoll || !isCustomExpressionValid

  return (
    <FormProvider {...form}>
      <main className="app-shell">
        <section className="panel panel--span-2 hero-header">
          <CharacterPortrait
            source={portraitSource}
            ancestryLabel={selectedRace?.label}
            classLabel={classDefinition?.label}
            genderLabel={portraitGenderLabel}
          />
        </section>
        <CharacterIdentitySection />
        <ClassSelectionSection />
        <CombatStatsSection />

        <section className="panel">
          <header className="panel__header">
            <h2>Ability Score Roller</h2>
            <p>Choose a dice method to seed your character&apos;s six ability scores.</p>
          </header>

          {classDefaults && classDefinition && (
            <p className="helper-text helper-text--muted">
              The {classDefinition.label} favors {abilityScoreLabels[classDefaults.primaryAbility]}
              {" "}
              and is proficient in {formatSavingThrows(classDefaults.savingThrows)} saving throws.
              Consider prioritising that ability when you assign rolls.
            </p>
          )}

          <div className="method-picker">
            <label htmlFor="dice-method">Dice method</label>
            <select id="dice-method" value={methodId} onChange={handleMethodChange}>
              {diceMethods.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.label}
                </option>
              ))}
            </select>
            <p className="method-picker__description">{selectedMethod.meta.description}</p>
          </div>

          {methodId === "custom_expression" && (
            <div className="field">
              <label htmlFor="dice-expression">Dice expression</label>
              <input
                id="dice-expression"
                type="text"
                placeholder="e.g. 4d6+2"
                {...expressionRegister}
              />
              <p className="field__description">
                Supports addition/subtraction and multiple dice terms (e.g. 2d6+1d4+3).
              </p>
              {diceExpressionError && <p className="field__error">{diceExpressionError}</p>}
            </div>
          )}

          <button
            className="reroll-button"
            type="button"
            onClick={handleRollClick}
            disabled={rollDisabled}
          >
            Roll ability scores
          </button>

          {methodId === "custom_expression" && !diceExpressionError && (
            <p className="helper-text helper-text--muted">
              We&apos;ll roll the expression six times to fill each ability score.
            </p>
          )}
        </section>

        <section className="panel">
          <header className="panel__header">
            <h2>Current Scores</h2>
            <p>Values generated from your chosen method. Edit them once the full sheet is live.</p>
          </header>

          {selectedRace && (
            <p className="scores-note">
              Racial bonuses from the {selectedRace.label} ancestry are applied to these totals.
            </p>
          )}

          <div className="scores-grid">
            {abilityScoreKeys.map((key) => {
              const score = adjustedAbilityScores?.[key] ?? abilityScoreDefaultValue
              const modifier = abilityMod(score)

              return (
                <article className="score-card" key={key}>
                  <h3>{abilityScoreLabels[key]}</h3>
                  <p className="score-card__score">{score}</p>
                  <p className="score-card__modifier">{formatModifier(modifier)}</p>
                </article>
              )
            })}
          </div>
        </section>
      </main>
    </FormProvider>
  )
}

export default App

