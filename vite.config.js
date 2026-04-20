import dts from "vite-plugin-dts";
import swc from "unplugin-swc";

import { playwright } from "@vitest/browser-playwright";

/**
 * @type {import('vite').UserConfig}
 *
 * @see https://vite.dev/config/
 * @see https://vitest.dev/config/
 * @see https://github.com/qmhc/unplugin-dts
 */
export default {
  plugins: [
    dts({
      tsconfigPath: "./lib/tsconfig.json",
      outDir: "./dist/types",
    }),
    swc.vite({
      jsc: {
        parser: {
          syntax: "typescript",
          decorators: true,
        },
        transform: {
          decoratorVersion: "2022-03",
        },
      },
      module: { type: "es6" },
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    dir: "test",
    passWithNoTests: true,
    setupFiles: "test/setup.ts",
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }, { browser: "firefox" }],
    },
    coverage: {
      enabled: true,
      provider: "istanbul",
      include: ["lib/**/*.ts"],
      thresholds: {
        90: true,
      },
      reporter: "text",
    },
  },
  build: {
    outDir: "dist",
    lib: {
      entry: "./lib/index.ts",
    },
    rolldownOptions: {
      output: [
        {
          name: "reflected-attributes",
          format: "es",
          dir: "dist/lib",
          entryFileNames: "[name].js",
          preserveModules: true,
          minify: false,
        },
        {
          name: "reflected-attributes",
          dir: "dist/cdn",
          format: "iife",
          entryFileNames: "index.min.js",
          minify: true,
          extend: true,
        },
      ],
    },
  },
};
