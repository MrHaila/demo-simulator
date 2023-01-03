<template lang="pug">
div(class="flex gap-2 h-full")
  //- Left column
  challenges-window(
    v-if="gameStateStore.currentEliteOsApp === EliteOsApps.ChallengesList"
    class="grow"
  )
  code-editor-window(
    v-else-if="gameStateStore.currentEliteOsApp === EliteOsApps.Challenge"
    class="grow"
  )
  monkey-work-window(
    v-else-if="gameStateStore.currentEliteOsApp === EliteOsApps.Work"
    class="grow"
  )
  div(
    v-else
    class="grow px-2"
  )
    div(class="flex justify-center my-6")
      EliteOsLogo(class="fill-gray-600 w-96")
    
    div(class="flex my-6 items-center gap-4 text-gray-600")
      p(class="uppercase") All Software
      hr(class="flex-grow border-gray-600")
    div(class="flex justify-evenly space-x-2")
      os-app-shortcut(
        title="Scene Explorer 1337"
        description="The definitive source of all Scene challenges and compos."
        buttonLabel="Open  Challenges"
        @button="gameStateStore.currentEliteOsApp = EliteOsApps.ChallengesList"
        )
      os-app-shortcut(
        title="Monkey Works X Pro"
        description="You have been assigned a floating license for Monkey Works X Pro by Koto Group Global Ltd."
        buttonLabel="Open Work"
        @button="gameStateStore.currentEliteOsApp = EliteOsApps.Work"
        )
      os-app-shortcut(
        title="Kotoshop"
        description="Want skills? Old Koto has what you need... for a price."
        buttonLabel="Open Shop"
        @button="gameStateStore.currentEliteOsApp = EliteOsApps.Desktop"
        )
      os-app-shortcut(
        title="silk_road.app"
        description="This is application is from an unidentified developer. It is not recommended to run this application."
        buttonLabel="Open App"
        @button="gameStateStore.currentEliteOsApp = EliteOsApps.Desktop"
        )

  //- Right column
  div(
    class="basis-80 flex flex-col gap-2 shrink-0"
  )
    os-window(
      title="Profile"
      class=""
    )
      ul
        li Level 83 Cosmic Monkey
        li {{ RedactText('Dexterity', !!gameStateStore.profile.codingSpeed) }}: {{ gameStateStore.profile.codingSpeed }}
        li {{ RedactText('Power', !!gameStateStore.profile.codingSkill) }}: {{ gameStateStore.profile.codingSkill }}

    os-window(
      v-if="gameStateStore.currentEliteOsApp !== EliteOsApps.Challenge"
      title="Assets"
      class=""
    )
      ul
        li {{ RedactText('Scratches', !!gameStateStore.profile.backScratches) }}: {{ gameStateStore.profile.backScratches }}
        li {{ RedactText('Juice boxes', !!gameStateStore.profile.juiceBoxes) }}: {{ gameStateStore.profile.juiceBoxes }}

    OsWindow(
      v-if="gameStateStore.currentEliteOsApp === EliteOsApps.Challenge"
      title="Challenge TBD"
      class=""
    )
      ul
        li Goal or score board or something?

    os-window(
      title="Mission"
      class="grow"
    )
      ul
        li 1. Hello World

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

const gameStateStore = useGameStateStore()

function RedactText(text: string, skip: boolean = false) {
  if (!skip) text = text.replace(/./g, '?')
  return text
}
</script>