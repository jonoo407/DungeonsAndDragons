import { z } from "zod"
import {
  abilityScoreDefaultValue,
  abilityScoreKeys,
  defaultDiceExpression,
  type AbilityScores,
} from "../types/character"
import { isDiceExpressionValid } from "../lib/dice"

export const abilityScoresSchema = z.object({
  strength: z.number().int().min(1).max(30),
  dexterity: z.number().int().min(1).max(30),
  constitution: z.number().int().min(1).max(30),
  intelligence: z.number().int().min(1).max(30),
  wisdom: z.number().int().min(1).max(30),
  charisma: z.number().int().min(1).max(30),
})

export const createBlankAbilityScores = (initialValue = abilityScoreDefaultValue): AbilityScores =>
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
  className: z.string().min(1, "Class is required"),
  level: z.number().int().min(1, "Minimum level is 1").max(20, "Maximum adventuring level is 20"),
  ancestry: z.string().min(1, "Ancestry is required"),
  background: z.string().min(1, "Background is required"),
  alignment: z.enum(alignmentOptions),
  playerName: z.string().min(1, "Player name is required"),
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
  .min(1, "Provide a dice expression")
  .refine(isDiceExpressionValid, {
    message: "Use format like 4d6+2 or 3d8-1",
  })

export const characterFormSchema = z.object({
  diceMethod: diceMethodSchema,
  diceExpression: diceExpressionSchema,
  abilityScores: abilityScoresSchema,
  identity: characterIdentitySchema,
})

export type CharacterFormInput = z.input<typeof characterFormSchema>

export type CharacterFormValues = z.output<typeof characterFormSchema>

export type CharacterIdentity = CharacterFormValues["identity"]

export const defaultCharacterIdentity: CharacterIdentity = {
  characterName: "",
  className: "",
  level: 1,
  ancestry: "",
  background: "",
  alignment: "Unaligned",
  playerName: "",
}

export const defaultDiceExpressionValue = defaultDiceExpression
