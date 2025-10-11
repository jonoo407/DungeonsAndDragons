import { strict as assert } from "node:assert"

import { resolvePortraitSource, PORTRAIT_MANIFEST } from "./portraits"
import { createPortraitId } from "../types/character"

interface TestCase {
  name: string
  run: () => void
}

const tests: TestCase[] = []

const test = (name: string, run: () => void) => {
  tests.push({ name, run })
}

test("returns the exact portrait match when all identifiers align", () => {
  const source = resolvePortraitSource(
    createPortraitId("human", "fighter", "female"),
  )

  assert.strictEqual(source, PORTRAIT_MANIFEST["human__fighter__female"])
})

test("falls back to an ancestry + gender portrait when class is missing", () => {
  const source = resolvePortraitSource(
    createPortraitId("human", "wizard", "female"),
  )

  assert.strictEqual(source, PORTRAIT_MANIFEST["human__female"])
})

test(
  "uses the class + gender portrait when ancestry specific art is unavailable",
  () => {
    const source = resolvePortraitSource(
      createPortraitId("gnome", "fighter", "male"),
    )

    assert.strictEqual(source, PORTRAIT_MANIFEST["fighter__male"])
  },
)

test(
  "resolves to an ancestry-only fallback when gendered assets are missing",
  () => {
    const source = resolvePortraitSource(
      createPortraitId("dwarf", "bard", "nonbinary"),
    )

    assert.strictEqual(source, PORTRAIT_MANIFEST.dwarf)
  },
)

test("returns the global fallback when no portrait variants are configured", () => {
  const source = resolvePortraitSource(
    createPortraitId("lizard_man", "bard", "nonbinary"),
  )

  assert.strictEqual(source, PORTRAIT_MANIFEST.fallback)
})

test("treats custom genders as unassigned for portrait lookup", () => {
  const source = resolvePortraitSource(
    createPortraitId("human", "fighter", "custom"),
  )

  assert.strictEqual(source, PORTRAIT_MANIFEST.human)
})

test("supports ancestry identifiers containing underscores", () => {
  PORTRAIT_MANIFEST["half_orc"] = { src: "/portraits/half_orc.svg" }

  try {
    const source = resolvePortraitSource(
      createPortraitId("half_orc", "bard", null),
    )

    assert.strictEqual(source, PORTRAIT_MANIFEST["half_orc"])
  } finally {
    delete PORTRAIT_MANIFEST["half_orc"]
  }
})

test("falls back to a class portrait when ancestry art is unavailable", () => {
  PORTRAIT_MANIFEST.fighter = { src: "/portraits/fighter__male.svg" }

  try {
    const source = resolvePortraitSource(createPortraitId(null, "fighter", null))

    assert.strictEqual(source, PORTRAIT_MANIFEST.fighter)
  } finally {
    delete PORTRAIT_MANIFEST.fighter
  }
})

const run = () => {
  let failures = 0

  for (const { name, run } of tests) {
    try {
      run()
      console.log(`✓ ${name}`)
    } catch (error) {
      failures += 1
      console.error(`✗ ${name}`)
      console.error(error)
    }
  }

  if (failures > 0) {
    console.error(`\n${failures} failing test${failures === 1 ? "" : "s"}`)
    process.exitCode = 1
  } else {
    console.log(`\n${tests.length} tests passed`)
  }
}

run()
