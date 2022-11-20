<template lang="pug">
div(class="flex gap-2 h-full")
  //- Left column
  code-editor-window(
    v-if="gameStateStore.currentScene === Scenes.Challenge"
    class="grow"
  )
  monkey-work-window(
    v-else-if="gameStateStore.currentScene === Scenes.Work"
    class="grow"
  )
  div(
    v-else
    class="grow"
  )
    div home screen TBD
    div(class="space-x-2")
      os-button(@click="gameStateStore.currentScene = Scenes.Work") Work for Koto
      os-button(@click="gameStateStore.currentScene = Scenes.Challenge") Do a Challenge

  //- Right column
  div(
    class="basis-80 flex flex-col gap-2 shrink-0"
  )
    os-window(
      title="Profile"
      class="basis-52"
    )
      ul
        li Level 83 Cosmic Monkey
        li Dexterity: {{ gameStateStore.profile.codingSpeed }}
        li Scratches: {{ gameStateStore.profile.backScratches }}

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
import { useGameStateStore } from '@/stores/gameStateStore'
import { Scenes } from '@/stores/gameStateStore'
import OsButton from '@/components/OsButton.vue'

const gameStateStore = useGameStateStore()
</script>