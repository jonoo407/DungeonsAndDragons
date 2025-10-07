import {
  abilityScoreLabels,
  type AbilityScoreKey,
  type ClassId,
  type ClassOption,
  type FightingStyleOption,
  type SpellcastingMeta,
  type SpellcastingStyle,
  type SubclassOption,
} from "../types/character"

type ClassDefinition = {
  id: ClassId
  label: string
  hitDie: number
  primaryAbility: AbilityScoreKey
  savingThrows: AbilityScoreKey[]
  subclasses?: SubclassOption[]
  spellcasting?: SpellcastingMeta
  fightingStyles?: FightingStyleOption[]
  description?: string
}

type ClassDefinitionRecord = Record<ClassId, ClassDefinition>

const coreFightingStyles: FightingStyleOption[] = [
  { id: "archery", label: "Archery", description: "+2 bonus to ranged attack rolls." },
  { id: "defense", label: "Defense", description: "+1 bonus to AC while wearing armor." },
  { id: "dueling", label: "Dueling", description: "+2 damage with a single one-handed weapon." },
  { id: "great_weapon_fighting", label: "Great Weapon Fighting", description: "Reroll 1s or 2s on two-handed weapon damage." },
  { id: "protection", label: "Protection", description: "Impose disadvantage on attacks vs. allies when using a shield." },
  { id: "two_weapon_fighting", label: "Two-Weapon Fighting", description: "Add ability mod to off-hand damage." },
]

export const CLASS_DEFINITIONS: ClassDefinitionRecord = {
  barbarian: {
    id: "barbarian",
    label: "Barbarian",
    hitDie: 12,
    primaryAbility: "strength",
    savingThrows: ["strength", "constitution"],
    subclasses: [
      { id: "path_of_the_berserker", label: "Path of the Berserker" },
      { id: "path_of_the_totem_warrior", label: "Path of the Totem Warrior" },
      { id: "path_of_wild_magic", label: "Path of Wild Magic" },
    ],
  },
  bard: {
    id: "bard",
    label: "Bard",
    hitDie: 8,
    primaryAbility: "charisma",
    savingThrows: ["dexterity", "charisma"],
    subclasses: [
      { id: "college_of_lore", label: "College of Lore" },
      { id: "college_of_valor", label: "College of Valor" },
      { id: "college_of_glamour", label: "College of Glamour" },
    ],
    spellcasting: {
      style: "spells_known",
      focus: "Instrument or Arcane Focus",
    },
  },
  cleric: {
    id: "cleric",
    label: "Cleric",
    hitDie: 8,
    primaryAbility: "wisdom",
    savingThrows: ["wisdom", "charisma"],
    subclasses: [
      { id: "life_domain", label: "Life Domain" },
      { id: "light_domain", label: "Light Domain" },
      { id: "tempest_domain", label: "Tempest Domain" },
    ],
    spellcasting: {
      style: "prepared",
      focus: "Holy Symbol",
      preparationLabel: "Prepare spells after long rests",
    },
  },
  druid: {
    id: "druid",
    label: "Druid",
    hitDie: 8,
    primaryAbility: "wisdom",
    savingThrows: ["intelligence", "wisdom"],
    subclasses: [
      { id: "circle_of_the_moon", label: "Circle of the Moon" },
      { id: "circle_of_the_land", label: "Circle of the Land" },
      { id: "circle_of_stars", label: "Circle of Stars" },
    ],
    spellcasting: {
      style: "prepared",
      focus: "Druidic Focus",
      preparationLabel: "Prepare spells after long rests",
    },
  },
  fighter: {
    id: "fighter",
    label: "Fighter",
    hitDie: 10,
    primaryAbility: "strength",
    savingThrows: ["strength", "constitution"],
    subclasses: [
      { id: "champion", label: "Champion" },
      { id: "battle_master", label: "Battle Master" },
      { id: "eldritch_knight", label: "Eldritch Knight" },
    ],
    fightingStyles: coreFightingStyles,
  },
  monk: {
    id: "monk",
    label: "Monk",
    hitDie: 8,
    primaryAbility: "dexterity",
    savingThrows: ["strength", "dexterity"],
    subclasses: [
      { id: "way_of_the_open_hand", label: "Way of the Open Hand" },
      { id: "way_of_shadow", label: "Way of Shadow" },
      { id: "way_of_four_elements", label: "Way of the Four Elements" },
    ],
  },
  paladin: {
    id: "paladin",
    label: "Paladin",
    hitDie: 10,
    primaryAbility: "charisma",
    savingThrows: ["wisdom", "charisma"],
    subclasses: [
      { id: "oath_of_devotion", label: "Oath of Devotion" },
      { id: "oath_of_vengeance", label: "Oath of Vengeance" },
      { id: "oath_of_the_ancients", label: "Oath of the Ancients" },
    ],
    spellcasting: {
      style: "prepared",
      focus: "Holy Symbol",
      preparationLabel: "Prepare a limited list of spells",
    },
    fightingStyles: coreFightingStyles.filter((style) =>
      ["defense", "dueling", "great_weapon_fighting", "protection"].includes(style.id),
    ),
  },
  ranger: {
    id: "ranger",
    label: "Ranger",
    hitDie: 10,
    primaryAbility: "dexterity",
    savingThrows: ["strength", "dexterity"],
    subclasses: [
      { id: "hunter", label: "Hunter" },
      { id: "beast_master", label: "Beast Master" },
      { id: "gloom_stalker", label: "Gloom Stalker" },
    ],
    spellcasting: {
      style: "spells_known",
      focus: "Druidic Focus or Component Pouch",
    },
    fightingStyles: coreFightingStyles.filter((style) =>
      ["archery", "defense", "dueling", "two_weapon_fighting"].includes(style.id),
    ),
  },
  rogue: {
    id: "rogue",
    label: "Rogue",
    hitDie: 8,
    primaryAbility: "dexterity",
    savingThrows: ["dexterity", "intelligence"],
    subclasses: [
      { id: "thief", label: "Thief" },
      { id: "assassin", label: "Assassin" },
      { id: "arcane_trickster", label: "Arcane Trickster" },
    ],
  },
  sorcerer: {
    id: "sorcerer",
    label: "Sorcerer",
    hitDie: 6,
    primaryAbility: "charisma",
    savingThrows: ["constitution", "charisma"],
    subclasses: [
      { id: "draconic_bloodline", label: "Draconic Bloodline" },
      { id: "wild_magic", label: "Wild Magic" },
      { id: "divine_soul", label: "Divine Soul" },
    ],
    spellcasting: {
      style: "spells_known",
      focus: "Arcane Focus or Component Pouch",
    },
  },
  warlock: {
    id: "warlock",
    label: "Warlock",
    hitDie: 8,
    primaryAbility: "charisma",
    savingThrows: ["wisdom", "charisma"],
    subclasses: [
      { id: "the_fiend", label: "The Fiend" },
      { id: "the_archfey", label: "The Archfey" },
      { id: "the_great_old_one", label: "The Great Old One" },
    ],
    spellcasting: {
      style: "pact",
      focus: "Arcane Focus or Pact Implement",
    },
  },
  wizard: {
    id: "wizard",
    label: "Wizard",
    hitDie: 6,
    primaryAbility: "intelligence",
    savingThrows: ["intelligence", "wisdom"],
    subclasses: [
      { id: "school_of_evocation", label: "School of Evocation" },
      { id: "school_of_abjuration", label: "School of Abjuration" },
      { id: "bladesinging", label: "Bladesinging" },
    ],
    spellcasting: {
      style: "prepared",
      focus: "Arcane Focus or Spellbook",
      preparationLabel: "Prepare spells from your spellbook",
    },
  },
}

export const classOptions: ClassOption[] = Object.values(CLASS_DEFINITIONS).map(
  ({ id, label }) => ({ id, label }),
)

export const spellcastingStyleLabels: Record<SpellcastingStyle, string> = {
  prepared: "Prepared Spellcasting",
  spells_known: "Spells Known",
  pact: "Pact Magic",
}

export const getClassDefinition = (classId: ClassId): ClassDefinition =>
  CLASS_DEFINITIONS[classId]

export const getSubclassOptions = (classId: ClassId): SubclassOption[] =>
  CLASS_DEFINITIONS[classId].subclasses ?? []

export const getFightingStyleOptions = (classId: ClassId): FightingStyleOption[] =>
  CLASS_DEFINITIONS[classId].fightingStyles ?? []

export const hasPreparedSpellcasting = (classId: ClassId): boolean => {
  const definition = CLASS_DEFINITIONS[classId]
  return definition.spellcasting?.style === "prepared"
}

const averageHitPointsPerLevel = (hitDie: number) => Math.ceil(hitDie / 2) + 1

export interface ClassDefaults {
  hitDie: string
  hitDice: string
  suggestedMaxHitPoints: number
  primaryAbility: AbilityScoreKey
  savingThrows: AbilityScoreKey[]
  spellcasting?: SpellcastingMeta
}

export const getClassDefaults = (
  classId: ClassId,
  level: number,
): ClassDefaults => {
  const definition = getClassDefinition(classId)
  const hitDie = `d${definition.hitDie}`
  const hitDice = `${level}d${definition.hitDie}`
  const baseline = definition.hitDie
  const additionalLevels = Math.max(level - 1, 0)
  const additionalHp = additionalLevels * averageHitPointsPerLevel(definition.hitDie)

  return {
    hitDie,
    hitDice,
    suggestedMaxHitPoints: baseline + additionalHp,
    primaryAbility: definition.primaryAbility,
    savingThrows: definition.savingThrows,
    spellcasting: definition.spellcasting,
  }
}

export const formatSavingThrows = (savingThrows: AbilityScoreKey[]): string =>
  savingThrows.map((key) => abilityScoreLabels[key]).join(", ")

export const abilityKeyToLabel = (key: AbilityScoreKey): string => abilityScoreLabels[key]

export const getClassAbilitySummary = (classId: ClassId): string => {
  const definition = getClassDefinition(classId)
  return abilityScoreLabels[definition.primaryAbility]
}

export const getClassSavingThrowSummary = (classId: ClassId): string =>
  formatSavingThrows(getClassDefinition(classId).savingThrows)

export const isSubclassValid = (classId: ClassId, subclassId: string) =>
  getSubclassOptions(classId).some((option) => option.id === subclassId)

export const isFightingStyleValid = (classId: ClassId, styleId: string) =>
  getFightingStyleOptions(classId).some((option) => option.id === styleId)
