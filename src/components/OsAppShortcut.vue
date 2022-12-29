<template lang="pug">
div(class="w-56 bg-gray-900 text-center flex flex-col py-3 px-2 border-liver rounded-lg border-4")
  div(class="rounded-full bg-gray-700 w-24 h-24 mx-auto mb-4")
  h2(class="font-bold mb-1") {{ title }}
  div(class="font-light text-sm grow mb-3") {{ description }}
  div
    os-button(@click="emits('button')") {{ buttonLabel }}
</template>

<script lang="ts" setup>
import OsButton from '@/components/OsButton.vue'

defineProps<{
  title: string
  description: string
  buttonLabel: string
}>()

const emits = defineEmits(['button'])
</script>
