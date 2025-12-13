import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module"
    },
    plugins: {
      react: reactPlugin
    },
    rules: {
      "react/react-in-jsx-scope": "off", // ✅ disables the error
      "react/prop-types": "warn"
    },
    settings: {
      react: {
        version: "detect"
      }
    }
  }
];
