<template lang="pug">
//- TODO
  - Confetti? https://confetti.js.org/#

ParticlesComponent(
  id="tsparticles"
  class="absolute top-0 left-0 w-full h-full -z-50"
  :particlesInit="particlesInit"
  :options="particleOptions"
  )

OsNarrativeScene(
  v-if="currentNarrativeScene"
  :narrativeScene="currentNarrativeScene"
  )

div(class="p-2 flex gap-2 h-full")
  //- Left column
  ChallengesWindow(
    v-if="gameStateStore.currentEliteOsApp === EliteOsApps.ChallengesList"
    class="grow"
    )
  ChallengeWindow(
    v-else-if="gameStateStore.currentEliteOsApp === EliteOsApps.Challenge"
    class="grow"
    )
  MonkeyWorkWindow(
    v-else-if="gameStateStore.currentEliteOsApp === EliteOsApps.Work"
    class="grow"
    )
  DesktopWindow(
    v-else
    class="grow"
    )

  //- Right column
  div(
    class="basis-80 flex flex-col gap-2 shrink-0"
  )
    OsWindow(
      title="Profile"
      class=""
    )
      ul
        li Level 83 Cosmic Monkey
        li {{ RedactText('Dexterity', !!gameStateStore.profile.codingSpeed) }}: {{ gameStateStore.profile.codingSpeed }}
        li {{ RedactText('Power', !!gameStateStore.profile.codingSkill) }}: {{ gameStateStore.profile.codingSkill }}

    OsWindow(
      v-if="gameStateStore.currentEliteOsApp !== EliteOsApps.Challenge"
      title="Assets"
      class=""
    )
      ul
        li {{ RedactText('Scratches', !!gameStateStore.profile.backScratches) }}: {{ gameStateStore.profile.backScratches }}
        li {{ RedactText('Juice boxes', !!gameStateStore.profile.juiceBoxes) }}: {{ gameStateStore.profile.juiceBoxes }}

    OsWindow(
      v-if="gameStateStore.currentEliteOsApp === EliteOsApps.Challenge"
      title="Challenge Info"
      class=""
    )
      ul
        li {{ gameStateStore.currentChallenge?.description }}

    OsWindow(
      title="Mission"
      class="grow"
    )
      ul
        li 1. Hello World

//- TODO: fade
div(:class="['absolute bottom-0 left-0 right-0 top-0 bg-neutral-900 opacity-70 z-10 flex flex-col justify-end', { 'hidden': !isOverlayVisible }]")
  div(class="w-full text-right text-xs p-2 text-gray-400") DEBUG: {{ totalSubscribers }} subscriber{{ totalSubscribers === 1 ? '' : 's'}}

</template>

<script lang="ts" setup>
import ChallengeWindow from '@/components/windows/ChallengeWindow.vue'
import MonkeyWorkWindow from '@/components/windows/MonkeyWorkWindow.vue'
import ChallengesWindow from '@/components/windows/ChallengesListWindow.vue'
import DesktopWindow from '@/components/windows/DesktopWindow.vue'
import OsWindow from '@/components/windows/OsWindow.vue'
import { useGameStateStore } from '@/stores/gameStateStore'
import { EliteOsApps } from '@/stores/gameStateStore'

import OsNarrativeScene from '@/components/OsNarrativeScene.vue'
import { useNarrativeScene } from '@/components/composables/OsNarrativeScene'

import { useOverlay } from '@/components/composables/OsOverlay'

import { ParticlesComponent } from 'vue3-particles'
import { loadFull } from 'tsparticles'
import type { RecursivePartial, IOptions } from 'tsparticles-engine'

const { isOverlayVisible, totalSubscribers } = useOverlay()
const { currentNarrativeScene } = useNarrativeScene()

const particlesInit = async (engine: any) => {
  await loadFull(engine)
}

const particleOptions = {
  fpsLimit: 120,
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: 'repulse'
      },
      resize: true
    },
    modes: {
      bubble: {
        distance: 400,
        duration: 2,
        opacity: 0.8,
        size: 40
      },
      repulse: {
        distance: 140,
        duration: 0.4
      }
    }
  },
  particles: {
    color: {
      value: '#ffffff'
    },
    links: {
      color: '#ffffff',
      distance: 140,
      enable: true,
      opacity: 0.3,
      width: 1
    },
    move: {
      enable: true,
      outModes: {
        default: 'out'
      },
      random: false,
      speed: 2.5,
      straight: false
    },
    number: {
      density: {
        enable: true,
        area: 800
      },
      value: 60
    },
    opacity: {
      value: 0.2
    },
    shape: {
      type: 'circle'
    },
    size: {
      random: true,
      value: 5
    }
  }
} satisfies RecursivePartial<IOptions>

const gameStateStore = useGameStateStore()

function RedactText(text: string, skip: boolean = false) {
  if (!skip) text = text.replace(/./g, '?')
  return text
}
</script>