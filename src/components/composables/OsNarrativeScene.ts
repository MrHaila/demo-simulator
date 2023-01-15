import { onUnmounted, ref } from "vue"
import type { NarrativeScene } from "@/content/narrative"
import { useGameStateStore } from "@/stores/gameStateStore"

const currentNarrativeScene = ref<NarrativeScene>()
const currentNarrativeSceneCallback = ref<() => void>()

export function useNarrativeScene() {
  const gameStateStore = useGameStateStore()

  function showNarrativeScene(narrativeScene: NarrativeScene, callback?: () => void) {
    currentNarrativeScene.value = narrativeScene
    currentNarrativeSceneCallback.value = callback
  }
  
  function clearCurrentNarrativeScene() {
    // If the current scene has not already been listed in completed scenes, add it.
    const id = currentNarrativeScene.value?.id
    if (id && !gameStateStore.progression.completedNarrativeScenes.includes(id)) {
      gameStateStore.progression.completedNarrativeScenes.push(id)
    }
  
    currentNarrativeScene.value = undefined
    currentNarrativeSceneCallback.value = undefined
  }

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