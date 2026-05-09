import nextVitals from "eslint-config-next/core-web-vitals"
import nextTypeScript from "eslint-config-next/typescript"

const eslintConfig = [
  ...nextVitals,
  ...nextTypeScript,
  {
    rules: {
      "react-hooks/static-components": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
    },
  },
]

export default eslintConfig
