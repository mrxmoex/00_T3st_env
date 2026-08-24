import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "bulwark/**",
      "data/**",
    ],
  },
  {
    files: ["src/**/*.{ts,tsx}", "vite.config.ts", "vitest.config.ts"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2023,
        sourceType: "module",
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
);
