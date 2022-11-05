<template lang="pug">
div(class="p-2 h-screen")
  boot-scene(v-if="gameStateStore.currentScene === scenes.Boot" @done="gameStateStore.currentScene = scenes.Os")
  elite-os-scene(v-else)
  //div(v-else class="border-solid rounded-lg border-4 border-liver shadow-md")
    div(class="bg-liver h-8 flex flex-col justify-center pl-3")
      h1 H4X_EDIT - New File
    div(class="p-3 bg-gray-900 rounded")
      p Lorem ipsum dolor sit amet.
</template>

<script setup lang="ts">
import BootScene from "./states/BootScene.vue"
import EliteOsScene from "./states/EliteOsScene.vue"
import { useGameStateStore, scenes } from "./stores/counter"

const gameStateStore = useGameStateStore()
</script>
