import { useMemo, useRef } from "react"
import type { ChangeEvent } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import type { ClassId } from "../types/character"
import { abilityScoreLabels } from "../types/character"
import type { CharacterFormInput } from "../schema/character"
import {
  classOptions,
  formatSavingThrows,
  getClassDefaults,
  getClassDefinition,
  getFightingStyleOptions,
  getSubclassOptions,
  hasPreparedSpellcasting,
  spellcastingStyleLabels,
} from "../lib/classes"

type ClassSelectionField = keyof CharacterFormInput["classSelection"]

type ClassSelectionErrors =
  | Partial<Record<ClassSelectionField, { message?: string }>>
  | undefined

type SelectionMemory = Partial<Record<ClassId, string | null>>
type PreparationMemory = Partial<Record<ClassId, boolean>>

export const ClassSelectionSection = () => {
  const {
    register,
    setValue,
    clearErrors,
    getValues,
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

  const selectedClassId = classSelection?.classId
  const classDefinition = selectedClassId
    ? getClassDefinition(selectedClassId)
    : null
  const subclassOptions = selectedClassId
    ? getSubclassOptions(selectedClassId)
    : []
  const fightingStyleOptions = selectedClassId
    ? getFightingStyleOptions(selectedClassId)
    : []
  const classDefaults = useMemo(() => {
    if (!selectedClassId) {
      return null
    }

    return getClassDefaults(selectedClassId, level)
  }, [selectedClassId, level])

  const classSelectionErrors = errors.classSelection as ClassSelectionErrors
  const getError = (field: ClassSelectionField) =>
    classSelectionErrors?.[field]?.message

  const subclassMemory = useRef<SelectionMemory>({})
  const fightingStyleMemory = useRef<SelectionMemory>({})
  const preparationMemory = useRef<PreparationMemory>({})

  const showSubclassPicker = subclassOptions.length > 0
  const showFightingStyles = fightingStyleOptions.length > 0
  const showPreparationToggle = Boolean(
    selectedClassId && hasPreparedSpellcasting(selectedClassId),
  )

  const classIdRegister = register("classSelection.classId", {
    onChange: (event: ChangeEvent<HTMLSelectElement>) => {
      const currentClassId = getValues("classSelection.classId") as ClassId | null
      if (currentClassId) {
        subclassMemory.current[currentClassId] =
          getValues("classSelection.subclassId") ?? null
        fightingStyleMemory.current[currentClassId] =
          getValues("classSelection.fightingStyleId") ?? null
        preparationMemory.current[currentClassId] = getValues(
          "classSelection.preparesSpells",
        )
      }

      const nextClass = event.target.value as ClassId

      const nextSubclass = subclassMemory.current[nextClass] ?? null
      const nextFightingStyle = fightingStyleMemory.current[nextClass] ?? null
      const storedPreparation = preparationMemory.current[nextClass]
      const shouldPrepare = hasPreparedSpellcasting(nextClass)

      // Batch all setValue calls to prevent race conditions
      setValue("classSelection.subclassId", nextSubclass, {
        shouldDirty: true,
        shouldValidate: false, // Defer validation until all values are set
      })
      setValue("classSelection.fightingStyleId", nextFightingStyle, {
        shouldDirty: true,
        shouldValidate: false, // Defer validation until all values are set
      })
      setValue(
        "classSelection.preparesSpells",
        shouldPrepare ? storedPreparation ?? true : false,
        {
          shouldDirty: true,
          shouldValidate: true, // Only validate the last setValue call
        },
      )
      clearErrors([
        "classSelection.subclassId",
        "classSelection.fightingStyleId",
        "classSelection.preparesSpells",
      ])
    },
  })

  const subclassRegister = register("classSelection.subclassId", {
    setValueAs: (value: string | null) => (value ? value : null),
    onChange: (event: ChangeEvent<HTMLSelectElement>) => {
      if (!selectedClassId) {
        return
      }
      const value = event.target.value
      subclassMemory.current[selectedClassId] = value ? value : null
    },
  })

  const fightingStyleRegister = register("classSelection.fightingStyleId", {
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      if (!selectedClassId) {
        return
      }
      const value = event.target.value
      fightingStyleMemory.current[selectedClassId] = value ? value : null
    },
  })

  const preparationRegister = register("classSelection.preparesSpells", {
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      if (!selectedClassId) {
        return
      }
      preparationMemory.current[selectedClassId] = event.target.checked
    },
  })

  const metadataSegments = useMemo(() => {
    if (!classDefaults) {
      return [] as string[]
    }

    const segments: string[] = [
      `Hit Die: ${classDefaults.hitDie}`,
      `Primary Ability: ${abilityScoreLabels[classDefaults.primaryAbility]}`,
      `Saving Throws: ${formatSavingThrows(classDefaults.savingThrows)}`,
    ]

    if (classDefaults.spellcasting) {
      const styleLabel = spellcastingStyleLabels[classDefaults.spellcasting.style]
      const focusLabel = classDefaults.spellcasting.focus
      segments.push(
        focusLabel ? `${styleLabel} (${focusLabel})` : styleLabel,
      )
    }

    return segments
  }, [classDefaults])

  return (
    <section className="panel panel--span-2">
      <header className="panel__header">
        <h2>Class & Archetype</h2>
        <p>Choose a class to unlock archetypes, spellcasting notes, and combat defaults.</p>
      </header>

      {metadataSegments.length > 0 && (
        <p className="helper-text helper-text--muted">
          {metadataSegments.join(" • ")}
        </p>
      )}

      <div className="class-grid">
        <div className="field">
          <label htmlFor="character-class">Class</label>
          <select id="character-class" {...classIdRegister}>
            {classOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {showSubclassPicker && (
          <div className="field">
            <label htmlFor="character-subclass">Subclass</label>
            <select id="character-subclass" {...subclassRegister}>
              <option value="">Select a subclass</option>
              {subclassOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            {getError("subclassId") && (
              <p className="field__error">{getError("subclassId")}</p>
            )}
          </div>
        )}

        {showFightingStyles && (
          <div className="field field--span-2">
            <span className="field__label">Fighting Style</span>
            <div className="option-stack">
              {fightingStyleOptions.map((option) => (
                <label className="option-card" key={option.id}>
                  <input
                    type="radio"
                    value={option.id}
                    {...fightingStyleRegister}
                    checked={classSelection?.fightingStyleId === option.id}
                  />
                  <div>
                    <p className="option-card__label">{option.label}</p>
                    {option.description && (
                      <p className="option-card__description">{option.description}</p>
                    )}
                  </div>
                </label>
              ))}
            </div>
            {getError("fightingStyleId") && (
              <p className="field__error">{getError("fightingStyleId")}</p>
            )}
          </div>
        )}

        {showPreparationToggle && (
          <div className="field field--span-2">
            <label className="checkbox-field">
              <input
                type="checkbox"
                {...preparationRegister}
                checked={classSelection?.preparesSpells ?? false}
              />
              <span>Track prepared spells for this class</span>
            </label>
            {classDefinition?.spellcasting?.preparationLabel && (
              <p className="field__description">
                {classDefinition.spellcasting.preparationLabel}
              </p>
            )}
            {getError("preparesSpells") && (
              <p className="field__error">{getError("preparesSpells")}</p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
