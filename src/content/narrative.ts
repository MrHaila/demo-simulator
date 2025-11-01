import { EliteOsApps } from "@/stores/gameStateStore"
import AvatarUrlComputer from '@/assets/avatars/computer@1x.jpg'

export enum NarrativePlacements {
  Desktop = "desktop",
  ChallengesList = "challengesList",
  Challenge = "challenge",
  Work = "work",
  PowerShop = "powerShop",
  AchievementShop = "achievementShop",
}

export enum PlotCharacters {
  Koko = 'Don Koko',
  Bear = 'Russian Bear',
  Cod = 'English Cod',
  Universe = 'The Universe',
  AutoMonkey = 'AutoMonkey',
  Computer = 'Computer',
}

export interface NarrativeDialogue {
  text: string
  author?: PlotCharacters
  alignment?: 'left' | 'right'
}

export interface NarrativeScene {
  id: string
  dialogue: NarrativeDialogue[]
}

export function getCharacterAvatarImageUrl(character: PlotCharacters): string {
  switch (character) {
    case PlotCharacters.Koko:
      return AvatarUrlComputer
    case PlotCharacters.Bear:
      return AvatarUrlComputer
    case PlotCharacters.Cod:
      return AvatarUrlComputer
    case PlotCharacters.Universe:
      return AvatarUrlComputer
    case PlotCharacters.AutoMonkey:
      return AvatarUrlComputer
    case PlotCharacters.Computer:
      return AvatarUrlComputer
  }
}

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
    }
  ],
} satisfies NarrativeScene