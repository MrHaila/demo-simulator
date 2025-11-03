# Overview

This project is a game about programming.

Tech stack:

- Vue 3
- Vite
- TypeScript
- Tailwind CSS
- Pinia
- pnpm instead of npm

Commands:

- Lint: pnpm lint
- Type check: pnpm typecheck
- Build: pnpm build
- Run: pnpm dev
- Format: pnpm format

## Style

- Single quotes
- No semicolons
- 2 spaces
- 120 characters per line
- Arrow functions
- No trailing commas

## TypeScript Best Practices

- Run the linter with auto fix after editing files (scope to modified files)
- Check typecheck when done and before commit and fix any issues
- Run format before commit (scope to modified files)

### Avoid Enums - Use Const Dictionaries

Prefer const dictionaries with `as const` over enums for better type safety and runtime behavior:

```typescript
// Instead of:
export enum Scenes {
  Boot = 'Boot',
  Home = 'Home',
}

// Use:
export const Scenes = {
  Boot: 'Boot',
  Home: 'Home',
} as const

// And create a helper type:
export type Scene = (typeof Scenes)[keyof typeof Scenes]
```
