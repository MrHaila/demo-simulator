<template lang="pug">
os-window(
  title="Elite Road Browser (build 1337)",
  no-padding,
  ref="challengesWindow"
)
  //- Rows of challenges
  div(
    v-for="(row, index) in challengesAsRows",
    :key="index",
    class="my-2 flex justify-center gap-2"
  )
    //- A challenge
    div(
      v-for="challenge in row",
      :key="challenge.id",
      class="w-80"
    )
      //- Completed
      div(
        v-if="getChallengeStatus(challenge) === 'completed'",
        class="rounded-lg border-4 border-kombu bg-gray-800 p-3"
      )
        div(class="flex justify-between")
          h2(class="") {{ challenge.name }}
          span(class="text-xs text-kombu") Completed
        div(class="text-sm") {{ challenge.description }}
        //div(class="text-xs") Depends on: {{ challenge.dependsOn }}
        div(class="mt-2 flex justify-end")
          os-button(@click="openChallenge(challenge)") Replay

      //- Available
      div(
        v-else-if="getChallengeStatus(challenge) === 'unlocked'",
        class="rounded-lg border-4 border-liver bg-gray-800 p-3"
      )
        h2(class="") {{ challenge.name }}
        div(class="text-sm") {{ challenge.description }}
        div(class="mt-2 flex justify-end")
          os-button(@click="openChallenge(challenge)") Open

      //- Locked
      div(
        v-else,
        class="rounded-lg border-4 border-gray-600 bg-gray-800 p-3"
      )
        h2(class="text-gray-600") {{ challenge.name }}
        div(class="text-sm text-gray-600") {{ challenge.description }}
        div(class="mt-2 flex justify-end")
          os-button Locked

  //pre(class="text-xs") {{ challengesAsRows }}

  template(#footer-right)
    OsButton(
      hotkey="Escape",
      @click="gameStateStore.currentEliteOsApp = EliteOsApps.Desktop"
    ) Back to Desktop

// TODO
  - Challenge entries
  - Tree view
  - Scrolling
</template>

<script setup lang="ts">
import OsButton from '@/components/OsButton.vue'
import OsWindow from '@/components/windows/OsWindow.vue'
import { challengesAsRows, type UnknownChallenge } from '@/content/challenges'
import { EliteOsApps, useGameStateStore } from '@/stores/gameStateStore'

const gameStateStore = useGameStateStore()

function getChallengeStatus(challenge: UnknownChallenge): 'completed' | 'unlocked' | 'locked' {
  // Return completed if challenge id is in completedChallenges.
  if (gameStateStore.progression.completedChallenges[challenge.id]) return 'completed'

  // Return unlocked if challenge has no dependencies, or if all dependencies are completed.
  let dependencies = challenge.dependsOn
  if (typeof dependencies === 'number') dependencies = [dependencies]
  if (!dependencies) return 'unlocked'
  if (dependencies.every((dependency) => gameStateStore.progression.completedChallenges[dependency])) return 'unlocked'

  // Otherwise, return locked.
  return 'locked'
}

function openChallenge(challenge: UnknownChallenge): void {
  gameStateStore.currentChallenge = challenge
  gameStateStore.currentEliteOsApp = EliteOsApps.Challenge
}
</script>
