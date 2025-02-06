import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [
    ...compat.extends("eslint:recommended", "plugin:@typescript-eslint/recommended"),
    {
        plugins: {
            "@typescript-eslint": typescriptEslint,
        },

        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },

            ecmaVersion: "latest",
            sourceType: "module",
        },

        rules: {
            "no-console": ["warn", { "allow": ["error"] }],
            "no-unused-vars": "warn",

            quotes: ["error", "double", {
                avoidEscape: true,
                allowTemplateLiterals: true,
            }],

            "no-inline-comments": "warn",

            "no-multiple-empty-lines": ["warn", {
                max: 2,
            }],

            "spaced-comment": ["warn", "always", {
                markers: ["/", "!"],
            }],

            "no-trailing-spaces": "warn",
            "eol-last": ["warn", "always"],
            semi: ["error", "always"],
            "comma-dangle": ["warn", "always-multiline"],
            "arrow-parens": ["warn", "always"],
            "object-curly-spacing": ["warn", "always"],
            "array-bracket-spacing": ["warn", "never"],
            "space-before-blocks": ["warn", "always"],

            "key-spacing": ["warn", {
                beforeColon: false,
                afterColon: true,
            }],

            "no-unused-expressions": "warn",
            "no-duplicate-imports": "warn",
            "no-useless-return": "warn",
            "no-self-compare": "warn",
            "no-unreachable": "error",
            "no-constant-condition": "warn",
            "no-debugger": "warn",
            "no-alert": "warn",
            "no-empty": "warn",
            "no-extra-parens": "warn",
            "no-extra-semi": "warn",
            "no-fallthrough": "warn",
            "no-mixed-spaces-and-tabs": "warn",
            "no-multi-spaces": "warn",
            "no-new": "warn",
            "no-new-func": "warn",
            "no-new-object": "warn",
            "no-new-wrappers": "warn",
            "no-octal-escape": "warn",
            "no-proto": "warn",
            "no-redeclare": "warn",
            "no-regex-spaces": "warn",
            "no-return-assign": "warn",
            "no-self-assign": "warn",
            "no-sequences": "warn",
            "no-shadow": "warn",
            "no-template-curly-in-string": "warn",
            "no-this-before-super": "warn",
            "no-throw-literal": "warn",
            "no-undef": "error",
            "no-unused-labels": "warn",
            "no-use-before-define": "warn",
            "no-useless-call": "warn",
            "no-useless-catch": "warn",
            "no-useless-concat": "warn",
            "no-useless-escape": "warn",
            "no-void": "warn",
            "no-warning-comments": "warn",
            "no-with": "warn",
            "prefer-const": "warn",
            "prefer-regex-literals": "warn",
            radix: "warn",
            "require-await": "warn",
            "require-yield": "warn",
            strict: ["warn", "never"],
            "use-isnan": "warn",
            "valid-typeof": "warn",
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": "warn",
            "@typescript-eslint/no-unused-expressions": "warn",
        },
    },
    ...compat.extends("eslint:recommended", "plugin:@typescript-eslint/recommended").map((config) => ({
        ...config,
        files: ["**/*.ts", "**/*.tsx"],
    })),
    {
        files: ["**/*.ts", "**/*.tsx"],

        languageOptions: {
            parser: tsParser,
        },

        rules: {
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": "warn",
            "@typescript-eslint/no-unused-expressions": "warn",
        },
    },
];
