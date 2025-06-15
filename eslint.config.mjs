import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      // Disable most rules
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "react/no-unescaped-entities": "off",
      "react/display-name": "off",
      "react/prop-types": "off",
      "react/jsx-key": "off",
      "react/jsx-no-target-blank": "off",
      "react/jsx-no-undef": "off",
      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "off",
      "react/no-children-prop": "off",
      "react/no-danger": "off",
      "react/no-deprecated": "off",
      "react/no-direct-mutation-state": "off",
      "react/no-find-dom-node": "off",
      "react/no-is-mounted": "off",
      "react/no-render-return-value": "off",
      "react/no-string-refs": "off",
      "react/no-unknown-property": "off",
      "react/require-render-return": "off",
      "react/self-closing-comp": "off",
      "react/void-dom-elements-no-children": "off",
      "import/no-anonymous-default-export": "off",
      "import/no-duplicates": "off",
      "import/no-unresolved": "off",
      "import/no-webpack-loader-syntax": "off",
      "import/order": "off",
      "no-console": "off",
      "no-debugger": "off",
      "no-duplicate-imports": "off",
      "no-undef": "off",
      "no-unused-expressions": "off",
      "no-unused-vars": "off",
      "no-use-before-define": "off",
      "prefer-const": "off",
      "prefer-destructuring": "off",
      "prefer-spread": "off",
      "prefer-template": "off",
      "quotes": "off",
      "semi": "off",
      "spaced-comment": "off",
      "template-curly-spacing": "off",
      "valid-typeof": "off",
    },
  },
];

export default eslintConfig;
