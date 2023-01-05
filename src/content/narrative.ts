import { EliteOsApps } from "@/stores/gameStateStore";

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
}

export interface NarrativeScene {
  id: string
  dialogue: NarrativeDialogue[]
}

export const testScene = {
  id: 'test scene',
  dialogue: [
    {
      text: 'Hello, world!',
      author: PlotCharacters.Computer,
    },
    {
      text: 'You come away impressed.',
    }
  ],
} satisfies NarrativeScene