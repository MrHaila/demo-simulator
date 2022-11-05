<template lang="pug">
div(class="border-solid rounded-lg border-4 border-liver shadow-md")
  div(class="bg-liver h-8 flex items-center justify-between px-3")
    slot(name="title")
      h1 H4X_EDIT - New File

    slot(name="title-right")
      small stuff
  div(class="p-3 bg-gray-900 rounded")
    slot
      p Lorem ipsum dolor sit amet.
</template>

<script lang="ts" setup>

</script>