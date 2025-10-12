import { describe, expect, it } from "vitest"
import { isDiceExpressionValid, parseDiceExpression } from "./dice"

describe("parseDiceExpression", () => {
  it("rejects constants containing stray characters", () => {
    expect(parseDiceExpression("1d")).toBeNull()
    expect(parseDiceExpression("2+1d")).toBeNull()
  })

  it("parses valid expressions", () => {
    expect(parseDiceExpression("2d6+3")).not.toBeNull()
  })
})

describe("isDiceExpressionValid", () => {
  it("mirrors parse validation for malformed constants", () => {
    expect(isDiceExpressionValid("1d")).toBe(false)
    expect(isDiceExpressionValid("2+1d")).toBe(false)
    expect(isDiceExpressionValid("4d6-2")).toBe(true)
  })
})
