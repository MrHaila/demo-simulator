<template lang="pug">
div(class="container mx-auto")
  boot-scene(v-if="gameStateStore.currentScene === scenes.Boot" @done="gameStateStore.currentScene = scenes.Os")

  div(v-else class="border-solid rounded-lg border-4 border-liver shadow-md")
    div(class="bg-liver h-8 flex flex-col justify-center pl-3")
      h1 H4X_EDIT - New File
    div(class="p-3 bg-gray-900 rounded")
      p Lorem ipsum dolor sit amet.
</template>

<script setup lang="ts">
import BootScene from "./states/BootScene.vue"
import { useGameStateStore, scenes } from "./stores/counter"

const gameStateStore = useGameStateStore()
</script>
