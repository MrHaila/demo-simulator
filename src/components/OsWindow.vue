<template lang="pug">
div(class="border-solid rounded-lg border-4 border-liver shadow-md overflow-hidden")
  div(class="bg-liver h-8 flex items-center justify-between px-3 pb-1 font-bold")
    h1 {{ title }}

    slot(name="title-right")
  div(:class="[{ 'p-3': !noPadding }, 'bg-gray-900', 'rounded']")
    slot
      p Lorem ipsum dolor sit amet.
</template>

<script lang="ts" setup>
defineProps<{
  title: string
  noPadding?: boolean
}>()
</script>