<template lang="pug">
os-window(
  title="Elite Road Browser (build 1337)"
  no-padding
  ref="challengesWindow"
)
  //- Rows of challenges
  div(
    v-for="(row, index) in challengesAsRows"
    :key="index"
    class="flex gap-2 my-2 justify-center"
    )
    //- A challenge
    div(
      v-for="challenge in row"
      :key="challenge.id"
      class=" w-80 "
      )
      //- Completed
      div(
        v-if="getChallengeStatus(challenge) === 'completed'"
        class="border-kombu border-4 rounded-lg p-3 bg-gray-800"
        )
        div(class="flex justify-between")
          h2(class="") {{ challenge.name }}
          span(class="text-xs text-kombu") Completed
        div(class="text-sm") {{ challenge.description }}
        //div(class="text-xs") Depends on: {{ challenge.dependsOn }}
        div(class="flex justify-end mt-2")
          os-button(@click="openChallenge(challenge)") Replay

      //- Available
      div(
        v-else-if="getChallengeStatus(challenge) === 'unlocked'"
        class="border-liver border-4 rounded-lg p-3 bg-gray-800"
        )
        h2(class="") {{ challenge.name }}
        div(class="text-sm") {{ challenge.description }}
        div(class="flex justify-end mt-2")
          os-button(@click="openChallenge(challenge)") Open

      //- Locked
      div(
        v-else
        class="border-gray-600 border-4 rounded-lg p-3 bg-gray-800"
        )
        h2(class="text-gray-600") {{ challenge.name }}
        div(class="text-sm text-gray-600") {{ challenge.description }}
        div(class="flex justify-end mt-2")
          os-button Locked
      

  //pre(class="text-xs") {{ challengesAsRows }}

  template(#footer-right)
    OsButton(
      hotkey="Esc"
      @click="gameStateStore.currentEliteOsApp = EliteOsApps.Desktop"
      ) Back to Desktop

// TODO
  - Challenge entries
  - Tree view
  - Scrolling
</template>

<script setup lang="ts">
import OsWindow from '@/components/windows/OsWindow.vue'
import OsButton from '@/components/OsButton.vue'
import { EliteOsApps, useGameStateStore } from '@/stores/gameStateStore'
import { onKeyStroke } from '@vueuse/core'
import { challengesAsRows, type UnknownChallenge } from '@/content/challenges'

const gameStateStore = useGameStateStore()

onKeyStroke(['Escape'], () => {
  gameStateStore.currentEliteOsApp = EliteOsApps.Desktop
})

function getChallengeStatus(challenge: UnknownChallenge): 'completed' | 'unlocked' | 'locked' {
  // Return completed if challenge id is in completedChallenges.
  if (gameStateStore.progression.completedChallenges[challenge.id]) return 'completed'
  
  // Return unlocked if challenge has no dependencies, or if all dependencies are completed.
  let dependencies = challenge.dependsOn
  if (typeof(dependencies) === 'number') dependencies = [dependencies]
  if (!dependencies) return 'unlocked'
  if (dependencies.every(dependency => gameStateStore.progression.completedChallenges[dependency])) return 'unlocked'

  // Otherwise, return locked.
  return 'locked'
}

function openChallenge(challenge: UnknownChallenge): void {
  gameStateStore.currentChallenge = challenge
  gameStateStore.currentEliteOsApp = EliteOsApps.Challenge
}
</script>