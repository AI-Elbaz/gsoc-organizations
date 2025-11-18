import {defineConfig, globalIgnores} from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier/recommended";

export default defineConfig([
  ...nextCoreWebVitals,
  ...nextTypescript,
  prettier,

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),

  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },

    languageOptions: {
      parser: tsParser,
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],

    rules: {
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["server-only"],
            ["^next"],
            ["^react"],
            ["^@?\\w"],
            ["^.+\\.svg$"],
            ["^.+\\.(webp|jpeg|jpg|png)$"],
            ["^@/", "^\\."],
            // Type imports from external packages
            ["^@?\\w.*\\u0000$"],
            // Type imports from internal packages
            ["^@/.*\\u0000$", "^\\..*\\u0000$"],
            // Side effect imports
            ["^\\u0000"],
          ],
        },
      ],

      "simple-import-sort/exports": "error",

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
        },
      ],

      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          disallowTypeAnnotations: false,
          fixStyle: "separate-type-imports",
        },
      ],

      "import/newline-after-import": "error",
      // "import/no-cycle": "error",
      "import/first": "error",

      "no-restricted-imports": [
        "error",
        {
          name: "next/link",
          message: "Please import from `@/i18n/routing` instead.",
        },
        {
          name: "next/navigation",
          importNames: [
            "redirect",
            "permanentRedirect",
            "useRouter",
            "usePathname",
          ],
          message: "Please import from `@/i18n/routing` instead.",
        },
      ],
    },
  },
]);
