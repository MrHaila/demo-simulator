<template lang="pug">
div(class="flex gap-2 h-full")
  //- Left column
  challenges-window(
    v-if="gameStateStore.currentScene === Scenes.ChallengesList"
    class="grow"
  )
  code-editor-window(
    v-else-if="gameStateStore.currentScene === Scenes.Challenge"
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
    div ELITE OS
    div All Software ------------------------------------------------
    div(class="flex justify-evenly space-x-2")
      os-app-shortcut(
        title="Scene Explorer 1337"
        description="The definitive source of all Scene challenges and compos."
        buttonLabel="Open  Challenges"
        @button="gameStateStore.currentScene = Scenes.ChallengesList"
        )
      os-app-shortcut(
        title="Monkey Works X Pro"
        description="You have been assigned a floating license for Monkey Works X Pro by Koto Group Global Ltd."
        buttonLabel="Open Work"
        @button="gameStateStore.currentScene = Scenes.Work"
        )
      os-app-shortcut(
        title="Kotoshop"
        description="Want skills? Old Koto has what you need... for a price."
        buttonLabel="Open Shop"
        @button="gameStateStore.currentScene = Scenes.Home"
        )
      os-app-shortcut(
        title="silk_road.app"
        description="This is application is from an unidentified developer. It is not recommended to run this application."
        buttonLabel="Open App"
        @button="gameStateStore.currentScene = Scenes.Home"
        )

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
import ChallengesWindow from '@/components/ChallengesWindow.vue'
import OsWindow from '@/components/OsWindow.vue'
import { useGameStateStore } from '@/stores/gameStateStore'
import { Scenes } from '@/stores/gameStateStore'
import OsAppShortcut from '@/components/OsAppShortcut.vue'

const gameStateStore = useGameStateStore()
</script>