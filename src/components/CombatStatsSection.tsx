import { useFormContext, useWatch } from "react-hook-form"
import type { CombatStatKey } from "../types/character"
import { combatStatLabels } from "../types/character"
import type { CharacterFormInput } from "../schema/character"
import { getClassDefaults } from "../lib/classes"

interface CombatFieldConfig {
  key: CombatStatKey
  type: "number" | "text"
  placeholder?: string
  description?: string
  min?: number
  max?: number
}

const combatFieldConfig: CombatFieldConfig[] = [
  {
    key: "armorClass",
    type: "number",
    placeholder: "16",
    description: "Base AC including armor, shield, and miscellaneous bonuses.",
    min: 1,
    max: 35,
  },
  {
    key: "initiativeBonus",
    type: "number",
    placeholder: "2",
    description: "Dexterity modifier plus any class features or feats.",
    min: -10,
    max: 15,
  },
  {
    key: "speed",
    type: "number",
    placeholder: "30",
    description: "Base walking speed in feet.",
    min: 0,
    max: 180,
  },
  {
    key: "maxHitPoints",
    type: "number",
    placeholder: "24",
    min: 1,
    max: 999,
  },
  {
    key: "currentHitPoints",
    type: "number",
    placeholder: "24",
    min: 0,
    max: 999,
  },
  {
    key: "temporaryHitPoints",
    type: "number",
    placeholder: "0",
    description: "Temporary HP from spells or features; clears on long rest.",
    min: 0,
    max: 999,
  },
  {
    key: "hitDice",
    type: "text",
    placeholder: "1d8",
    description: "Hit dice per level, e.g. 1d8 for Bards, 1d10 for Fighters.",
  },
]

const numberFieldKeys = new Set<CombatStatKey>([
  "armorClass",
  "initiativeBonus",
  "speed",
  "maxHitPoints",
  "currentHitPoints",
  "temporaryHitPoints",
])

const getFieldClassName = (key: CombatStatKey) =>
  key === "hitDice" ? "field field--span-2" : "field"

export const CombatStatsSection = () => {
  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<CharacterFormInput>()
  const classSelection = useWatch<CharacterFormInput, "classSelection">({
    control,
    name: "classSelection",
  })
  const level =
    useWatch<CharacterFormInput, "identity.level">({
      control,
      name: "identity.level",
    }) ?? 1
  const combatValues = useWatch<CharacterFormInput, "combat">({
    control,
    name: "combat",
  })

  const classDefaults = classSelection
    ? getClassDefaults(classSelection.classId, level)
    : null

  const recommendedHitDice = classDefaults?.hitDice ?? null
  const recommendedMaxHp = classDefaults?.suggestedMaxHitPoints ?? null

  const hitDiceMismatch = Boolean(
    recommendedHitDice && combatValues?.hitDice !== recommendedHitDice,
  )
  const maxHpMismatch = Boolean(
    typeof recommendedMaxHp === "number" &&
      combatValues?.maxHitPoints !== undefined &&
      combatValues.maxHitPoints !== recommendedMaxHp,
  )

  const needsSync = Boolean(hitDiceMismatch || maxHpMismatch)

  const applyClassDefaults = () => {
    if (!classDefaults) {
      return
    }

    setValue("combat.hitDice", classDefaults.hitDice, {
      shouldDirty: true,
      shouldValidate: true,
    })
    setValue("combat.maxHitPoints", classDefaults.suggestedMaxHitPoints, {
      shouldDirty: true,
      shouldValidate: true,
    })

    const currentHp = combatValues?.currentHitPoints ?? 0
    const currentMaxHp = combatValues?.maxHitPoints ?? 0
    if (
      currentHp > classDefaults.suggestedMaxHitPoints ||
      currentHp === currentMaxHp
    ) {
      setValue("combat.currentHitPoints", classDefaults.suggestedMaxHitPoints, {
        shouldDirty: true,
        shouldValidate: true,
      })
    }
  }

  type CombatErrors = Partial<Record<CombatStatKey, { message?: string }>> | undefined

  const combatErrors = errors.combat as CombatErrors

  const getError = (field: CombatStatKey) => combatErrors?.[field]?.message

  return (
    <section className="panel panel--span-2">
      <header className="panel__header">
        <h2>Combat Readiness</h2>
        <p>Track defenses, mobility, and hit point pools before the next battle.</p>
      </header>

      <div className="combat-grid">
        {combatFieldConfig.map(({ key, type, placeholder, description, min, max }) => (
          <div className={getFieldClassName(key)} key={key}>
            <label htmlFor={`combat-${key}`}>{combatStatLabels[key]}</label>
            <input
              id={`combat-${key}`}
              type={type}
              inputMode={type === "number" ? "numeric" : undefined}
              placeholder={placeholder}
              min={type === "number" ? min : undefined}
              max={type === "number" ? max : undefined}
              step={type === "number" ? 1 : undefined}
              {...register(`combat.${key}`, {
                valueAsNumber: numberFieldKeys.has(key),
              })}
            />
            {description && <p className="field__description">{description}</p>}
            {getError(key) && <p className="field__error">{getError(key)}</p>}
          </div>
        ))}
      </div>

      <div className="helper-text helper-text--muted helper-text--stack">
        <p>
          Initiative is stored as a bonus; the tracker will roll d20 + bonus in a future
          iteration.
        </p>
        {classDefaults && (
          <p>
            Recommended for your class: {classDefaults.hitDice} hit dice and {classDefaults.suggestedMaxHitPoints}
            {" "}
            max HP at level {level}.
          </p>
        )}
        {classDefaults && (
          <button
            className="button"
            type="button"
            onClick={applyClassDefaults}
            disabled={!needsSync}
          >
            Apply class defaults
          </button>
        )}
      </div>
    </section>
  )
}
