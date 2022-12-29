import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export enum Scenes {
  Boot = 1,
  Home,
  Work,
  Challenge,
  ChallengesList,
}

export const currentSaveVersion = 3

const defaultProfile = {
  saveVersion: currentSaveVersion,
  name: '',
  codingSpeed: 1,
  codingSkill: 1,
  backScratches: 0,
  juiceBoxes: 0,
  latestWorkId: 0,
}

const defaultProgression = {
  completedChallenges: {} as { [key: number]: { score: number } },
}

export const useGameStateStore = defineStore({
  id: 'game state',
  state: () => ({
    currentScene: Scenes.Boot,
    profile: useStorage('profile', defaultProfile),
    progression: useStorage('progression', defaultProgression),
  }),
  actions: {
    resetGame() {
      this.profile = defaultProfile
    }
  }
})
