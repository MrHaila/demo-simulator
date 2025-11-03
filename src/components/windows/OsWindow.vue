<template lang="pug">
div(class="flex flex-col rounded-lg border-4 border-solid border-liver shadow-md")
  div(class="flex shrink-0 basis-8 items-center justify-between bg-liver px-3 pb-1 font-bold")
    h1 {{ title }}

    slot(name="title-right")
  div(
    :class="[{ 'p-3': !noPadding }, 'bg-gray-900', 'rounded-sm', 'grow', 'overflow-hidden']"
    @update="scrollToBottom"
    :ref="bodyElement"
  )
    slot
      p Lorem ipsum dolor sit amet.

  div(
    v-if="$slots['footer-right']"
    class="flex items-center justify-end space-x-2 bg-liver px-3 pt-2 pb-1 font-bold"
  )
    slot(name="footer-right")
</template>

<script lang="ts" setup>
import { ref, type VNodeRef } from 'vue'
import OsButton from '@/components/OsButton.vue'

defineProps<{
  title: string
  noPadding?: boolean
}>()

// Keep scrolled to the bottom. Needs to be called on nextTick().
const bodyElement = ref<VNodeRef>()
function scrollToBottom(): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- SIGH
  const element = bodyElement.value as unknown as HTMLElement
  if ('scrollTop' in element) {
    element.scrollTop = element.scrollHeight
  }
}
defineExpose({ scrollToBottom })
</script>
