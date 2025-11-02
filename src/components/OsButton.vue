<template lang="pug">
button(
  type="button",
  class="inline-flex items-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm text-liver shadow-xs hover:bg-gray-300 hover:text-gray-900 focus:bg-gray-400 focus:text-gray-900 focus:shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-hidden"
)
  slot TODO
  span(
    v-if="hotkey",
    class="ml-2 rounded-sm border border-neutral-400 bg-neutral-300 px-1 py-0.5 text-xs font-normal text-gray-500"
  ) {{ hotkey }}
</template>

<script lang="ts" setup>
const props = defineProps<{
  hotkey?: string
}>()
</script>
