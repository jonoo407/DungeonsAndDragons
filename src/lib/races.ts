import {
  abilityScoreDefaultValue,
  abilityScoreKeys,
  abilityScoreLabels,
  type AbilityScores,
  type AbilityScoreKey,
  type RaceDefinition,
  type RaceId,
  raceIds,
} from "../types/character"

const createDefinition = (definition: RaceDefinition): RaceDefinition => definition

const raceDefinitionMap: Record<RaceId, RaceDefinition> = {
  human: createDefinition({
    id: "human",
    label: "Human",
    speed: 30,
    abilityBonuses: abilityScoreKeys.reduce<Partial<Record<AbilityScoreKey, number>>>(
      (acc, key) => {
        acc[key] = 1
        return acc
      },
      {},
    ),
    abilities: [
      {
        name: "Versatile",
        description: "Humans excel at adapting to challenges, gaining proficiency in one additional skill of your choice.",
      },
      {
        name: "Ambition",
        description: "Gain one extra talent or feat whenever the campaign awards feats for advancement.",
      },
    ],
  }),
  dwarf: createDefinition({
    id: "dwarf",
    label: "Dwarf",
    speed: 25,
    abilityBonuses: {
      constitution: 2,
      wisdom: 1,
    },
    abilities: [
      {
        name: "Dwarven Resilience",
        description: "Advantage on saving throws against poison and resistance to poison damage.",
      },
      {
        name: "Stonecunning",
        description: "Double your proficiency bonus on History checks related to stonework.",
      },
    ],
  }),
  half_orc: createDefinition({
    id: "half_orc",
    label: "Half-Orc",
    speed: 30,
    abilityBonuses: {
      strength: 2,
      constitution: 1,
    },
    abilities: [
      {
        name: "Relentless Endurance",
        description: "When reduced to 0 hit points, drop to 1 hit point instead (once per long rest).",
      },
      {
        name: "Savage Attacks",
        description: "Add an extra weapon damage die when you score a critical hit with a melee attack.",
      },
    ],
  }),
  elf: createDefinition({
    id: "elf",
    label: "Elf",
    speed: 30,
    abilityBonuses: {
      dexterity: 2,
      intelligence: 1,
    },
    abilities: [
      {
        name: "Fey Ancestry",
        description: "Advantage on saving throws against being charmed, and magic can’t put you to sleep.",
      },
      {
        name: "Keen Senses",
        description: "Proficiency in the Perception skill.",
      },
    ],
  }),
  half_elf: createDefinition({
    id: "half_elf",
    label: "Half-Elf",
    speed: 30,
    abilityBonuses: {
      charisma: 2,
      dexterity: 1,
      wisdom: 1,
    },
    abilities: [
      {
        name: "Dual Heritage",
        description: "Gain proficiency in two skills of your choice.",
      },
      {
        name: "Fey Ancestry",
        description: "Advantage on saving throws against being charmed, and magic can’t put you to sleep.",
      },
    ],
  }),
  gnome: createDefinition({
    id: "gnome",
    label: "Gnome",
    speed: 25,
    abilityBonuses: {
      intelligence: 2,
      dexterity: 1,
    },
    abilities: [
      {
        name: "Gnome Cunning",
        description: "Advantage on all Intelligence, Wisdom, and Charisma saving throws against magic.",
      },
      {
        name: "Tinker",
        description: "You can construct tiny clockwork devices given an hour and appropriate materials.",
      },
    ],
  }),
  lizard_man: createDefinition({
    id: "lizard_man",
    label: "Lizard-Man",
    speed: 30,
    abilityBonuses: {
      constitution: 2,
      wisdom: 1,
    },
    abilities: [
      {
        name: "Aquatic Adaptation",
        description: "You can hold your breath for up to 15 minutes and have a swimming speed equal to your walking speed.",
      },
      {
        name: "Natural Armor",
        description: "When unarmored, your base AC is 13 + your Dexterity modifier.",
      },
    ],
  }),
}

export const races: RaceDefinition[] = raceIds.map((id) => raceDefinitionMap[id])

export const getRaceDefinition = (id: RaceId | null | undefined): RaceDefinition | null => {
  if (!id) {
    return null
  }

  return raceDefinitionMap[id]
}

export interface RaceAbilityBonus {
  ability: string
  amount: number
}

export const getRaceAbilityBonuses = (
  race: RaceDefinition | null,
): RaceAbilityBonus[] => {
  if (!race) {
    return []
  }

  return abilityScoreKeys
    .map((key) => {
      const amount = race.abilityBonuses[key] ?? 0
      return {
        ability: abilityScoreLabels[key],
        amount,
      }
    })
    .filter((entry) => entry.amount !== 0)
}

export const applyRaceBonuses = (
  baseScores: AbilityScores | null | undefined,
  raceId: RaceId | null | undefined,
): AbilityScores => {
  const race = getRaceDefinition(raceId)
  const base = abilityScoreKeys.reduce<AbilityScores>((acc, key) => {
    const fallback = baseScores?.[key] ?? abilityScoreDefaultValue
    acc[key] = fallback
    if (race) {
      acc[key] += race.abilityBonuses[key] ?? 0
    }
    return acc
  }, {} as AbilityScores)

  return base
}
