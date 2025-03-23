import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import simpleImportSort from 'eslint-plugin-simple-import-sort';

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
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      // Define custom import sorting groups
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // 1. Side effect imports (e.g., polyfills, global styles)
            ['^\\u0000'],
            // 2. Packages starting with 'react' or other packages
            ['^react$', '^@?\\w'],
            // 3. Absolute imports and other imports such as Vue-style `@/foo`
            ['^@', '^'],
            // 4. Relative imports from the same folder
            ['^\\./'],
            // 5. Style module imports (e.g., CSS modules)
            ['^.+\\.(module\\.css|module\\.scss)$'],
            // 6. Media imports (e.g., images)
            ['^.+\\.(gif|png|svg|jpg)$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      // Disable conflicting rules
      'sort-imports': 'off',
      'import/order': 'off',
    },
  },
];

export default eslintConfig;