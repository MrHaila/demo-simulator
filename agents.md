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

### Handling Possibly Undefined Arrays

When working with arrays that might be undefined, use one-liner throws to provide clear error messages:

```typescript
function processChallengeRow(): void {
  if (!challengesAsRows[0]) throw new Error('No challenges in the first row.')

  for (const challengeToProcess of challengesAsRows[0]) {
    if (!challengeToProcess) throw new Error('Challenge to process is undefined.')
    // ... rest of processing
  }
}
```

This pattern:

- Provides immediate, clear error messages when array access fails
- Prevents runtime errors from undefined array elements
- Makes debugging easier by identifying the exact failure point
- Is more readable than nested if statements or optional chaining in critical paths
