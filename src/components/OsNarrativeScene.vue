<template lang="pug">
//- Centered container
div(
  class="absolute top-0 bottom-0 left-1/4 right-1/4 z-20 space-y-6 flex flex-col justify-end pb-20"
  )

  //- Dialogue rows
  div(
    v-for="(dialogue, index) in visibleDialogues"
    :key="index"
    :class="['flex', { 'justify-end': dialogue?.alignment === 'right', 'justify-center': !dialogue?.author }]"
  )
    //- Speech bubbles for text with an author
    div(
      v-if="dialogue?.author"
      :class="['bg-gray-900 backdrop-blur-sm bg-opacity-70 border-liver border-4 rounded-xl flex', { 'flex-row-reverse': dialogue?.alignment === 'right' }]"
      style="width: 35rem;"
      )
      img(
        :src="getCharacterAvatarImageUrl(dialogue?.author)"
        :class="['h-32 rounded-l-lg', { 'rounded-l-none rounded-r-lg': dialogue?.alignment === 'right' }]"
        )
      div(:class="['grow flex flex-col rounded-r-lg border-liver', { 'border-l-4': dialogue?.alignment !== 'right' && dialogue?.author, 'rounded-r-none rounded-l-lg border-r-4': dialogue?.alignment === 'right' }]")
        div(
          :class="['bg-liver px-3 py-1 relative -top-1 rounded-tr-lg', { 'rounded-tl-lg rounded-tr-none': dialogue?.alignment === 'right' }]"
          )
          aside(class="italic") {{ dialogue?.author }}
        div(class="px-3 grow py-2")
          h1(class="text-xl") "{{ dialogue.text }}"

    //- Text without an author
    div(
      v-else
      class="bg-gray-900 backdrop-blur-sm bg-opacity-70 border-neutral-500 border-4 rounded-xl text-center px-5 py-2 italic"
      ) {{ dialogue?.text }}

  //- Input hint
  p(class="text-xs my-3 text-center animate-pulse text-gray-400") Press any key to continue.
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useOverlay } from '@/components/composables/OsOverlay'
import { getCharacterAvatarImageUrl, type NarrativeScene } from '@/content/narrative'
import { onKeyStroke, useWindowFocus } from '@vueuse/core'
import { useNarrativeScene } from './composables/OsNarrativeScene';

const { showOverlay } = useOverlay()
showOverlay()

const { clearCurrentNarrativeScene, currentNarrativeSceneCallback } = useNarrativeScene()

const props = defineProps<{
  narrativeScene: NarrativeScene
}>()

const dialogueIndex = ref(0)
const visibleDialogues = computed(() => props.narrativeScene.dialogue.slice(0, dialogueIndex.value + 1))

// INPUT HANDLING

// Keyboard input
const windowIsInfocus = useWindowFocus()
onKeyStroke((e) => {
  if (windowIsInfocus.value && (e.key.length === 1 || e.key === 'Enter')) {
    nextDialogue()
  }
})

// Show the next dialogue in the current scene or remove the scene from the queue.
function nextDialogue() {
  if (dialogueIndex.value < props.narrativeScene.dialogue.length - 1) {
    dialogueIndex.value++
  }
  else {
    if (currentNarrativeSceneCallback.value) {
      currentNarrativeSceneCallback.value()
    }
    clearCurrentNarrativeScene()
  }
}
</script>
