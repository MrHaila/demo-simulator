/**
 * Supported keyboard keys for hotkey bindings.
 * This type provides full TypeScript validation and autocomplete.
 */
export type KeyboardKey =
  // Control keys
  | 'Escape'
  | 'Enter'
  | 'Space'
  | 'Tab'
  | 'Backspace'
  // Arrow keys
  | 'ArrowUp'
  | 'ArrowDown'
  | 'ArrowLeft'
  | 'ArrowRight'
  // Alphabet (lowercase)
  | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm'
  | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z'
  // Alphabet (uppercase)
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M'
  | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z'
  // Numbers
  | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'

/**
 * User-friendly display names for keyboard keys.
 * Maps KeyboardEvent.key values to shorter display strings.
 */
export const KEY_DISPLAY_NAMES: Record<KeyboardKey, string> = {
  // Control keys
  'Escape': 'Esc',
  'Enter': 'Enter',
  'Space': 'Space',
  'Tab': 'Tab',
  'Backspace': '⌫',
  // Arrow keys
  'ArrowUp': '↑',
  'ArrowDown': '↓',
  'ArrowLeft': '←',
  'ArrowRight': '→',
  // Lowercase letters
  'a': 'A', 'b': 'B', 'c': 'C', 'd': 'D', 'e': 'E', 'f': 'F',
  'g': 'G', 'h': 'H', 'i': 'I', 'j': 'J', 'k': 'K', 'l': 'L',
  'm': 'M', 'n': 'N', 'o': 'O', 'p': 'P', 'q': 'Q', 'r': 'R',
  's': 'S', 't': 'T', 'u': 'U', 'v': 'V', 'w': 'W', 'x': 'X',
  'y': 'Y', 'z': 'Z',
  // Uppercase letters
  'A': 'A', 'B': 'B', 'C': 'C', 'D': 'D', 'E': 'E', 'F': 'F',
  'G': 'G', 'H': 'H', 'I': 'I', 'J': 'J', 'K': 'K', 'L': 'L',
  'M': 'M', 'N': 'N', 'O': 'O', 'P': 'P', 'Q': 'Q', 'R': 'R',
  'S': 'S', 'T': 'T', 'U': 'U', 'V': 'V', 'W': 'W', 'X': 'X',
  'Y': 'Y', 'Z': 'Z',
  // Numbers
  '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
  '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
}

/**
 * Get the display name for a keyboard key.
 * @param key - The keyboard key
 * @returns The user-friendly display name
 */
export function getKeyDisplayName(key: KeyboardKey): string {
  return KEY_DISPLAY_NAMES[key]
}
