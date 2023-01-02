/*
  SPEC:
  - A few different types of base challenges.
  - A compo challenge where you compete against NPC scores on the base challenges.
  - MAYBE: idle vs manual challenges?
  - MAYBE: challenge genres to have a prestige mechanic or parallel progression?
*/

enum PlotCharacter {
  Koko = 'Koko the Sage',
  Mother = 'The Mother',
  Father = 'The Father',
  Bear = 'Russian Bear',
  Cod = 'English Cod',
  Universe = 'The Universe',
  AutoMonkey = 'AutoMonkey'
}

export interface ChallengeBase {
  id: number
  name: string
  description: string
  descriptionAuthor?: PlotCharacter
  characterLimit?: number
  dependsOn: number | number[] | false
  sourceCode?: 'helloWorld' | 'quaternion'
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
  challengers: {
    name: string,
    score: number
  }[]
}

export const allChallenges: (ChallengeTimeAttack | ChallengeScoreAttack | ChallengeCompo | ChallengeTutorial)[] = [
  {
    id: 0,
    challengeType: 'tutorial',
    name: 'Hello World',
    description: 'Buttons make clicky noises. Press buttons. Make clicky noises.',
    dependsOn: false,
    sourceCode: 'helloWorld',
  },
  {
    id: 1,
    challengeType: 'scoreAttack',
    name: 'Score Attack Test',
    description: 'This is a test of the score attack challenge type.',
    descriptionAuthor: PlotCharacter.Universe,
    minimumScore: 100,
    characterLimit: 100,
    dependsOn: 0,
  },
  {
    id: 2,
    challengeType: 'compo',
    name: 'Score Attack Compo Test',
    description: 'This is a test of the score attack compo challenge type.',
    descriptionAuthor: PlotCharacter.Universe,
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
  },
  {
    id: 3,
    challengeType: 'compo',
    name: 'Time Attack Compo Test',
    description: 'This is a test of the time attack compo challenge type.',
    descriptionAuthor: PlotCharacter.Universe,
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
function processChallengeRow() {
  for (const challengeToProcess of challengesAsRows[0]) {
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
