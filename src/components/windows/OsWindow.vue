<template lang="pug">
div(class="border-solid rounded-lg border-4 border-liver shadow-md flex flex-col")
  div(class="bg-liver flex items-center justify-between px-3 pb-1 font-bold basis-8 shrink-0")
    h1 {{ title }}

    slot(name="title-right")
  div(
    :class="[{ 'p-3': !noPadding }, 'bg-gray-900', 'rounded-sm', 'grow', 'overflow-hidden']"
    @update="scrollToBottom"
    :ref="(el) => bodyElement = el"
    )
    slot
      p Lorem ipsum dolor sit amet.

  div(class="bg-liver flex items-center justify-end px-3 pt-2 pb-1 font-bold space-x-2" v-if="$slots['footer-right']")
    slot(name="footer-right")
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
function scrollToBottom (): void {
  if (bodyElement.value) bodyElement.value.scrollTop = bodyElement.value.scrollHeight
}
defineExpose({ scrollToBottom })
</script>