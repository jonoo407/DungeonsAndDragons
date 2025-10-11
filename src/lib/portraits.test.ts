import { describe, expect, it } from "vitest"
import { resolvePortraitSource, PORTRAIT_MANIFEST } from "./portraits"
import { createPortraitId } from "../types/character"

describe("resolvePortraitSource", () => {
  it("returns the exact portrait match when all identifiers align", () => {
    const source = resolvePortraitSource(
      createPortraitId("human", "fighter", "female"),
    )

    expect(source).toEqual(PORTRAIT_MANIFEST["human__fighter__female"])
  })

  it("falls back to an ancestry + gender portrait when class is missing", () => {
    const source = resolvePortraitSource(
      createPortraitId("human", "wizard", "female"),
    )

    expect(source).toEqual(PORTRAIT_MANIFEST["human__female"])
  })

  it("uses the class + gender portrait when ancestry specific art is unavailable", () => {
    const source = resolvePortraitSource(
      createPortraitId("gnome", "fighter", "male"),
    )

    expect(source).toEqual(PORTRAIT_MANIFEST["fighter__male"])
  })

  it("resolves to an ancestry-only fallback when gendered assets are missing", () => {
    const source = resolvePortraitSource(
      createPortraitId("dwarf", "bard", "nonbinary"),
    )

    expect(source).toEqual(PORTRAIT_MANIFEST.dwarf)
  })

  it("returns the global fallback when no portrait variants are configured", () => {
    const source = resolvePortraitSource(
      createPortraitId("lizard_man", "bard", "nonbinary"),
    )

    expect(source).toEqual(PORTRAIT_MANIFEST.fallback)
  })

  it("treats custom genders as unassigned for portrait lookup", () => {
    const source = resolvePortraitSource(
      createPortraitId("human", "fighter", "custom"),
    )

    expect(source).toEqual(PORTRAIT_MANIFEST.human)
  })

  it("supports ancestry identifiers containing underscores", () => {
    PORTRAIT_MANIFEST["half_orc"] = { src: "/portraits/half_orc.svg" }

    try {
      const source = resolvePortraitSource(
        createPortraitId("half_orc", "bard", null),
      )

      expect(source).toEqual(PORTRAIT_MANIFEST["half_orc"])
    } finally {
      delete PORTRAIT_MANIFEST["half_orc"]
    }
  })

  it("falls back to a class portrait when ancestry art is unavailable", () => {
    PORTRAIT_MANIFEST.fighter = { src: "/portraits/fighter__male.svg" }

    try {
      const source = resolvePortraitSource(createPortraitId(null, "fighter", null))

      expect(source).toEqual(PORTRAIT_MANIFEST.fighter)
    } finally {
      delete PORTRAIT_MANIFEST.fighter
    }
  })
})
