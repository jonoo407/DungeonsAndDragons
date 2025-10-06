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

export const abilityScoreDefaultValue = 10

export const defaultDiceExpression = "4d6"

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

export const diceMethodIds: DiceMethodId[] = [
  "custom_expression",
  "four_d6_drop_lowest",
  "three_d6",
  "three_d6_reroll_ones",
]

export type CombatStatKey =
  | "armorClass"
  | "initiativeBonus"
  | "speed"
  | "maxHitPoints"
  | "currentHitPoints"
  | "temporaryHitPoints"
  | "hitDice"

export interface CombatStats {
  armorClass: number
  initiativeBonus: number
  speed: number
  maxHitPoints: number
  currentHitPoints: number
  temporaryHitPoints: number
  hitDice: string
}

export const combatStatKeys: CombatStatKey[] = [
  "armorClass",
  "initiativeBonus",
  "speed",
  "maxHitPoints",
  "currentHitPoints",
  "temporaryHitPoints",
  "hitDice",
]

export const combatStatLabels: Record<CombatStatKey, string> = {
  armorClass: "Armor Class",
  initiativeBonus: "Initiative Bonus",
  speed: "Speed (ft)",
  maxHitPoints: "Max HP",
  currentHitPoints: "Current HP",
  temporaryHitPoints: "Temporary HP",
  hitDice: "Hit Dice",
}
