<template lang="pug">
//- TODO
  - Confetti? https://confetti.js.org/#

div(class="p-2 flex gap-2 h-full")
  //- Left column
  ChallengesWindow(
    v-if="gameStateStore.currentEliteOsApp === EliteOsApps.ChallengesList"
    class="grow"
  )
  CodeEditorWindow(
    v-else-if="gameStateStore.currentEliteOsApp === EliteOsApps.Challenge"
    class="grow"
  )
  MonkeyWorkWindow(
    v-else-if="gameStateStore.currentEliteOsApp === EliteOsApps.Work"
    class="grow"
  )
  div(
    v-else
    class="grow px-2"
  )
    ParticlesComponent(
      id="tsparticles"
      class="absolute top-0 left-0 w-full h-full -z-50"
      :particlesInit="particlesInit"
      :options="particleOptions"
    )

    div(class="flex justify-center my-6")
      EliteOsLogo(class="fill-gray-600 w-96")

    div(class="flex my-6 items-center gap-4 text-gray-600")
      p(class="uppercase") All Software
      hr(class="flex-grow border-gray-600")
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

OsTalkingHead(:placement="NarrativePlacements.Desktop")

//- TODO: fade
div(:class="['absolute bottom-0 left-0 right-0 top-0 bg-neutral-900 opacity-70 z-10 flex flex-col justify-end', { 'hidden': !isOverlayVisible }]")
  div(class="w-full text-right text-xs p-2 text-gray-400") DEBUG: {{ totalSubscribers }} subscriber{{ totalSubscribers === 1 ? '' : 's'}}

</template>

<script lang="ts" setup>
import CodeEditorWindow from '@/components/windows/ChallengeWindow.vue'
import MonkeyWorkWindow from '@/components/windows/MonkeyWorkWindow.vue'
import ChallengesWindow from '@/components/windows/ChallengesListWindow.vue'
import OsWindow from '@/components/windows/OsWindow.vue'
import { useGameStateStore } from '@/stores/gameStateStore'
import { EliteOsApps } from '@/stores/gameStateStore'
import OsAppShortcut from '@/components/OsAppShortcut.vue'
import EliteOsLogo from '@/assets/EliteOsLogo.vue'
import OsTalkingHead from '@/components/OsNarrativeOverlay.vue'

import { useOverlay } from '@/components/composables/OsOverlay'

import { ParticlesComponent } from 'vue3-particles'
import { loadFull } from 'tsparticles'
import type { RecursivePartial, IOptions } from 'tsparticles-engine'
import { NarrativePlacements } from '@/content/narrative'

const { isOverlayVisible, totalSubscribers } = useOverlay()

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