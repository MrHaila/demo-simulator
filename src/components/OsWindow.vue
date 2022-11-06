<template lang="pug">
div(class="border-solid rounded-lg border-4 border-liver shadow-md flex flex-col")
  div(class="bg-liver flex items-center justify-between px-3 pb-1 font-bold basis-8 shrink-0")
    h1 {{ title }}

    slot(name="title-right")
  div(
    :class="[{ 'p-3': !noPadding }, 'bg-gray-900', 'rounded', 'grow', 'overflow-hidden']"
    @update="scrollToBottom"
    :ref="(el) => bodyElement = el"
    )
    slot
      p Lorem ipsum dolor sit amet.
</template>

<script lang="ts" setup>
import { ref } from 'vue'

defineProps<{
  title: string
  noPadding?: boolean
}>()

// Keep scrolled to the bottom. Needs to be called on nextTick().
const bodyElement = ref<any>(null)
function scrollToBottom () {
  if (bodyElement.value) bodyElement.value.scrollTop = bodyElement.value.scrollHeight
}
defineExpose({ scrollToBottom })
</script>