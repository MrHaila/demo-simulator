<template lang="pug">
//- TODO:
  - Get text from the current scene.
  - Layout with a talking head image.
  - Layout should alternate between left and right.
  - Layout should be responsive.
  - Clicking should get the next text from the scene.
  - Clicking should close the overlay if there is no more text in the scene.

//- Centered container
div(
  v-if="!!currentNarrativeScene"
  :class="['absolute top-1/2 left-1/2 transform -translate-y-1/2 w-4/12 z-20 bg-gray-900 backdrop-blur-sm bg-opacity-70 border-liver border-4 rounded-xl flex', { '-translate-x-3/4': currentDialogue?.alignment !== 'right', '-translate-x-1/4 flex-row-reverse': currentDialogue?.alignment === 'right'}]"
  )
  div(v-show="currentDialogue?.author") 
    img(
      :src="getCharacterAvatarImageUrl(currentDialogue?.author)"
      :class="['h-32 rounded-l-lg', { 'rounded-l-none rounded-r-lg': currentDialogue?.alignment === 'right' }]"
      )
  div(:class="['grow flex flex-col rounded-r-lg border-liver', { 'border-l-4': currentDialogue?.alignment !== 'right' && currentDialogue?.author, 'rounded-r-none rounded-l-lg border-r-4': currentDialogue?.alignment === 'right' }]")
    div(
      v-show="currentDialogue?.author"
      :class="['bg-liver px-3 py-1 relative -top-1 rounded-tr-lg', { 'rounded-tl-lg rounded-tr-none': currentDialogue?.alignment === 'right' }]"
      )
      aside(class="italic") {{ currentDialogue?.author }}
    div(
      v-if="currentDialogue?.author"
      class="px-3 grow py-2"
      )
      h1(class="text-xl") "{{ currentDialogue.text }}"
    div(
      v-else
      class="px-3 py-2"
      )
      h1 {{ currentDialogue?.text }}

    p(class="text-xs my-3 text-center animate-pulse text-gray-400") Press any key to continue.

  //div(class="text-xs p-2 text-gray-400")
    p Current scene: {{ currentNarrativeScene?.id }}
</template>

<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue'
import { useOverlay } from '@/components/composables/OsOverlay'
import { NarrativePlacements, getCharacterAvatarImageUrl } from '@/content/narrative'
import { useGameStateStore } from '@/stores/gameStateStore'
import { onKeyStroke, useWindowFocus } from '@vueuse/core'

const { showOverlay, hideOverlay } = useOverlay()

const props = defineProps<{
  placement: NarrativePlacements
}>()

const gameStateStore = useGameStateStore()
const currentNarrativeScene = computed(() => {
  if (props.placement === NarrativePlacements.Desktop && gameStateStore.talkingHeadQueues[NarrativePlacements.Desktop].length > 0) {
    return gameStateStore.talkingHeadQueues[NarrativePlacements.Desktop][0]
  }
  else return null
})

const dialogueIndex = ref(0)
watchEffect(() => {
  if (currentNarrativeScene.value) {
    dialogueIndex.value = 0
    showOverlay()
  }
  else {
    hideOverlay()
  }
})

const currentDialogue = computed(() => {
  if (currentNarrativeScene.value) {
    return currentNarrativeScene.value.dialogue[dialogueIndex.value]
  }
  else return null
})

// INPUT HANDLING

const windowIsInfocus = useWindowFocus()

// Keyboard input
onKeyStroke((e) => {
  if (windowIsInfocus.value && e.key.length === 1) {
    nextDialogue()
  }
})

// Show the next dialogue in the current scene or remove the scene from the queue.
function nextDialogue() {
  if (currentNarrativeScene.value && dialogueIndex.value < currentNarrativeScene.value.dialogue.length - 1) {
    dialogueIndex.value++
  }
  else {
    gameStateStore.talkingHeadQueues[NarrativePlacements.Desktop].shift()
  }
}
</script>
