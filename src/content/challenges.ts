/*
  SPEC:
  - A few different types of base challenges.
  - A compo challenge where you compete against NPC scores on the base challenges.
  - MAYBE: idle vs manual challenges?
  - MAYBE: challenge genres to have a prestige mechanic or parallel progression?
*/

import { PlotCharacters, type NarrativeDialogue, type NarrativeScene } from "./narrative"

export interface ChallengeBase {
  id: number
  name: string
  description: string
  descriptionAuthor?: PlotCharacters
  characterLimit?: number
  dependsOn: number | number[] | false
  sourceCode?: 'helloWorld' | 'quaternion'
  narrativeScenes: {
    introFirstTime: NarrativeScene
    introRetry?: NarrativeScene
    win: NarrativeScene
    lose?: NarrativeScene
  }
  // TODO: reward?
}

export interface ChallengeTutorial extends ChallengeBase {
  challengeType: 'tutorial'
}

export interface ChallengeTimeAttack extends ChallengeBase {
  challengeType: 'timeAttack'
  maximumMilliseconds: number
}

export interface ChallengeScoreAttack extends ChallengeBase {
  challengeType: 'scoreAttack'
  minimumScore: number
  characterLimit: number
}

export interface ChallengeCompo extends ChallengeBase {
  challengeType: 'compo'
  compoType: 'timeAttack' | 'scoreAttack' // TODO: figure this out later.
  challengers: Array<{
    name: string,
    score: number
  }>
}

export type UnknownChallenge = ChallengeCompo | ChallengeScoreAttack | ChallengeTimeAttack | ChallengeTutorial

export const allChallenges: UnknownChallenge[] = [
  {
    id: 0,
    challengeType: 'tutorial',
    name: 'Hello World',
    description: 'Buttons make clicky noises. Press buttons. Make clicky noises.',
    dependsOn: false,
    sourceCode: 'helloWorld',
    narrativeScenes: {
      introFirstTime: {
        id: 'hello world first time intro',
        dialogue: [
          { text: 'The empty text editor is strangely inviting.' },
          { text: 'You feel compelled to type something.' },
          { text: 'With a trembling hand, you reach out to...' },
        ]
      },
      win: {
        id: 'hello world win',
        dialogue: [
          {
            text: 'Hello, world!',
            author: PlotCharacters.Computer,
          }
        ],
      }
    },
  },
  {
    id: 1,
    challengeType: 'scoreAttack',
    name: 'Score Attack Test',
    description: 'This is a test of the score attack challenge type.',
    descriptionAuthor: PlotCharacters.Universe,
    minimumScore: 100,
    characterLimit: 100,
    dependsOn: 0,
    narrativeScenes: {
      introFirstTime: {
        id: 'score attack first time intro',
        dialogue: [
          { text: 'TBD' },
        ]
      },
      win: {
        id: 'score attack win',
        dialogue: [
          { text: 'TBD' },
        ]
      },
    }
  },
  {
    id: 2,
    challengeType: 'compo',
    name: 'Score Attack Compo Test',
    description: 'This is a test of the score attack compo challenge type.',
    descriptionAuthor: PlotCharacters.Universe,
    compoType: 'scoreAttack',
    challengers: [
      {
        name: 'Koko the Sage',
        score: 100,
      },
      {
        name: 'The Mother',
        score: 200,
      },
    ],
    dependsOn: 1,
    narrativeScenes: {
      introFirstTime: {
        id: 'score attack compo first time intro',
        dialogue: [
          { text: 'TBD' },
        ]
      },
      win: {
        id: 'score attack compo win',
        dialogue: [
          { text: 'TBD' },
        ]
      },
    }
  },
  {
    id: 3,
    challengeType: 'compo',
    name: 'Time Attack Compo Test',
    description: 'This is a test of the time attack compo challenge type.',
    descriptionAuthor: PlotCharacters.Universe,
    compoType: 'timeAttack',
    challengers: [
      {
        name: 'Koko the Sage',
        score: 100,
      },
      {
        name: 'The Mother',
        score: 200,
      },
    ],
    dependsOn: 1,
    narrativeScenes: {
      introFirstTime: {
        id: 'time attack compo first time intro',
        dialogue: [
          { text: 'TBD' },
        ]
      },
      win: {
        id: 'time attack compo win',
        dialogue: [
          { text: 'TBD' },
        ]
      },
    }
  }
]

// Throw and error if there are multiple challenges with the same id.
const challengeIds = allChallenges.map(challenge => challenge.id)
const uniqueChallengeIds = new Set(challengeIds)
if (challengeIds.length !== uniqueChallengeIds.size) {
  throw new Error('There are multiple challenges with the same id.')
}

export const challengesAsRows = [[allChallenges[0]]]

// For each challenge in the selected row, find all challenges that depend on it and add them to the next row.
function processChallengeRow(): void {
  if (!challengesAsRows[0]) throw new Error('No challenges in the first row.')

  for (const challengeToProcess of challengesAsRows[0]) {
    if (!challengeToProcess) throw new Error('Challenge to process is undefined.')
      
    const nextChallenges = allChallenges.filter(challenge => {
      if (Array.isArray(challenge.dependsOn)) {
        return challenge.dependsOn.includes(challengeToProcess.id)
      } else {
        return challenge.dependsOn === challengeToProcess.id
      }
    })
    if (nextChallenges.length > 0) {
      challengesAsRows.unshift(nextChallenges)
      processChallengeRow()
    }
  }
}
processChallengeRow()
