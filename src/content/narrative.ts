import AvatarUrlComputer from '@/assets/avatars/computer@1x.jpg'
import { EliteOsApps } from '@/stores/gameStateStore'

/**
 * Narrative placement types
 */
export const NarrativePlacements = {
  Desktop: 'desktop',
  ChallengesList: 'challengesList',
  Challenge: 'challenge',
  Work: 'work',
  PowerShop: 'powerShop',
  AchievementShop: 'achievementShop',
} as const

export const PlotCharacters = {
  Koko: 'Don Koko',
  Bear: 'Russian Bear',
  Cod: 'English Cod',
  Universe: 'The Universe',
  OpenMonkey: 'OpenMonkey',
  Computer: 'Computer',
} as const

export type PlotCharacter = (typeof PlotCharacters)[keyof typeof PlotCharacters]
export type NarrativePlacement = (typeof NarrativePlacements)[keyof typeof NarrativePlacements]

export interface NarrativeDialogue {
  text: string
  author?: PlotCharacter
  alignment?: 'left' | 'right'
}

/**
 * A scene is a sequence of dialogues with a unique ID.
 */
export interface NarrativeScene {
  id: string
  dialogue: NarrativeDialogue[]
}

/**
 * Returns the avatar image URL for a given plot character.
 */
export function getCharacterAvatarImageUrl(character: PlotCharacter): string {
  switch (character) {
    case PlotCharacters.Koko:
      return AvatarUrlComputer
    case PlotCharacters.Bear:
      return AvatarUrlComputer
    case PlotCharacters.Cod:
      return AvatarUrlComputer
    case PlotCharacters.Universe:
      return AvatarUrlComputer
    case PlotCharacters.OpenMonkey:
      return AvatarUrlComputer
    case PlotCharacters.Computer:
      return AvatarUrlComputer
  }
}

/**
 * An example scene.
 */
export const testScene = {
  id: 'test scene',
  dialogue: [
    {
      text: 'Hello, world!',
      author: PlotCharacters.Computer,
    },
    {
      text: 'Whoa, this is cool!',
      author: PlotCharacters.Cod,
      alignment: 'right',
    },
    {
      text: 'You come away impressed.',
    },
  ],
} satisfies NarrativeScene
