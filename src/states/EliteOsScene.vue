<template lang="pug">
div(class="flex gap-2 h-full")
  code-editor-window(
    class="grow"
  )
  os-window(
    title="Profile"
    class="h-52 basis-80"
  ) Level 83 Cosmic Monkey
</template>

<script lang="ts" setup>
import CodeEditorWindow from '@/components/CodeEditorWindow.vue'
import OsWindow from '@/components/OsWindow.vue'
</script>