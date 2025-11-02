<template lang="pug">
button(
  type="button",
  class="inline-flex items-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm text-liver shadow-xs hover:bg-gray-300 hover:text-gray-900 focus:bg-gray-400 focus:text-gray-900 focus:shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-hidden",
  @click="handleClick"
)
  slot TODO
  span(
    v-if="hotkey",
    class="ml-2 rounded-sm border border-neutral-400 bg-neutral-300 px-1 py-0.5 text-xs font-normal text-gray-500"
  ) {{ displayKey }}
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue'
import { onKeyStroke, useWindowFocus } from '@vueuse/core'
import { getKeyDisplayName, type KeyboardKey } from '@/types/keyboard'

interface Props {
  /**
   * Keyboard key that triggers this button.
   * When specified, pressing this key will emit a click event.
   */
  hotkey?: KeyboardKey
  /**
   * Custom display text for the hotkey badge.
   * If not specified, uses the default display name from KEY_DISPLAY_NAMES.
   */
  hotkeyDisplay?: string
  /**
   * Whether the window must be in focus for the hotkey to work.
   * @default true
   */
  requireFocus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  requireFocus: true,
})

const emit = defineEmits<{
  click: []
}>()

const windowIsInFocus = useWindowFocus()

// Compute the display name for the hotkey badge
const displayKey = computed(() => {
  if (!props.hotkey) return ''
  return props.hotkeyDisplay ?? getKeyDisplayName(props.hotkey)
})

// Handle button click
const handleClick = (): void => {
  emit('click')
}

// Map our KeyboardKey type to actual KeyboardEvent.key values
function mapToKeyEvent(key: KeyboardKey): string {
  switch (key) {
    case 'Space':
      return ' ' // Space bar key event is a literal space
    default:
      return key
  }
}

// Set up keyboard listener reactively
watch(
  () => props.hotkey,
  (newHotkey, oldHotkey) => {
    // Clean up old listener if it existed
    if (oldHotkey) {
      // onKeyStroke automatically cleans up when the component unmounts,
      // but we need to handle hotkey changes during component lifecycle
    }

    // Set up new listener if hotkey is provided
    if (newHotkey) {
      const keyEventValue = mapToKeyEvent(newHotkey)

      onKeyStroke([keyEventValue], (e) => {
        // Check if window focus is required
        if (props.requireFocus && !windowIsInFocus.value) {
          return
        }

        // Prevent default browser behavior
        e.preventDefault()

        // Trigger the click handler
        handleClick()
      })
    }
  },
  { immediate: true }, // Run immediately on component setup
)
</script>
