import { useFormContext } from "react-hook-form"
import {
  alignmentOptions,
  type CharacterFormInput,
} from "../schema/character"

const ancestrySuggestions = [
  "Human",
  "Elf",
  "Half-Elf",
  "Dwarf",
  "Halfling",
  "Gnome",
  "Tiefling",
  "Dragonborn",
  "Half-Orc",
  "Goliath",
]

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

        <div className="field">
          <label htmlFor="class-name">Class</label>
          <input
            id="class-name"
            type="text"
            placeholder="Bard"
            {...register("identity.className")}
          />
          {getError("className") && (
            <p className="field__error">{getError("className")}</p>
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
          <input
            id="ancestry"
            type="text"
            list="character-ancestry"
            placeholder="Half-Elf"
            {...register("identity.ancestry")}
          />
          <datalist id="character-ancestry">
            {ancestrySuggestions.map((ancestry) => (
              <option key={ancestry} value={ancestry} />
            ))}
          </datalist>
          {getError("ancestry") && (
            <p className="field__error">{getError("ancestry")}</p>
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
