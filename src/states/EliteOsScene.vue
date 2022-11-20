<template lang="pug">
div(class="flex gap-2 h-full")
  //- Left column
  //- code-editor-window(
  //-   class="grow"
  //- )
  monkey-work-window(
    class="grow"
  )

  //- Right column
  div(
    class="basis-80 flex flex-col gap-2 shrink-0"
  )
    os-window(
      title="Profile"
      class="basis-52"
    ) Level 83 Cosmic Monkey

    os-window(
      title="Mission"
      class="grow"
    )
      ul
        li 1. Hello World

</template>

<script lang="ts" setup>
import CodeEditorWindow from '@/components/CodeEditorWindow.vue'
import MonkeyWorkWindow from '@/components/MonkeyWorkWindow.vue'
import OsWindow from '@/components/OsWindow.vue'
</script>