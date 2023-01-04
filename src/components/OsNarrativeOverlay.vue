<template lang="pug">
//- TODO:
  - Get text from the current scene.
  - Layout with a talking head image.
  - Layout should alternate between left and right.
  - Layout should be responsive.
  - Clicking should get the next text from the scene.
  - Clicking should close the overlay if there is no more text in the scene.

div(
  v-if="!!currentNarrativeScene"
  class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 min-h-96 z-20"
  )
  div(
    v-if="currentDialogue?.author"
    :class="{ 'text-right': alignedRight }"
    )
    h1(class="text-xl") "{{ currentDialogue.text }}"
    aside(class="italic") - {{ currentDialogue.author }}
  div(v-else)
    h1 {{ currentDialogue?.text }}

  p(class="text-xs mt-3 text-center animate-pulse") Press any key to continue.

  div(class="text-xs p-2 text-gray-400")
    p Current scene: {{ currentNarrativeScene?.id }}
</template>

<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue'
import { useOverlay } from '@/components/composables/OsOverlay'
import { NarrativePlacements } from '@/content/narrative'
import { useGameStateStore } from '@/stores/gameStateStore'
import { onKeyStroke, useWindowFocus } from '@vueuse/core';

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

const windowIsInfocus = useWindowFocus()
onKeyStroke((e) => {
  if (windowIsInfocus.value && e.key.length === 1) {
    nextDialogue()
  }
})

function nextDialogue() {
  if (currentNarrativeScene.value && dialogueIndex.value < currentNarrativeScene.value.dialogue.length - 1) {
    dialogueIndex.value++
  }
  else {
    gameStateStore.talkingHeadQueues[NarrativePlacements.Desktop].shift()
  }
}

const alignedRight = computed(() => {
  return dialogueIndex.value % 2 === 1
})
</script>
