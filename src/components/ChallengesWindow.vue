<template lang="pug">
os-window(
  title="Scene Explorer 1337 - Elite Road"
  no-padding
  ref="challengesWindow"
)

// TODO
  - Challenge entries
  - Tree view
  - Scrolling
</template>

<script setup lang="ts">
import OsWindow from '@/components/OsWindow.vue'
import { Scenes, useGameStateStore } from '@/stores/gameStateStore';
import { onKeyStroke } from '@vueuse/core'

const gameStateStore = useGameStateStore()

onKeyStroke(['Escape'], () => {
  gameStateStore.currentScene = Scenes.Home
})
</script>