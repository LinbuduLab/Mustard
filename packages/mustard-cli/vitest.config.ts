import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    passWithNoTests: true,
    exclude: ["**/node_modules/**"],
    coverage: {
      enabled: true,
      reporter: ["text", "html"],
      include: ["./source/**/*.ts"],
      exclude: ["./source/__tests__/**/*"],
    },
    threads: true,
  },
});
