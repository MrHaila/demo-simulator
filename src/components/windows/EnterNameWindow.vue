<template lang="pug">
HackerNameDialog(
  v-model="isVisible",
  @submit="handleSubmit"
)
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import HackerNameDialog from '@/components/HackerNameDialog.vue'
import { EliteOsApps, useGameStateStore } from '@/stores/gameStateStore'

const gameStateStore = useGameStateStore()
const isVisible = ref(true)

const handleSubmit = (name: string): void => {
  // Name is already saved to game state in the dialog component
  // Navigate to desktop after name is set
  gameStateStore.currentEliteOsApp = EliteOsApps.Desktop
}
</script>
