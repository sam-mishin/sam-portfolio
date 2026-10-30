/**
 * vitest.config.ts — unit test setup.
 *
 * Tests cover pure logic only (the command palette's filter and keyboard
 * index, and the uptime date math), so they run in plain Node with no
 * browser emulation. Test files sit next to the code they test as
 * `*.test.ts`.
 */
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Same "@/…" import alias as tsconfig.json.
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["node_modules/**", ".next/**"],
    // The first tests arrive in milestone 3; until then an empty run passes.
    passWithNoTests: true,
  },
});
