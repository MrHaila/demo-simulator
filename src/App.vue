<template lang="pug">
div(class="h-screen")
  boot-scene(v-if="gameStateStore.currentScene === Scenes.Boot" @done="gameStateStore.currentScene = Scenes.Home")
  elite-os-scene(v-else)
</template>

<script setup lang="ts">
import BootScene from "./states/BootScene.vue"
import EliteOsScene from "./states/EliteOsScene.vue"
import { useGameStateStore, Scenes, currentSaveVersion } from "./stores/gameStateStore"

const gameStateStore = useGameStateStore()

// Reset the game state if the save version is old
if (gameStateStore.profile.saveVersion < currentSaveVersion) {
  console.warn(`Resetting game state because save version is old. ${gameStateStore.profile.saveVersion} < ${currentSaveVersion}`)
  gameStateStore.resetGame()
}
</script>
