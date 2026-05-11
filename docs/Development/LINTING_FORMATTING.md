# Linting & Code Formatting

## 1. Install Dependencies

```bash
npm install --save-dev \
  eslint \
  eslint-config-next \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin \
  prettier \
  eslint-plugin-prettier \
  eslint-config-prettier \
  @eslint/js \
  typescript-eslint
```

## 2. ESLint Configuration

Create `.eslintrc.json`:

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "plugins": ["@typescript-eslint", "prettier"],
  "rules": {
    "prettier/prettier": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }
    ],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off"
  },
  "env": {
    "browser": true,
    "node": true,
    "es6": true
  }
}
```

## 3. Prettier Configuration

Create `.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

Create `.prettierignore`:

```
node_modules
.next
dist
build
.env
.env.local
```

## 4. Package.json Scripts

Add to `package.json`:

```json
"scripts": {
  "lint": "next lint",
  "lint:fix": "next lint --fix",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "pre-commit": "npm run lint && npm run format"
}
```

## 5. Git Hooks (Husky)

Install:

```bash
npm install --save-dev husky lint-staged
npx husky init
```

Update `.husky/pre-commit`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint
npm run format
```

Update `package.json`:

```json
"lint-staged": {
  "*.{ts,tsx}": ["npm run lint", "npm run format"],
  "*.{json,md,css}": "npm run format"
}
```

## 6. GitHub Actions CI Integration

Update `.github/workflows/ci.yml`:

```yaml
jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run format:check
        name: Check Prettier
      - run: npm run lint
        name: Run ESLint
      - run: npm run typecheck
        name: TypeScript Check
```

## 7. VSCode Settings

Create `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "editor.tabSize": 2,
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true
}
```

---

## QA Check - Fixes Applied:
- ✅ Pre-commit hooks prevent bad code entering repo
- ✅ Consistent formatting across all devs
- ✅ TypeScript rules catch errors early
- ✅ GitHub Actions CI fails on lint errors