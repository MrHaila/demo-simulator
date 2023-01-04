<template lang="pug">
os-window(
  title="Scene Explorer v1337"
  no-padding
  ref="challengesWindow"
)
  div(v-for="row in challengesAsRows" class="flex gap-2 my-2 justify-center")
    div(v-for="challenge in row" :key="challenge.id" class="p-3 border-4 bg-gray-800 w-80")
      div(v-if="getChallengeStatus(challenge) === 'completed'" class="border-liver")
        h2(class="") {{ challenge.name }}
        div(class="text-sm") {{ challenge.description }}
        //div(class="text-xs") Depends on: {{ challenge.dependsOn }}
        div(class="flex justify-end mt-2")
          p Completed

      div(v-else-if="getChallengeStatus(challenge) === 'unlocked'" class="border-liver")
        h2(class="") {{ challenge.name }}
        div(class="text-sm") {{ challenge.description }}
        div(class="flex justify-end mt-2")
          os-button(@click="openChallenge(challenge)") Open

      div(v-else class="border-gray-600")
        h2(class="text-gray-600") {{ challenge.name }}
        div(class="text-sm text-gray-600") {{ challenge.description }}
        div(class="flex justify-end mt-2")
          os-button Locked
      

  //pre(class="text-xs") {{ challengesAsRows }}

  template(#footer-right)
    os-button(@click="gameStateStore.currentEliteOsApp = EliteOsApps.Desktop") Back to Desktop

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

function getChallengeStatus(challenge: UnknownChallenge) {
  if (gameStateStore.progression.completedChallenges[challenge.id]) return 'completed'
  else if (challenge.dependsOn === false) return 'unlocked'
  return 'locked'
}

function openChallenge(challenge: UnknownChallenge) {
  gameStateStore.currentChallenge = challenge
  gameStateStore.currentEliteOsApp = EliteOsApps.Challenge
}
</script>