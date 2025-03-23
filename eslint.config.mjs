import { FlatCompat } from "@eslint/eslintrc";
import perfectionist from 'eslint-plugin-perfectionist'
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...compat.config({
    rules: {
      "@typescript-eslint/no-explicit-any": "warn"
    },
  }),
  {
    plugins: {
      perfectionist
    },
    rules: {
      "perfectionist/sort-imports": [
        "error",
        {
          "order": "desc",
          "ignoreCase": true,
          "type": "line-length",
          "newlinesBetween": "always",
          "groups": [["builtin", "external"], ["index", "parent", "sibling"], "internal"]
        }
      ],
      "perfectionist/sort-named-imports": [
        "error",
        {
          "order": "desc",
          "ignoreCase": true,
          "type": "line-length",
          "partitionByNewLine": true,
        }
      ],
    },
  },
];

export default eslintConfig;