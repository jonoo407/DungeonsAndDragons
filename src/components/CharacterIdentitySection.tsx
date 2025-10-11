import { useFormContext, useWatch } from "react-hook-form"
import {
  alignmentOptions,
  type CharacterFormInput,
} from "../schema/character"
import {
  getRaceAbilityBonuses,
  getRaceDefinition,
  races,
} from "../lib/races"
import {
  genderOptions,
  genderLabels,
  type GenderId,
} from "../types/character"

const backgroundSuggestions = [
  "Acolyte",
  "Charlatan",
  "Entertainer",
  "Folk Hero",
  "Guild Artisan",
  "Hermit",
  "Noble",
  "Outlander",
  "Sage",
  "Soldier",
]

export const CharacterIdentitySection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CharacterFormInput>()
  const selectedAncestry = useWatch<CharacterFormInput, "identity.ancestry">({
    name: "identity.ancestry",
  })
  const selectedGenderId = useWatch<CharacterFormInput, "identity.genderId">({
    name: "identity.genderId",
  })
  const selectedRace = getRaceDefinition(selectedAncestry)
  const abilityBonuses = getRaceAbilityBonuses(selectedRace)
  const isCustomGender = selectedGenderId === "custom"

  type IdentityField = keyof CharacterFormInput["identity"]
  const identityErrors = errors.identity as
    | Partial<Record<IdentityField, { message?: string }>>
    | undefined

  const getError = (field: IdentityField) => identityErrors?.[field]?.message

  return (
    <section className="panel panel--span-2">
      <header className="panel__header">
        <h2>Identity & Origins</h2>
        <p>Capture the essentials that define your hero at a glance.</p>
      </header>

      <div className="identity-grid">
        <div className="field field--span-2">
          <label htmlFor="character-name">Character name</label>
          <input
            id="character-name"
            type="text"
            autoComplete="name"
            placeholder="Seraphine Dawnsong"
            {...register("identity.characterName")}
          />
          {getError("characterName") && (
            <p className="field__error">{getError("characterName")}</p>
          )}
        </div>

        <div className="field field--compact">
          <label htmlFor="level">Level</label>
          <input
            id="level"
            type="number"
            min={1}
            max={20}
            {...register("identity.level", { valueAsNumber: true })}
          />
          {getError("level") && <p className="field__error">{getError("level")}</p>}
        </div>

        <div className="field">
          <label htmlFor="ancestry">Ancestry</label>
          <select id="ancestry" {...register("identity.ancestry")}>
            {races.map((race) => (
              <option key={race.id} value={race.id}>
                {race.label}
              </option>
            ))}
          </select>
          {getError("ancestry") && (
            <p className="field__error">{getError("ancestry")}</p>
          )}
          {selectedRace && (
            <div className="race-summary">
              <p className="field__description">
                <strong>Speed:</strong> {selectedRace.speed} ft.
              </p>
              {abilityBonuses.length > 0 && (
                <p className="field__description">
                  <strong>Ability bonuses:</strong>{" "}
                  {abilityBonuses
                    .map((bonus) => `${bonus.amount > 0 ? "+" : ""}${bonus.amount} ${bonus.ability}`)
                    .join(", ")}
                </p>
              )}
              {selectedRace.abilities.length > 0 && (
                <div className="race-summary__traits">
                  <p className="field__description">
                    <strong>Traits</strong>
                  </p>
                  <ul className="race-summary__trait-list">
                    {selectedRace.abilities.map((trait) => (
                      <li key={trait.name}>
                        <span className="race-summary__trait-name">{trait.name}.</span>{" "}
                        <span className="race-summary__trait-description">{trait.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="field">
          <label htmlFor="gender">Gender</label>
          <select id="gender" {...register("identity.genderId")}> 
            {genderOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          {getError("genderId") && (
            <p className="field__error">{getError("genderId")}</p>
          )}
          {selectedGenderId && selectedGenderId !== "custom" && (
            <p className="field__description">
              Displayed as {genderLabels[selectedGenderId as Exclude<GenderId, "custom">]}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="background">Background</label>
          <input
            id="background"
            type="text"
            list="character-background"
            placeholder="Entertainer"
            {...register("identity.background")}
          />
          <datalist id="character-background">
            {backgroundSuggestions.map((background) => (
              <option key={background} value={background} />
            ))}
          </datalist>
          {getError("background") && (
            <p className="field__error">{getError("background")}</p>
          )}
        </div>

        <div className="field">
          <label htmlFor="alignment">Alignment</label>
          <select id="alignment" {...register("identity.alignment")}>
            {alignmentOptions.map((alignment) => (
              <option key={alignment} value={alignment}>
                {alignment}
              </option>
            ))}
          </select>
          {getError("alignment") && (
            <p className="field__error">{getError("alignment")}</p>
          )}
        </div>

        {isCustomGender && (
          <div className="field field--span-2">
            <label htmlFor="custom-gender">Custom gender label</label>
            <input
              id="custom-gender"
              type="text"
              placeholder="Genderfluid guardian"
              {...register("identity.customGenderLabel", { shouldUnregister: true })}
            />
            {getError("customGenderLabel") && (
              <p className="field__error">{getError("customGenderLabel")}</p>
            )}
          </div>
        )}

        <div className="field field--span-2">
          <label htmlFor="player-name">Player</label>
          <input
            id="player-name"
            type="text"
            autoComplete="nickname"
            placeholder="Jon"
            {...register("identity.playerName")}
          />
          {getError("playerName") && (
            <p className="field__error">{getError("playerName")}</p>
          )}
        </div>
      </div>
    </section>
  )
}
