# Keyboard Input Handling Guide

This document explains how keyboard inputs are handled in the Elite OS codebase after the refactoring to centralize keyboard event handling in the `OsButton` component.

## Overview

The `OsButton` component now automatically handles keyboard events when a `hotkey` prop is provided. This eliminates the need for manual `onKeyStroke` boilerplate in most cases.

## Quick Start

### Before (Old Pattern)

```vue
<template>
  <OsButton hotkey="Esc" @click="goBack">
    Back
  </OsButton>
</template>

<script setup>
import { onKeyStroke } from '@vueuse/core'

// ❌ Manual boilerplate - duplicates button logic
onKeyStroke(['Escape'], () => {
  goBack()
})

function goBack() {
  // ... navigation logic
}
</script>
```

### After (New Pattern)

```vue
<template>
  <OsButton hotkey="Escape" @click="goBack">
    Back
  </OsButton>
</template>

<script setup>
// ✅ No manual keyboard handling needed!
// The button automatically handles the Escape key

function goBack() {
  // ... navigation logic
}
</script>
```

## OsButton API

### Props

#### `hotkey?: KeyboardKey`

The keyboard key that triggers this button. When specified, pressing this key will emit a `click` event.

**Type:** `KeyboardKey` (see [Supported Keys](#supported-keys) below)

**Example:**
```vue
<OsButton hotkey="Enter" @click="submit">Submit</OsButton>
<OsButton hotkey="Escape" @click="cancel">Cancel</OsButton>
<OsButton hotkey="Space" @click="toggle">Toggle</OsButton>
```

#### `hotkeyDisplay?: string`

Custom display text for the hotkey badge. If not specified, uses the default display name from `KEY_DISPLAY_NAMES`.

**Example:**
```vue
<!-- Default display: "Esc" -->
<OsButton hotkey="Escape" @click="cancel">Cancel</OsButton>

<!-- Custom display: "Exit" -->
<OsButton hotkey="Escape" hotkeyDisplay="Exit" @click="cancel">Cancel</OsButton>
```

#### `requireFocus?: boolean`

Whether the window must be in focus for the hotkey to work.

**Default:** `true`

**Example:**
```vue
<!-- Only works when window is focused (default) -->
<OsButton hotkey="Enter" @click="submit">Submit</OsButton>

<!-- Works even when window is not focused -->
<OsButton hotkey="Escape" :requireFocus="false" @click="exit">Exit</OsButton>
```

### Events

#### `@click`

Emitted when the button is clicked or when the hotkey is pressed.

**Example:**
```vue
<OsButton hotkey="Enter" @click="handleSubmit">Submit</OsButton>
```

## Supported Keys

The `KeyboardKey` type provides full TypeScript validation and autocomplete for the following keys:

### Control Keys
- `Escape` - ESC key (displayed as "Esc")
- `Enter` - Enter/Return key
- `Space` - Space bar
- `Tab` - Tab key
- `Backspace` - Backspace key (displayed as "⌫")

### Arrow Keys
- `ArrowUp` - Up arrow (displayed as "↑")
- `ArrowDown` - Down arrow (displayed as "↓")
- `ArrowLeft` - Left arrow (displayed as "←")
- `ArrowRight` - Right arrow (displayed as "→")

### Alphabet Keys
- Lowercase: `a` through `z`
- Uppercase: `A` through `Z`

### Number Keys
- `0` through `9`

## TypeScript Integration

The keyboard types are defined in `src/types/keyboard.ts` and provide full type safety:

```typescript
import type { KeyboardKey } from '@/types/keyboard'
import { getKeyDisplayName, KEY_DISPLAY_NAMES } from '@/types/keyboard'

// Type-safe key reference
const myKey: KeyboardKey = 'Escape' // ✅ Valid
const invalid: KeyboardKey = 'F1'    // ❌ Type error!

// Get display name
const displayName = getKeyDisplayName('Escape') // "Esc"
```

## Advanced Usage

### When to Use Manual `onKeyStroke`

You should still use manual `onKeyStroke` for:

1. **Generic text input** (any printable character):
   ```typescript
   import { onKeyStroke, useWindowFocus } from '@vueuse/core'

   const windowIsInFocus = useWindowFocus()
   onKeyStroke((e) => {
     if (windowIsInFocus.value && e.key.length === 1) {
       // Handle any single character input
       handleTextInput(e.key)
     }
   })
   ```

2. **Complex state-dependent behavior**:
   ```typescript
   onKeyStroke((e) => {
     if (currentState.value === 'editing' && e.key.length === 1) {
       handleInput(e.key)
     }
   })
   ```

3. **Key combinations** (Ctrl+S, Alt+F, etc.):
   ```typescript
   onKeyStroke('s', (e) => {
     if (e.ctrlKey) {
       e.preventDefault()
       save()
     }
   })
   ```

### Combining OsButton with Manual Handlers

You can use both approaches together:

```vue
<template>
  <OsButton hotkey="Escape" @click="cancel">Cancel</OsButton>
</template>

<script setup>
import { onKeyStroke, useWindowFocus } from '@vueuse/core'

const windowIsInFocus = useWindowFocus()

// OsButton handles Escape key automatically
function cancel() {
  // Cancel logic
}

// Manual handler for generic text input
onKeyStroke((e) => {
  if (windowIsInFocus.value && e.key.length === 1) {
    handleTextInput(e.key)
  }
})
</script>
```

## Examples from Codebase

### Simple Navigation (ChallengesListWindow.vue)

```vue
<template>
  <OsWindow title="Challenge Browser">
    <!-- ... content ... -->

    <template #footer-right>
      <OsButton
        hotkey="Escape"
        @click="gameStateStore.currentEliteOsApp = EliteOsApps.Desktop"
      >
        Back to Desktop
      </OsButton>
    </template>
  </OsWindow>
</template>

<script setup>
// No manual keyboard handling needed! ✅
const gameStateStore = useGameStateStore()
</script>
```

### Multiple Hotkeys (ChallengeWindow.vue)

```vue
<template>
  <OsWindow>
    <!-- Results dialog (conditionally rendered) -->
    <OsWindow v-if="currentState === ChallengeStates.Results">
      <template #footer-right>
        <OsButton hotkey="Enter" @click="showOutro">
          Run
        </OsButton>
      </template>
    </OsWindow>

    <!-- Main footer (always visible) -->
    <template #footer-right>
      <OsButton hotkey="Escape" @click="exitChallenge">
        Abort Challenge
      </OsButton>
    </template>
  </OsWindow>
</template>

<script setup>
// Hotkeys are automatically scoped to button visibility!
// Enter key only works when Results dialog is shown
// Escape key works whenever the main window is visible
</script>
```

### Button with Text Input (MonkeyWorkWindow.vue)

```vue
<template>
  <OsWindow>
    <!-- ... table content ... -->

    <template #footer-right>
      <OsButton hotkey="Escape" @click="saveAndClose">
        Save and close
      </OsButton>
    </template>
  </OsWindow>
</template>

<script setup>
import { onKeyStroke, useWindowFocus } from '@vueuse/core'

const windowIsInFocus = useWindowFocus()

// OsButton handles Escape key
function saveAndClose() {
  gameStateStore.currentEliteOsApp = EliteOsApps.Desktop
}

// Manual handler for work simulation input
onKeyStroke((e) => {
  if (windowIsInFocus.value && e.key.length === 1) {
    void input() // Process typing for work simulation
  }
})
</script>
```

## Benefits

✅ **Type Safety** - Full TypeScript validation with autocomplete
✅ **Zero Boilerplate** - No manual `onKeyStroke` for button actions
✅ **DRY Principle** - Click handler defined once, works for both clicks and keys
✅ **Consistent Behavior** - Window focus checks handled internally
✅ **Easy Maintenance** - Change key binding in one place
✅ **Backwards Compatible** - Existing buttons without `hotkey` work as before
✅ **Automatic Cleanup** - Event listeners properly cleaned up on unmount

## Migration Checklist

When updating existing code to use the new pattern:

- [ ] Change `hotkey` prop value from display text (e.g., `"Esc"`) to actual key name (e.g., `"Escape"`)
- [ ] Remove manual `onKeyStroke` calls that duplicate button click handlers
- [ ] Keep manual `onKeyStroke` for generic text input or complex state-dependent behavior
- [ ] Verify TypeScript types are correct (should auto-complete from `KeyboardKey` type)
- [ ] Test that keyboard shortcuts work as expected
- [ ] Run `npm run typecheck` to verify no type errors

## Troubleshooting

### Hotkey not working

1. Check that the button is actually mounted (not hidden by `v-if`)
2. Verify `requireFocus` prop - window might not be in focus
3. Check for conflicting keyboard handlers
4. Ensure the key name is correct (e.g., `"Escape"` not `"Esc"`)

### Type errors

```typescript
// ❌ Wrong - using display name
<OsButton hotkey="Esc" @click="cancel">

// ✅ Correct - using actual key name
<OsButton hotkey="Escape" @click="cancel">
```

### Multiple handlers firing

If you have both an OsButton with a hotkey and a manual `onKeyStroke` for the same key, both will fire. Remove the manual handler if it duplicates the button's functionality.

## Implementation Details

The OsButton component uses:
- `@vueuse/core`'s `onKeyStroke` composable
- `useWindowFocus()` for focus detection
- Vue 3's composition API
- TypeScript for type safety

Event listener lifecycle is managed automatically by Vue - listeners are set up during component mount and cleaned up on unmount.
