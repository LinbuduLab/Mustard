import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    testTimeout: 300000,
    environment: "node",
    passWithNoTests: true,
    include: [
      process.env.TEST_TYPE === "INTEGRATION"
        ? "source/__tests__/Integrations/**/*.{spec,test}.ts"
        : "source/__tests__/**/*.{spec,test}.ts",
    ],
    exclude: [...configDefaults.exclude].concat(
      process.env.TEST_TYPE === "UNIT" ? ["source/__tests__/Integrations"] : []
    ),
    coverage: {
      enabled: true,
      reporter: ["text", "html", "json"],
      include: ["source"],
    },
    threads: true,
  },
});
