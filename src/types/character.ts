export type AbilityScoreKey =
  | "strength"
  | "dexterity"
  | "constitution"
  | "intelligence"
  | "wisdom"
  | "charisma"

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

export type AbilityScores = Record<AbilityScoreKey, number>

export const abilityScoreDefaultValue = 10

export const defaultDiceExpression = "4d6"

export const raceIds = [
  "human",
  "dwarf",
  "half_orc",
  "elf",
  "half_elf",
  "gnome",
  "lizard_man",
] as const

export type RaceId = (typeof raceIds)[number]

export interface RaceAbility {
  name: string
  description: string
}

export interface RaceDefinition {
  id: RaceId
  label: string
  speed: number
  abilityBonuses: Partial<Record<AbilityScoreKey, number>>
  abilities: RaceAbility[]
}

export const classIds = [
  "barbarian",
  "bard",
  "cleric",
  "druid",
  "fighter",
  "monk",
  "paladin",
  "ranger",
  "rogue",
  "sorcerer",
  "warlock",
  "wizard",
] as const

export type ClassId = (typeof classIds)[number]

export interface ClassOption {
  id: ClassId
  label: string
}

export interface SubclassOption {
  id: string
  label: string
  description?: string
}

export type SpellcastingStyle = "prepared" | "spells_known" | "pact"

export interface SpellcastingMeta {
  style: SpellcastingStyle
  focus?: string
  preparationLabel?: string
}

export interface FightingStyleOption {
  id: string
  label: string
  description?: string
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
