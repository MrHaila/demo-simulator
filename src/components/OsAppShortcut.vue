<template lang="pug">
div(class="flex w-56 flex-col rounded-lg border-4 border-liver bg-gray-900 px-2 py-3 text-center")
  div(class="mx-auto mb-4 h-24 w-24 rounded-full bg-gray-700")
  h2(class="mb-1 font-bold") {{ title }}
  div(class="mb-3 grow text-sm font-light") {{ description }}
  div
    os-button(
      :hotkey="hotkey"
      @click="emits('button')"
    ) {{ buttonLabel }}
</template>

<script lang="ts" setup>
import OsButton from '@/components/OsButton.vue'
import type { KeyboardKey } from '@/types/keyboard'

defineProps<{
  title: string
  description: string
  buttonLabel: string
  hotkey?: KeyboardKey
}>()

const emits = defineEmits(['button'])
</script>
