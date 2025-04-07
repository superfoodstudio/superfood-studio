import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const compat = new FlatCompat({
    baseDirectory: import.meta.dirname,
    recommendedConfig: import.meta.dirname,
    allConfig: import.meta.dirname,
});

const eslintConfig = [
    ...compat.config({ extends: ["next"] }),
    {
        rules: {
            'react/no-unescaped-entities': 'off',
            'no-var': 'warn'
        }
    }
];

export default eslintConfig;
