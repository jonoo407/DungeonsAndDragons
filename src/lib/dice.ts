import type { AbilityScores, DiceMethodId, DiceMethodMeta } from "../types/character"
import { abilityScoreKeys } from "../types/character"

export type RandomFn = () => number

interface DiceMethodConfig {
  meta: DiceMethodMeta
  canAutoRoll: boolean
  roll: (random?: RandomFn) => number[]
}

const defaultRandom: RandomFn = () => Math.random()

const rollDie = (sides: number, random: RandomFn = defaultRandom) => Math.floor(random() * sides) + 1

const roll4d6DropLowest = (random: RandomFn = defaultRandom) => {
  const rolls = Array.from({ length: 4 }, () => rollDie(6, random))
  const [_, ...highest] = rolls.sort((a, b) => a - b)
  return highest.reduce((total, current) => total + current, 0)
}

const roll3d6 = (random: RandomFn = defaultRandom) =>
  Array.from({ length: 3 }, () => rollDie(6, random)).reduce((total, current) => total + current, 0)

const roll3d6RerollOnes = (random: RandomFn = defaultRandom) => {
  const dice = Array.from({ length: 3 }, () => {
    let value = rollDie(6, random)
    while (value === 1) {
      value = rollDie(6, random)
    }
    return value
  })

  return dice.reduce((total, current) => total + current, 0)
}

const configs: Record<DiceMethodId, DiceMethodConfig> = {
  custom_expression: {
    meta: {
      id: "custom_expression",
      label: "Custom Expression",
      description: "Enter any dice expression (e.g., 4d6+2) for manual rolls.",
    },
    canAutoRoll: false,
    roll: () => [],
  },
  four_d6_drop_lowest: {
    meta: {
      id: "four_d6_drop_lowest",
      label: "4d6 Drop Lowest",
      description: "Roll 4d6 per score; drop the lowest die before summing.",
    },
    canAutoRoll: true,
    roll: (random = defaultRandom) =>
      Array.from({ length: 6 }, () => roll4d6DropLowest(random)),
  },
  three_d6: {
    meta: {
      id: "three_d6",
      label: "3d6 Classic",
      description: "Roll 3d6 per score; classic old-school method.",
    },
    canAutoRoll: true,
    roll: (random = defaultRandom) =>
      Array.from({ length: 6 }, () => roll3d6(random)),
  },
  three_d6_reroll_ones: {
    meta: {
      id: "three_d6_reroll_ones",
      label: "3d6 Reroll 1s",
      description: "Roll 3d6, reroll each die showing 1 until it is 2+.",
    },
    canAutoRoll: true,
    roll: (random = defaultRandom) =>
      Array.from({ length: 6 }, () => roll3d6RerollOnes(random)),
  },
}

export const diceMethods: DiceMethodMeta[] = Object.values(configs).map((config) => config.meta)

export const getDiceMethod = (id: DiceMethodId) => configs[id]

export const rollAbilityScores = (
  methodId: DiceMethodId,
  random: RandomFn = defaultRandom,
): AbilityScores | null => {
  const config = configs[methodId]

  if (!config.canAutoRoll) {
    return null
  }

  const values = config.roll(random)

  return abilityScoreKeys.reduce<AbilityScores>((accumulator, key, index) => {
    accumulator[key] = values[index] ?? 10
    return accumulator
  }, {} as AbilityScores)
}
