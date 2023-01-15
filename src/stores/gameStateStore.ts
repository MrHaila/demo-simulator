import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import type { UnknownChallenge } from '@/content/challenges'
import { NarrativePlacements, testScene, type NarrativeScene } from '@/content/narrative'

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

export const currentSaveVersion = 6

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
  completedChallenges: {} as { [key: number]: { 
    score: number
    durationISO: string
  } },
  completedNarrativeScenes: [] as string[],
}

const defaultNarrativeSceneQueues = {
  [NarrativePlacements.Desktop]: [testScene] as NarrativeScene[],
  [NarrativePlacements.ChallengesList]: [] as NarrativeScene[],
  [NarrativePlacements.Work]: [] as NarrativeScene[],
  [NarrativePlacements.PowerShop]: [] as NarrativeScene[],
  [NarrativePlacements.AchievementShop]: [] as NarrativeScene[],
}

export const useGameStateStore = defineStore({
  id: 'game state',
  state: () => ({
    currentScene: Scenes.Boot,
    currentEliteOsApp: EliteOsApps.Desktop,
    currentChallenge: null as UnknownChallenge | null,
    profile: useStorage('profile', defaultProfile),
    progression: useStorage('progression', defaultProgression),
    narrativeSceneQueues: useStorage('narrativeSceneQueues', defaultNarrativeSceneQueues),
  }),
  actions: {
    resetGame() {
      this.profile = defaultProfile
      this.progression = defaultProgression
      this.narrativeSceneQueues = defaultNarrativeSceneQueues
    }
  }
})
