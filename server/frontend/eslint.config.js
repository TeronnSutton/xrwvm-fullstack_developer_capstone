// eslint.config.js
import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module"
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": jsxA11yPlugin
    },
    rules: {
      // React rules
      "react/react-in-jsx-scope": "off", // React 17+ doesn’t require import React
      "react/prop-types": "warn",        // Encourage prop validation
      // Hooks rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      // General rules
      "no-unused-vars": "warn",
      "no-console": "off"
    },
    settings: {
      react: {
        version: "detect" // Auto-detect React version from package.json
      }
    }
  }
];
