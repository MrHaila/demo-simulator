import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export enum Scenes {
  Boot = 1,
  Home,
  Work,
  Challenge,
  ChallengesList,
}

export const currentSaveVersion = 1

const defaultProfile = {
  saveVersion: currentSaveVersion,
  name: '',
  codingSpeed: 1,
  codingSkill: 0,
  backScratches: 0,
  latestWorkId: 0,
}

export const useGameStateStore = defineStore({
  id: 'game state',
  state: () => ({
    currentScene: Scenes.Boot,
    profile: useStorage('profile', defaultProfile),
  }),
  actions: {
    resetGame() {
      this.profile = defaultProfile
    }
  }
})
