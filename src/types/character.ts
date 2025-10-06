export type AbilityScoreKey =
  | "strength"
  | "dexterity"
  | "constitution"
  | "intelligence"
  | "wisdom"
  | "charisma"

export type AbilityScores = Record<AbilityScoreKey, number>

export const abilityScoreKeys: AbilityScoreKey[] = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
]

export const abilityScoreLabels: Record<AbilityScoreKey, string> = {
  strength: "Strength",
  dexterity: "Dexterity",
  constitution: "Constitution",
  intelligence: "Intelligence",
  wisdom: "Wisdom",
  charisma: "Charisma",
}

export type DiceMethodId =
  | "custom_expression"
  | "four_d6_drop_lowest"
  | "three_d6"
  | "three_d6_reroll_ones"

export interface DiceMethodMeta {
  id: DiceMethodId
  label: string
  description: string
}
