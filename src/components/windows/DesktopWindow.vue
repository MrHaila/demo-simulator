<template lang="pug">
div(class="px-2")
  //- Logo
  div(class="my-6 flex justify-center")
    EliteOsLogo(class="w-96 fill-gray-600")

  //- Divider
  div(class="my-6 flex items-center gap-4 text-gray-600")
    p(class="uppercase select-none") Official Software
    hr(class="grow border-gray-600")

  //- Apps
  div(class="flex justify-evenly space-x-2")
    OsAppShortcut(
      title="Elite Road",
      description="So, you think you can code? Prove it.",
      buttonLabel="Open Challenges",
      hotkey="c",
      @button="gameStateStore.currentEliteOsApp = EliteOsApps.ChallengesList"
    )
    OsAppShortcut(
      title="Monkey Works X Pro",
      description="You have been assigned a floating license for Monkey Works X Pro by Koko Group Global Ltd.",
      buttonLabel="Open Work",
      hotkey="w",
      @button="gameStateStore.currentEliteOsApp = EliteOsApps.Work"
    )
    OsAppShortcut(
      title="Kokoshop",
      description="Itching for skills? Old Koko has what you need... if you've got the scratch for it.",
      buttonLabel="Open Shop",
      hotkey="s",
      @button="gameStateStore.currentEliteOsApp = EliteOsApps.Desktop"
    )

  //- Untrusted Software Section
  div(class="my-6 flex items-center gap-4 text-gray-600")
    p(class="uppercase select-none") Untrusted Software
    hr(class="grow border-red-600")

  //- Untrusted Apps
  div(class="flex justify-center space-x-2")
    OsAppShortcut(
      title="silk_road.app",
      description="This is application is from an unidentified developer. It is not recommended to run this application.",
      buttonLabel="Open App",
      hotkey="r",
      @button="gameStateStore.currentEliteOsApp = EliteOsApps.Desktop"
    )
</template>

<script lang="ts" setup>
import EliteOsLogo from '@/assets/EliteOsLogo.vue'
import OsAppShortcut from '@/components/OsAppShortcut.vue'
import { EliteOsApps, useGameStateStore } from '@/stores/gameStateStore'
import { useNarrativeScene } from '../composables/OsNarrativeScene'

const gameStateStore = useGameStateStore()
const { showNarrativeScene } = useNarrativeScene()

if (gameStateStore.narrativeSceneQueues.desktop.length > 0) {
  if (!gameStateStore.narrativeSceneQueues.desktop[0]) throw new Error('Narrative scene queue is empty.')
  showNarrativeScene(gameStateStore.narrativeSceneQueues.desktop[0], () => {
    gameStateStore.narrativeSceneQueues.desktop.shift()
  })
}
</script>
