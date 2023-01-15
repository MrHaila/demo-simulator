<template lang="pug">
div(class="px-2")
  //- Logo
  div(class="flex justify-center my-6")
    EliteOsLogo(class="fill-gray-600 w-96")

  //- Divider
  div(class="flex my-6 items-center gap-4 text-gray-600")
    p(class="uppercase") All Software
    hr(class="flex-grow border-gray-600")
  
  //- Apps
  div(class="flex justify-evenly space-x-2")
    OsAppShortcut(
      title="Scene Explorer"
      description="The definitive source of all Scene challenges and compos."
      buttonLabel="Open  Challenges"
      @button="gameStateStore.currentEliteOsApp = EliteOsApps.ChallengesList"
      )
    OsAppShortcut(
      title="Monkey Works X Pro"
      description="You have been assigned a floating license for Monkey Works X Pro by Koko Group Global Ltd."
      buttonLabel="Open Work"
      @button="gameStateStore.currentEliteOsApp = EliteOsApps.Work"
      )
    OsAppShortcut(
      title="Kokoshop"
      description="Itching for skills? Old Koko has what you need... if you've got the scratch for it."
      buttonLabel="Open Shop"
      @button="gameStateStore.currentEliteOsApp = EliteOsApps.Desktop"
      )
    OsAppShortcut(
      title="silk_road.app"
      description="This is application is from an unidentified developer. It is not recommended to run this application."
      buttonLabel="Open App"
      @button="gameStateStore.currentEliteOsApp = EliteOsApps.Desktop"
      )
</template>

<script lang="ts" setup>
import OsAppShortcut from '@/components/OsAppShortcut.vue'
import EliteOsLogo from '@/assets/EliteOsLogo.vue'
import OsNarrativeScene from '@/components/OsNarrativeScene.vue'

import { useGameStateStore } from '@/stores/gameStateStore'
import { EliteOsApps } from '@/stores/gameStateStore'
import { useNarrativeScene } from '../composables/OsNarrativeScene'

const gameStateStore = useGameStateStore()
const { showNarrativeScene } = useNarrativeScene()

if (gameStateStore.narrativeSceneQueues.desktop.length > 0) {
  showNarrativeScene(gameStateStore.narrativeSceneQueues.desktop[0], () => {
    gameStateStore.narrativeSceneQueues.desktop.shift()
  })
}
</script>