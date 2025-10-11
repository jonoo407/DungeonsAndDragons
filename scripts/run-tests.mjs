import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"
import path from "node:path"
import { existsSync, writeFileSync } from "node:fs"

const require = createRequire(import.meta.url)
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const compiledTestPath = path.join(rootDir, "dist-tests", "lib", "portraits.test.js")
const distTestsPackage = path.join(rootDir, "dist-tests", "package.json")

if (!existsSync(distTestsPackage)) {
  writeFileSync(distTestsPackage, JSON.stringify({ type: "commonjs" }), "utf8")
}

require(compiledTestPath)

if (process.exitCode && process.exitCode !== 0) {
  process.exit(process.exitCode)
}
