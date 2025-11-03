<template lang="pug">
OsDialog(
  title="Enter Your Hacker Name"
  :show-close-button="false"
  :close-on-backdrop-click="false"
  v-model="isVisible"
)
  div(class="space-y-4")
    p(class="text-gray-300") Welcome to EliteOS.
    p(class="text-gray-300") Before you proceed, you must identify yourself to the network.

    div(class="space-y-2")
      label(
        for="hacker-name"
        class="block text-sm font-medium text-gray-400"
      )
        | Hacker Name
      input#hacker-name(
        v-model="hackerName"
        ref="inputElement"
        type="text"
        :maxlength="maxLength"
        placeholder="eg. 1337-m4st3r"
        class="text-white focus:border-blue-500 focus:ring-blue-500 w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 placeholder-gray-500 focus:ring-1 focus:outline-none"
        @keydown.enter="handleSubmit"
      )
      div(class="flex justify-between text-xs text-gray-500")
        span {{ hackerName.length }} / {{ maxLength }} characters

    div(
      v-if="error"
      class="text-red-400 text-sm"
    )
      | {{ error }}

  template(#footer)
    OsButton(
      @click="handleSubmit"
      :disabled="!isValid"
      hotkey="Enter"
      hotkeyDisplay="Enter"
      variant="primary"
    )
      | Save
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue'
import OsButton from '@/components/OsButton.vue'
import OsDialog from '@/components/OsDialog.vue'
import { useGameStateStore } from '@/stores/gameStateStore'

interface Props {
  modelValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [name: string]
}>()

const gameStateStore = useGameStateStore()
const inputElement = ref<HTMLInputElement | null>(null)
const hackerName = ref('')
const error = ref('')
const isVisible = ref(props.modelValue)
const maxLength = 20

const isValid = computed(() => hackerName.value.trim().length >= 2 && hackerName.value.trim().length <= maxLength)

const handleSubmit = (): void => {
  error.value = ''

  const trimmedName = hackerName.value.trim()

  if (trimmedName.length < 2) {
    error.value = 'Hacker name must be at least 2 characters long.'
    return
  }

  if (trimmedName.length > maxLength) {
    error.value = `Hacker name cannot exceed ${maxLength} characters.`
    return
  }

  // Save to game state
  gameStateStore.profile.name = trimmedName

  emit('submit', trimmedName)
  isVisible.value = false
  emit('update:modelValue', false)
}

// Watch for external visibility changes
watch(
  () => props.modelValue,
  (newValue) => {
    isVisible.value = newValue
    if (newValue) {
      void nextTick(() => {
        inputElement.value?.focus()
      })
    }
  },
)

// Watch internal visibility changes
watch(isVisible, (newValue) => {
  emit('update:modelValue', newValue)
})

// Initialize with existing name if available
watch(
  () => gameStateStore.profile.name,
  (existingName) => {
    if (existingName && !hackerName.value) {
      hackerName.value = existingName
    }
  },
  { immediate: true },
)

// Expose methods
defineExpose({
  focus: () => inputElement.value?.focus(),
})
</script>
