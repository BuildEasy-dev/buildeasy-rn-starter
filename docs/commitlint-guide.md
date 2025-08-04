# Commitlint Guide

This project uses commitlint to enforce consistent commit message standards.

## Quick Start

### Message Format

```
<type>: <subject>
```

Examples:

- `feat: add user authentication`
- `fix: resolve navigation crash`
- `docs: update API documentation`

### Allowed Types

| Type       | Use for            | Example                         |
| ---------- | ------------------ | ------------------------------- |
| `feat`     | New features       | `feat: add dark mode`           |
| `fix`      | Bug fixes          | `fix: resolve memory leak`      |
| `docs`     | Documentation      | `docs: update README`           |
| `style`    | Code formatting    | `style: format with prettier`   |
| `refactor` | Code restructuring | `refactor: simplify auth logic` |
| `test`     | Tests              | `test: add user service tests`  |
| `chore`    | Maintenance        | `chore: update dependencies`    |

## Automatic Checks

**Pre-commit**: Runs TypeScript and ESLint checks  
**Commit-msg**: Validates message format

## Common Errors

### Missing type

Bad: `Add new feature`  
Good: `feat: add new feature`

### Wrong case

Bad: `FEAT: add feature`  
Good: `feat: add feature`

### Empty subject

Bad: `fix:`  
Good: `fix: resolve login issue`

### Capital letter

Bad: `feat: Add feature`  
Good: `feat: add feature`

### Period at end

Bad: `feat: add feature.`  
Good: `feat: add feature`

## Manual Validation

Check last commit:

```bash
pnpm commitlint
```

Check last 10 commits:

```bash
pnpm commitlint:last
```

## Bypass Checks (Emergency Only)

```bash
git commit -m "message" --no-verify
```

## Best Practices

- Keep subject under 50 characters
- Use present tense: "add" not "added"
- Start with lowercase
- One commit = one logical change

## Troubleshooting

**Pre-commit fails?**

- Run `pnpm typecheck` for type errors
- Run `pnpm lint` for code style issues

**Commit rejected?**
Check the error message. Usually:

- Missing type prefix
- Wrong type spelling
- Invalid subject format

## Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Project Standards](../CLAUDE.md#git-commit-standards)
