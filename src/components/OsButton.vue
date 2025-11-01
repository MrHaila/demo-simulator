<template lang="pug">
button(
  type="button"
  class="inline-flex items-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm text-liver shadow-xs hover:bg-gray-300 hover:text-gray-900 focus:outline-hidden focus:ring-2 focus:bg-gray-400 focus:text-gray-900 focus:ring-offset-2 focus:shadow-sm"
  )
    slot TODO
    span(
      v-if="hotkey"
      class="text-gray-500 font-normal ml-2 text-xs border-neutral-400 bg-neutral-300 border rounded-sm py-0.5 px-1"
      ) {{ hotkey }}
</template>

<script lang="ts" setup>
const props = defineProps<{
  hotkey?: string
}>()
</script>