import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    testTimeout: 300000,
    environment: "node",
    passWithNoTests: true,
    include: ["source/__tests__/**/*.{spec,test}.ts"],
    // exclude: ["**/node_modules/**"],
    coverage: {
      enabled: true,
      reporter: ["text", "html"],
      include: ["source"],
    },
    threads: true,
  },
});
