<template lang="pug">
//- TODO
  - Confetti? https://confetti.js.org/#

vue-particles#tsparticlesdiv(
  :options="particleOptions",
  class="absolute top-0 left-0 -z-50 h-full w-full"
)

OsNarrativeScene(
  v-if="currentNarrativeScene",
  :narrativeScene="currentNarrativeScene"
)

div(class="flex h-full gap-2 p-2")
  //- Left column
  ChallengesWindow(
    v-if="gameStateStore.currentEliteOsApp === EliteOsApps.ChallengesList",
    class="grow"
  )
  ChallengeWindow(
    v-else-if="gameStateStore.currentEliteOsApp === EliteOsApps.Challenge",
    class="grow"
  )
  MonkeyWorkWindow(
    v-else-if="gameStateStore.currentEliteOsApp === EliteOsApps.Work",
    class="grow"
  )
  EnterNameWindow(
    v-else-if="gameStateStore.currentEliteOsApp === EliteOsApps.EnterName",
    class="grow"
  )
  DesktopWindow(
    v-else,
    class="grow"
  )

  //- Right column
  div(
    class="flex shrink-0 basis-80 flex-col gap-2",
    v-if="gameStateStore.currentEliteOsApp !== EliteOsApps.EnterName"
  )
    OsWindow(
      title="Profile",
      class=""
    )
      div(class="space-y-2")
        div(class="flex items-baseline gap-2")
          span(class="font-medium") {{ gameStateStore.profile.name }}
          span(class="text-sm text-gray-500") {{ gameStateStore.profile.title }}
        div(class="grid grid-cols-2 gap-x-4 gap-y-1 text-sm")
          div {{ RedactText('Dexterity', !!gameStateStore.profile.codingSpeed) }}:
          div(class="text-right font-mono") {{ gameStateStore.profile.codingSpeed }}
          div {{ RedactText('Intelligence', !!gameStateStore.profile.codingSkill) }}:
          div(class="text-right font-mono") {{ gameStateStore.profile.codingSkill }}

      OsButton(
        @click="resetAndReload",
        variant="ghost",
        size="sm",
        class="mt-2 text-xs text-gray-500"
      ) Reset Game

    OsWindow(
      v-if="gameStateStore.currentEliteOsApp !== EliteOsApps.Challenge",
      title="Assets",
      class=""
    )
      div(class="grid grid-cols-2 gap-x-4 gap-y-1 text-sm")
        div {{ RedactText('Scratches', !!gameStateStore.profile.scratches) }}:
        div(class="text-right font-mono") {{ gameStateStore.profile.scratches }}
        div {{ RedactText('Juice boxes', !!gameStateStore.profile.juiceBoxes) }}:
        div(class="text-right font-mono") {{ gameStateStore.profile.juiceBoxes }}

    OsWindow(
      v-if="gameStateStore.currentEliteOsApp === EliteOsApps.Challenge",
      title="Challenge Info",
      class=""
    )
      ul
        li {{ gameStateStore.currentChallenge?.description }}

    OsWindow(
      title="Mission",
      class="grow"
    )
      ul
        li 1. Hello World

//- TODO: fade
div(
  :class="['absolute bottom-0 left-0 right-0 top-0 bg-neutral-900 opacity-70 z-10 flex flex-col justify-end', { hidden: !isOverlayVisible }]"
)
  div(class="w-full p-2 text-right text-xs text-gray-400") DEBUG: {{ totalSubscribers }} subscriber{{ totalSubscribers === 1 ? '' : 's' }}
</template>

<script lang="ts" setup>
import { useNarrativeScene } from '@/components/composables/OsNarrativeScene'
import { useOverlay } from '@/components/composables/OsOverlay'
import OsButton from '@/components/OsButton.vue'
import OsNarrativeScene from '@/components/OsNarrativeScene.vue'
import ChallengesWindow from '@/components/windows/ChallengesListWindow.vue'
import ChallengeWindow from '@/components/windows/ChallengeWindow.vue'
import DesktopWindow from '@/components/windows/DesktopWindow.vue'
import EnterNameWindow from '@/components/windows/EnterNameWindow.vue'
import MonkeyWorkWindow from '@/components/windows/MonkeyWorkWindow.vue'
import OsWindow from '@/components/windows/OsWindow.vue'
import { EliteOsApps, useGameStateStore } from '@/stores/gameStateStore'

const { isOverlayVisible, totalSubscribers } = useOverlay()
const { currentNarrativeScene } = useNarrativeScene()

const particleOptions = {
  fpsLimit: 120,
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: 'repulse',
      },
      resize: true,
    },
    modes: {
      bubble: {
        distance: 400,
        duration: 2,
        opacity: 0.8,
        size: 40,
      },
      repulse: {
        distance: 140,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: '#ffffff',
    },
    links: {
      color: '#ffffff',
      distance: 140,
      enable: true,
      opacity: 0.3,
      width: 1,
    },
    move: {
      enable: true,
      outModes: {
        default: 'out',
      },
      random: false,
      speed: 2.5,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 60,
    },
    opacity: {
      value: 0.2,
    },
    shape: {
      type: 'circle',
    },
    size: {
      random: true,
      value: 5,
    },
  },
}

const gameStateStore = useGameStateStore()

// Ask for name if not set.
if (gameStateStore.profile.name === '') {
  gameStateStore.currentEliteOsApp = EliteOsApps.EnterName
}

function RedactText(text: string, skip = false): string {
  const result = skip ? text : text.replace(/./g, '?')
  return result
}

function resetAndReload(): void {
  // Reset game state
  gameStateStore.resetGame()

  // Reload the page to start fresh
  window.location.reload()
}
</script>
