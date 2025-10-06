import { useMemo, useState } from "react"
import {
  abilityScoreKeys,
  abilityScoreLabels,
  type AbilityScores,
  type DiceMethodId,
} from "./types/character"
import { diceMethods, getDiceMethod, rollAbilityScores } from "./lib/dice"
import "./App.css"

const DEFAULT_METHOD: DiceMethodId = "four_d6_drop_lowest"

const abilityMod = (score: number) => Math.floor((score - 10) / 2)

const formatModifier = (modifier: number) => (modifier >= 0 ? `+${modifier}` : `${modifier}`)

function App() {
  const [methodId, setMethodId] = useState<DiceMethodId>(DEFAULT_METHOD)
  const [abilityScores, setAbilityScores] = useState<AbilityScores | null>(
    () => rollAbilityScores(DEFAULT_METHOD),
  )

  const selectedMethod = useMemo(() => getDiceMethod(methodId), [methodId])

  const handleMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextId = event.target.value as DiceMethodId
    setMethodId(nextId)
    setAbilityScores(rollAbilityScores(nextId))
  }

  const handleRollClick = () => {
    setAbilityScores(rollAbilityScores(methodId))
  }

  return (
    <main className="app-shell">
      <section className="panel">
        <header className="panel__header">
          <h1>Ability Score Roller</h1>
          <p>Choose a dice method to seed your character&apos;s six ability scores.</p>
        </header>

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

        <button
          className="reroll-button"
          type="button"
          onClick={handleRollClick}
          disabled={!selectedMethod.canAutoRoll}
        >
          Roll ability scores
        </button>

        {!selectedMethod.canAutoRoll && (
          <p className="helper-text">
            Manual expression input is coming soon—enter rolls by hand until then.
          </p>
        )}
      </section>

      <section className="panel">
        <header className="panel__header">
          <h2>Current Scores</h2>
          <p>{abilityScores ? "Values auto-calculated from your chosen method." : "Awaiting manual entry."}</p>
        </header>

        <div className="scores-grid">
          {abilityScoreKeys.map((key) => {
            const score = abilityScores?.[key]
            const modifier = typeof score === "number" ? abilityMod(score) : null

            return (
              <article className="score-card" key={key}>
                <h3>{abilityScoreLabels[key]}</h3>
                <p className="score-card__score">{score ?? "--"}</p>
                <p className="score-card__modifier">
                  {modifier === null ? "" : formatModifier(modifier)}
                </p>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}

export default App
