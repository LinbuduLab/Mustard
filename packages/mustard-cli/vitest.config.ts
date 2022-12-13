import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    passWithNoTests: true,
    include: ["source/__tests__/Integrations/**/*.{spec,test}.ts"],
    // exclude: ["**/node_modules/**"],
    coverage: {
      enabled: true,
      reporter: ["text", "html"],
      include: ["source"],
    },
    threads: true,
  },
});
