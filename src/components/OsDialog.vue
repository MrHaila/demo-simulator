<template lang="pug">
teleport(to="body")
  transition(
    name="os-dialog",
    appear
  )
    div(
      v-if="isVisible",
      class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center",
      @click="handleBackdropClick"
    )
      // Dialog
      div(
        ref="dialogElement",
        class="pointer-events-auto relative mx-4 max-w-md min-w-xl transform rounded-lg border-4 border-liver bg-gray-900 shadow-xl",
        @click.stop
      )
        // Header
        div(class="flex shrink-0 basis-8 items-center justify-between bg-liver px-3 py-1 font-bold")
          h1 {{ title }}

        // Body
        div(class="p-4")
          slot
            p Default content

        // Footer
        div(
          v-if="$slots.footer",
          class="flex items-center justify-end space-x-2 bg-liver px-3 pt-2 pb-1 font-bold"
        )
          slot(name="footer")
</template>

<script lang="ts" setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useOverlay } from '@/components/composables/OsOverlay'

interface Props {
  title: string
  closeOnBackdropClick?: boolean
  modelValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  closeOnBackdropClick: true,
  modelValue: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
  open: []
}>()

const { showOverlay, hideOverlay } = useOverlay()
const dialogElement = ref<HTMLElement | null>(null)
const isVisible = ref(props.modelValue)

// Focus management
const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
let previouslyFocusedElement: Element | null = null

const close = (): void => {
  isVisible.value = false
  emit('update:modelValue', false)
  emit('close')
  restoreFocus()
}

const open = (): void => {
  isVisible.value = true
  emit('update:modelValue', true)
  emit('open')
  void nextTick(() => {
    trapFocus()
  })
}

const handleBackdropClick = (): void => {
  if (props.closeOnBackdropClick) {
    close()
  }
}

const trapFocus = (): void => {
  if (!dialogElement.value) return

  // Save previously focused element
  previouslyFocusedElement = document.activeElement

  // Get focusable elements within dialog
  const focusable = dialogElement.value.querySelectorAll(focusableElements)
  if (focusable.length > 0) {
    const firstElement = focusable[0]
    if (firstElement instanceof HTMLElement) {
      firstElement.focus()
    }
  }

  // Add keydown listener for tab trapping
  document.addEventListener('keydown', handleKeydown)
}

const restoreFocus = (): void => {
  document.removeEventListener('keydown', handleKeydown)
  if (previouslyFocusedElement instanceof HTMLElement) {
    previouslyFocusedElement.focus()
  }
}

const handleKeydown = (event: KeyboardEvent): void => {
  if (!dialogElement.value) return

  if (event.key === 'Escape') {
    close()
    return
  }

  if (event.key === 'Tab') {
    const focusable = dialogElement.value.querySelectorAll(focusableElements)
    if (focusable.length === 0) return

    const firstElement = focusable[0]
    const lastElement = focusable[focusable.length - 1]

    if (firstElement instanceof HTMLElement && lastElement instanceof HTMLElement) {
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else if (document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }
  }
}

// Watch for external model value changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== isVisible.value) {
      if (newValue) {
        open()
      } else {
        close()
      }
    }
  },
)

// Watch internal visibility changes
watch(isVisible, (newValue) => {
  if (newValue) {
    showOverlay()
  } else {
    hideOverlay()
  }
})

// Expose methods
defineExpose({
  open,
  close,
})

onBeforeUnmount(() => {
  hideOverlay()
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.os-dialog-enter-active,
.os-dialog-leave-active {
  transition: all 0.3s ease;
}

.os-dialog-enter-from,
.os-dialog-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
