# Husky Git Hooks

This project uses [Husky](https://typicode.github.io/husky/) to enforce code quality checks before commits and pushes.

## Hooks Overview

### Pre-commit Hook
Runs before every commit to ensure code quality:
- **ESLint**: Checks for code quality and style issues
- **Prettier** (commented out): Code formatting check - uncomment after running `npm run format` on the entire codebase

### Pre-push Hook
Runs before every push to ensure the code is production-ready:
- **Tests**: Runs all Jest tests to ensure nothing is broken
- **Build**: Verifies the project builds successfully

## Setup

Hooks are automatically installed when you run:
```bash
npm install
```

This is handled by the `prepare` script in `package.json`.

## Enabling Prettier Format Check

To enable the Prettier format check in the pre-commit hook:

1. Format the entire codebase:
   ```bash
   npm run format
   ```

2. Commit the formatted code:
   ```bash
   git add .
   git commit -m "chore: format codebase with prettier"
   ```

3. Uncomment the format check lines in `.husky/pre-commit`

## Bypassing Hooks (Use with caution!)

If you need to bypass hooks in an emergency:
```bash
# Skip pre-commit hook
git commit --no-verify -m "your message"

# Skip pre-push hook
git push --no-verify
```

**Note:** Only bypass hooks when absolutely necessary. They exist to maintain code quality and prevent broken code from being pushed.

## Troubleshooting

### Hook not running
Make sure hooks are executable:
```bash
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
```

### Tests failing
Run tests locally to see the errors:
```bash
npm test
```

### Build failing
Run the build locally:
```bash
npm run build
```

### Lint errors
Fix linting issues:
```bash
npm run lint:fix
```
