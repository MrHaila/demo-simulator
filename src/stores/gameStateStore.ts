import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import type { ChallengeBase } from '@/content/challenges'

export enum Scenes {
  Boot = 'Boot',
  Home = 'Home',
}

export enum EliteOsApps {
  Desktop = 'Desktop',
  ChallengesList = 'ChallengesList',
  Challenge = 'Challenge',
  Work = 'Work',
  PowerShop = 'PowerShop',
  AchievementShop = 'AchievementShop',
  Settings = 'Settings',
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
    currentEliteOsApp: EliteOsApps.Desktop,
    currentChallenge: null as ChallengeBase | null,
    profile: useStorage('profile', defaultProfile),
    progression: useStorage('progression', defaultProgression),
  }),
  actions: {
    resetGame() {
      this.profile = defaultProfile
    }
  }
})
