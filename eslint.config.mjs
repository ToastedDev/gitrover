import { defineConfig } from "eslint/config";
import eslint from "@eslint/js";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import tseslint from "typescript-eslint";

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  prettierRecommended,
  {
    rules: {
      "prettier/prettier": ["error"],
      quotes: ["error", "double", { avoidEscape: true }],
      semi: ["error", "always"],
      "quote-props": ["error", "as-needed"],
      "prefer-const": "error",
      "no-var": "error",
      "no-async-promise-executor": "off",
      "@typescript-eslint/array-type": "error",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/consistent-type-assertions": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "off",
    },
  }
);
