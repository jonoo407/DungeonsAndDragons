import { z } from "zod"
import {
  abilityScoreDefaultValue,
  abilityScoreKeys,
  classIds,
  defaultDiceExpression,
  genderIds,
  raceIds,
  type RaceId,
  type AbilityScores,
  type ClassId,
  type CombatStats,
  type GenderId,
} from "../types/character"
import {
  getClassDefaults,
  getFightingStyleOptions,
  getSubclassOptions,
  hasPreparedSpellcasting,
  isFightingStyleValid,
  isSubclassValid,
} from "../lib/classes"
import { isDiceExpressionValid } from "../lib/dice"

export const abilityScoresSchema = z.object({
  strength: z.number().int().min(1).max(30),
  dexterity: z.number().int().min(1).max(30),
  constitution: z.number().int().min(1).max(30),
  intelligence: z.number().int().min(1).max(30),
  wisdom: z.number().int().min(1).max(30),
  charisma: z.number().int().min(1).max(30),
})

export const createBlankAbilityScores = (
  initialValue = abilityScoreDefaultValue,
): AbilityScores =>
  abilityScoreKeys.reduce<AbilityScores>((acc, key) => {
    acc[key] = initialValue
    return acc
  }, {} as AbilityScores)

export const alignmentOptions = [
  "Lawful Good",
  "Neutral Good",
  "Chaotic Good",
  "Lawful Neutral",
  "True Neutral",
  "Chaotic Neutral",
  "Lawful Evil",
  "Neutral Evil",
  "Chaotic Evil",
  "Unaligned",
] as const

export const characterIdentitySchema = z.object({
  characterName: z.string().min(1, "Character name is required"),
  level: z
    .number()
    .int()
    .min(1, "Minimum level is 1")
    .max(20, "Maximum adventuring level is 20"),
  ancestry: z.enum(raceIds),
  background: z.string().min(1, "Background is required"),
  alignment: z.enum(alignmentOptions),
  playerName: z.string().min(1, "Player name is required"),
  genderId: z.enum(genderIds),
  customGenderLabel: z
    .string()
    .trim()
    .max(60, "Keep custom gender labels concise")
    .optional()
    .nullable(),
}).superRefine((value, ctx) => {
  if (value.genderId === "custom") {
    const label = value.customGenderLabel?.trim() ?? ""
    if (!label) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["customGenderLabel"],
        message: "Describe your gender when using the custom option",
      })
    }
  }
})

export const classSelectionSchema = z
  .object({
    classId: z.enum(classIds),
    subclassId: z
      .string()
      .trim()
      .min(1, "Choose a subclass")
      .optional()
      .nullable(),
    fightingStyleId: z
      .string()
      .trim()
      .min(1, "Choose a fighting style")
      .optional()
      .nullable(),
    preparesSpells: z.boolean(),
  })
  .superRefine((value, ctx) => {
    const subclassId = value.subclassId?.trim() ?? null
    const fightingStyleId = value.fightingStyleId?.trim() ?? null

    const subclassOptions = getSubclassOptions(value.classId)
    if (subclassOptions.length === 0) {
      if (subclassId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["subclassId"],
          message: "This class does not offer subclasses",
        })
      }
    } else if (!subclassId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["subclassId"],
        message: "Select a subclass for this class",
      })
    } else if (!isSubclassValid(value.classId, subclassId)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["subclassId"],
        message: "Choose a valid subclass option",
      })
    }

    const fightingStyleOptions = getFightingStyleOptions(value.classId)
    if (fightingStyleOptions.length === 0) {
      if (fightingStyleId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["fightingStyleId"],
          message: "This class does not select a fighting style",
        })
      }
    } else if (!fightingStyleId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["fightingStyleId"],
        message: "Pick a fighting style for this class",
      })
    } else if (!isFightingStyleValid(value.classId, fightingStyleId)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["fightingStyleId"],
        message: "Choose a valid fighting style option",
      })
    }

    if (!hasPreparedSpellcasting(value.classId) && value.preparesSpells) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["preparesSpells"],
        message: "This class does not prepare spells",
      })
    }
  })

export const diceMethodSchema = z.union([
  z.literal("custom_expression"),
  z.literal("four_d6_drop_lowest"),
  z.literal("three_d6"),
  z.literal("three_d6_reroll_ones"),
])

export const diceExpressionSchema = z
  .string()
  .trim()
  .refine((value) => {
    // Only validate if the value is not empty
    if (!value || value.length === 0) {
      return true
    }
    return isDiceExpressionValid(value)
  }, {
    message: "Use format like 4d6+2 or 3d8-1",
  })

export const combatStatsSchema = z
  .object({
    armorClass: z.number().int().min(1, "Minimum AC is 1").max(35, "AC cap is 35"),
    initiativeBonus: z
      .number()
      .int()
      .min(-10, "Initiative bonus can drop to -10")
      .max(15, "Initiative bonus is capped at +15"),
    speed: z
      .number()
      .int()
      .min(0, "Speed cannot be negative")
      .max(180, "Speed cap is 180 ft"),
    maxHitPoints: z
      .number()
      .int()
      .min(1, "Max HP must be at least 1")
      .max(999, "Max HP limited to triple digits"),
    currentHitPoints: z
      .number()
      .int()
      .min(0, "Current HP cannot be negative")
      .max(999, "Current HP limited to triple digits"),
    temporaryHitPoints: z
      .number()
      .int()
      .min(0, "Temporary HP cannot be negative")
      .max(999, "Temporary HP limited to triple digits"),
    hitDice: z
      .string()
      .trim()
      .min(2, "Provide hit dice")
      .regex(/^[1-9][0-9]*d(4|6|8|10|12|20)$/i, {
        message: "Use format like 1d8 or 3d10",
      }),
  })
  .superRefine((value, ctx) => {
    if (value.currentHitPoints > value.maxHitPoints) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Current HP cannot exceed max HP",
        path: ["currentHitPoints"],
      })
    }
  })

export const characterFormSchema = z.object({
  diceMethod: diceMethodSchema,
  diceExpression: diceExpressionSchema,
  abilityScores: abilityScoresSchema,
  identity: characterIdentitySchema,
  classSelection: classSelectionSchema,
  combat: combatStatsSchema,
})

export type CharacterFormInput = z.input<typeof characterFormSchema>

export type CharacterFormValues = z.output<typeof characterFormSchema>

export type CharacterIdentity = CharacterFormValues["identity"]

export type CharacterCombat = CharacterFormValues["combat"]

const DEFAULT_LEVEL = 1
const DEFAULT_CLASS_ID: ClassId = "fighter"
const DEFAULT_RACE_ID: RaceId = "human"
const DEFAULT_GENDER_ID: GenderId = "female"

export const defaultCharacterIdentity: CharacterIdentity = {
  characterName: "",
  level: DEFAULT_LEVEL,
  ancestry: DEFAULT_RACE_ID,
  background: "",
  alignment: "Unaligned",
  playerName: "",
  genderId: DEFAULT_GENDER_ID,
  customGenderLabel: "",
}

export type ClassSelection = z.output<typeof classSelectionSchema>

export const defaultClassSelection: ClassSelection = {
  classId: DEFAULT_CLASS_ID,
  subclassId: null,
  fightingStyleId: null,
  preparesSpells: false,
}

const defaultClassDefaults = getClassDefaults(
  defaultClassSelection.classId,
  DEFAULT_LEVEL,
)

export const defaultCombatStats: CombatStats = {
  armorClass: 12,
  initiativeBonus: 0,
  speed: 30,
  maxHitPoints: defaultClassDefaults.suggestedMaxHitPoints,
  currentHitPoints: defaultClassDefaults.suggestedMaxHitPoints,
  temporaryHitPoints: 0,
  hitDice: defaultClassDefaults.hitDice,
}

export const defaultDiceExpressionValue = defaultDiceExpression
