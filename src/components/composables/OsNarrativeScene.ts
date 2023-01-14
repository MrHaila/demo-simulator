import { onUnmounted, ref } from "vue"
import type { NarrativeScene } from "@/content/narrative"

const currentNarrativeScene = ref<NarrativeScene>()
const currentNarrativeSceneCallback = ref<() => void>()

function showNarrativeScene(narrativeScene: NarrativeScene, callback?: () => void) {
  currentNarrativeScene.value = narrativeScene
  currentNarrativeSceneCallback.value = callback
}

function clearCurrentNarrativeScene() {
  currentNarrativeScene.value = undefined
  currentNarrativeSceneCallback.value = undefined
}

export function useNarrativeScene() {
  onUnmounted(() => {
    clearCurrentNarrativeScene()
  })

  return {
    showNarrativeScene,
    currentNarrativeScene,
    currentNarrativeSceneCallback,
    clearCurrentNarrativeScene
  }
}