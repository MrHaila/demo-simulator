<template lang="pug">
div(class='flex flex-col rounded-lg border-4 border-solid border-liver shadow-md')
  div(class='flex shrink-0 basis-8 items-center justify-between bg-liver px-3 pb-1 font-bold')
    h1 {{ title }}

    slot(name='title-right')
  div(
    :class='[{ "p-3": !noPadding }, "bg-gray-900", "rounded-sm", "grow", "overflow-hidden"]'
    @update='scrollToBottom'
    :ref='(el) => (bodyElement = el as HTMLElement)'
  )
    slot
      p Lorem ipsum dolor sit amet.

  div(
    v-if='$slots["footer-right"]'
    class='flex items-center justify-end space-x-2 bg-liver px-3 pt-2 pb-1 font-bold'
  )
    slot(name='footer-right')
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import OsButton from '@/components/OsButton.vue'

defineProps<{
  title: string
  noPadding?: boolean
}>()

// Keep scrolled to the bottom. Needs to be called on nextTick().
const bodyElement = ref<HTMLElement | null>(null)
function scrollToBottom(): void {
  if (bodyElement.value) bodyElement.value.scrollTop = bodyElement.value.scrollHeight
}
defineExpose({ scrollToBottom })
</script>
