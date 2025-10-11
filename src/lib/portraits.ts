import { createPortraitId, type PortraitId } from "../types/character"

export interface PortraitVariant {
  src: string
  attribution?: string
}

export type PortraitSource = PortraitVariant

type PortraitManifest = Record<string, PortraitVariant>

const FALLBACK_KEY = "fallback"

const sanitizeSegment = (segment: string | null | undefined) => {
  if (!segment) {
    return null
  }

  return segment.trim().toLowerCase().replace(/\s+/g, "_")
}

export const PORTRAIT_MANIFEST: PortraitManifest = {
  [FALLBACK_KEY]: { src: "/portraits/fallback.svg" },
  "human__fighter__female": { src: "/portraits/human__fighter__female.svg" },
  "human__female": { src: "/portraits/human__female.svg" },
  "fighter__male": { src: "/portraits/fighter__male.svg" },
  "elf__wizard__male": { src: "/portraits/elf__wizard__male.svg" },
  human: { src: "/portraits/human.svg" },
  dwarf: { src: "/portraits/dwarf.svg" },
}

const getManifestEntry = (key: string | null) => {
  if (!key) {
    return undefined
  }

  return PORTRAIT_MANIFEST[key]
}

export const resolvePortraitSource = ({
  ancestry,
  classId,
  genderId,
}: PortraitId): PortraitSource => {
  const ancestrySegment = sanitizeSegment(ancestry ?? null)
  const classSegment = sanitizeSegment(classId ?? null)
  const genderSegment = sanitizeSegment(
    genderId && genderId !== "custom" ? genderId : null,
  )

  const portraitKeyPriority = [
    genderSegment && ancestrySegment && classSegment
      ? `${ancestrySegment}__${classSegment}__${genderSegment}`
      : null,
    genderSegment && ancestrySegment ? `${ancestrySegment}__${genderSegment}` : null,
    genderSegment && classSegment ? `${classSegment}__${genderSegment}` : null,
    ancestrySegment,
    classSegment,
  ]

  for (const key of portraitKeyPriority) {
    const entry = getManifestEntry(key)
    if (entry) {
      return entry
    }
  }

  return PORTRAIT_MANIFEST[FALLBACK_KEY]
}

export const getPortraitSourceFromValues = (
  ancestry: PortraitId["ancestry"],
  classId: PortraitId["classId"],
  genderId: PortraitId["genderId"],
) => resolvePortraitSource(createPortraitId(ancestry, classId, genderId))
