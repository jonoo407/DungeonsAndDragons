import { useFormContext } from "react-hook-form"
import type { CombatStatKey } from "../types/character"
import { combatStatLabels } from "../types/character"
import type { CharacterFormInput } from "../schema/character"

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
    formState: { errors },
  } = useFormContext<CharacterFormInput>()

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

      <p className="helper-text helper-text--muted">
        Initiative is stored as a bonus; the tracker will roll d20 + bonus in a future iteration.
      </p>
    </section>
  )
}
