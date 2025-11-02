import { ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import type { UnknownChallenge } from '@/content/challenges'
import { NarrativePlacements, testScene, type NarrativePlacement, type NarrativeScene } from '@/content/narrative'

export const Scenes = {
  Boot: 'Boot',
  Home: 'Home',
} as const

export const EliteOsApps = {
  EnterName: 'EnterName',
  Desktop: 'Desktop',
  ChallengesList: 'ChallengesList',
  Challenge: 'Challenge',
  Work: 'Work',
  PowerShop: 'PowerShop',
  AchievementShop: 'AchievementShop',
  Settings: 'Settings',
} as const

export const Titles = {
  Chimp: 'Script Chimp',
  Smart: 'Wrinkle Brained Monkey',
  Hero: 'Hero Programmer',
  God: 'The One True God of Code',
} as const

export type Scene = (typeof Scenes)[keyof typeof Scenes]
export type EliteOsApp = (typeof EliteOsApps)[keyof typeof EliteOsApps]
export type Title = (typeof Titles)[keyof typeof Titles]

export const currentSaveVersion = 6

const defaultProfile: {
  saveVersion: number
  name: string
  codingSpeed: number
  codingSkill: number
  backScratches: number
  juiceBoxes: number
  latestWorkId: number
  title: Title
} = {
  saveVersion: currentSaveVersion,
  name: '',
  codingSpeed: 1,
  codingSkill: 1,
  backScratches: 0,
  juiceBoxes: 0,
  latestWorkId: 0,
  title: Titles.Chimp as Title,
}

const defaultProgression: {
  completedChallenges: Record<
    number,
    {
      score: number
      durationISO: string
    }
  >
  completedNarrativeScenes: string[]
} = {
  completedChallenges: {},
  completedNarrativeScenes: [] as string[],
}

const defaultNarrativeSceneQueues: Record<NarrativePlacement, NarrativeScene[]> = {
  [NarrativePlacements.Desktop]: [testScene] as NarrativeScene[],
  [NarrativePlacements.ChallengesList]: [] as NarrativeScene[],
  [NarrativePlacements.Challenge]: [] as NarrativeScene[],
  [NarrativePlacements.Work]: [] as NarrativeScene[],
  [NarrativePlacements.PowerShop]: [] as NarrativeScene[],
  [NarrativePlacements.AchievementShop]: [] as NarrativeScene[],
}

export const useGameStateStore = defineStore('game state', {
  state: () => ({
    currentScene: ref<Scene>(Scenes.Boot),
    currentEliteOsApp: ref<EliteOsApp>(EliteOsApps.Desktop),
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
      this.currentChallenge = null
    },
  },
})
