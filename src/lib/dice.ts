import type { AbilityScores, DiceMethodId, DiceMethodMeta } from "../types/character"
import { abilityScoreKeys } from "../types/character"

export type RandomFn = () => number

interface DiceMethodConfig {
  meta: DiceMethodMeta
  canAutoRoll: boolean
  roll: (options?: RollOptions) => number[] | null
}

interface DiceTerm {
  kind: "dice"
  count: number
  sides: number
  sign: number
}

interface ConstantTerm {
  kind: "constant"
  value: number
  sign: number
}

type ParsedDiceExpression = Array<DiceTerm | ConstantTerm>

export interface RollOptions {
  random?: RandomFn
  expression?: string
}

const defaultRandom: RandomFn = () => Math.random()

const rollDie = (sides: number, random: RandomFn = defaultRandom) => Math.floor(random() * sides) + 1

const roll4d6DropLowest = (random: RandomFn = defaultRandom) => {
  const rolls = Array.from({ length: 4 }, () => rollDie(6, random))
  const [, ...highest] = rolls.sort((a, b) => a - b)
  return highest.reduce((total, current) => total + current, 0)
}

const roll3d6 = (random: RandomFn = defaultRandom) =>
  Array.from({ length: 3 }, () => rollDie(6, random)).reduce((total, current) => total + current, 0)

const roll3d6RerollOnes = (random: RandomFn = defaultRandom) => {
  const dice = Array.from({ length: 3 }, () => {
    let value = rollDie(6, random)
    let rerollCount = 0
    const maxRerolls = 100 // Safety limit to prevent infinite loops
    
    while (value === 1 && rerollCount < maxRerolls) {
      value = rollDie(6, random)
      rerollCount++
    }
    
    // If we hit the limit, use 2 as a fallback (minimum valid die result)
    return rerollCount >= maxRerolls ? 2 : value
  })

  return dice.reduce((total, current) => total + current, 0)
}

const MAX_DICE_COUNT = 100
const MAX_DICE_SIDES = 1000

const DICE_TOKEN_REGEX = /^([1-9][0-9]*|)d([1-9][0-9]*)$/i

export const parseDiceExpression = (expression: string): ParsedDiceExpression | null => {
  const sanitized = expression.replace(/\s+/g, "").toLowerCase()
  if (!sanitized) {
    return null
  }

  const tokens = sanitized.match(/([+-]?[^+-]+)/g)
  if (!tokens) {
    return null
  }

  const parsed: ParsedDiceExpression = []

  for (const rawToken of tokens) {
    if (!rawToken) {
      return null
    }

    let token = rawToken
    let sign = 1

    if (token.startsWith("+")) {
      token = token.slice(1)
    } else if (token.startsWith("-")) {
      sign = -1
      token = token.slice(1)
    }

    if (!token) {
      return null
    }

    const diceMatch = token.match(DICE_TOKEN_REGEX)
    if (diceMatch) {
      const countValue = diceMatch[1]
      const sidesValue = diceMatch[2]

      // Additional validation: reject values with leading zeros (e.g. 01d6)
      if (countValue && countValue.length > 1 && countValue.startsWith("0")) {
        return null
      }
      if (sidesValue.length > 1 && sidesValue.startsWith("0")) {
        return null
      }

      const count = countValue === "" ? 1 : Number.parseInt(countValue, 10)
      const sides = Number.parseInt(sidesValue, 10)

      if (!Number.isFinite(count) || !Number.isFinite(sides)) {
        return null
      }

      if (count <= 0 || count > MAX_DICE_COUNT) {
        return null
      }

      if (sides <= 1 || sides > MAX_DICE_SIDES) {
        return null
      }

      parsed.push({ kind: "dice", count, sides, sign })
      continue
    }

    if (!/^\d+$/.test(token)) {
      return null
    }

    const constantValue = Number.parseInt(token, 10)
    if (!Number.isFinite(constantValue)) {
      return null
    }

    parsed.push({ kind: "constant", value: constantValue, sign })
  }

  return parsed
}

const rollParsedExpression = (parsed: ParsedDiceExpression, random: RandomFn = defaultRandom) => {
  let total = 0

  for (const term of parsed) {
    if (term.kind === "dice") {
      for (let i = 0; i < term.count; i += 1) {
        total += rollDie(term.sides, random) * term.sign
      }
    } else {
      total += term.value * term.sign
    }
  }

  return total
}

export const isDiceExpressionValid = (expression: string) => parseDiceExpression(expression) !== null

const configs: Record<DiceMethodId, DiceMethodConfig> = {
  custom_expression: {
    meta: {
      id: "custom_expression",
      label: "Custom Expression",
      description: "Enter any dice expression (e.g., 4d6+2) then roll for each score.",
    },
    canAutoRoll: true,
    roll: (options = {}) => {
      const { expression = "", random = defaultRandom } = options
      const parsed = parseDiceExpression(expression)
      if (!parsed) {
        return null
      }

      return Array.from({ length: 6 }, () => rollParsedExpression(parsed, random))
    },
  },
  four_d6_drop_lowest: {
    meta: {
      id: "four_d6_drop_lowest",
      label: "4d6 Drop Lowest",
      description: "Roll 4d6 per score; drop the lowest die before summing.",
    },
    canAutoRoll: true,
    roll: ({ random = defaultRandom } = {}) =>
      Array.from({ length: 6 }, () => roll4d6DropLowest(random)),
  },
  three_d6: {
    meta: {
      id: "three_d6",
      label: "3d6 Classic",
      description: "Roll 3d6 per score; classic old-school method.",
    },
    canAutoRoll: true,
    roll: ({ random = defaultRandom } = {}) =>
      Array.from({ length: 6 }, () => roll3d6(random)),
  },
  three_d6_reroll_ones: {
    meta: {
      id: "three_d6_reroll_ones",
      label: "3d6 Reroll 1s",
      description: "Roll 3d6, reroll each die showing 1 until it is 2+.",
    },
    canAutoRoll: true,
    roll: ({ random = defaultRandom } = {}) =>
      Array.from({ length: 6 }, () => roll3d6RerollOnes(random)),
  },
}

export const diceMethods: DiceMethodMeta[] = Object.values(configs).map((config) => config.meta)

export const getDiceMethod = (id: DiceMethodId) => configs[id]

export const rollAbilityScores = (
  methodId: DiceMethodId,
  options: RollOptions = {},
): AbilityScores | null => {
  const config = configs[methodId]

  if (!config) {
    return null
  }

  const values = config.roll(options)

  if (!values) {
    return null
  }

  return abilityScoreKeys.reduce<AbilityScores>((accumulator, key, index) => {
    accumulator[key] = values[index] ?? 10
    return accumulator
  }, {} as AbilityScores)
}
