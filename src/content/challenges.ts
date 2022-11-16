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
  TBD = 'Ukranian TBD',
  Universe = 'The Universe',
  AutoMonkey = 'AutoMonkey'
}

interface ChallengeBase {
  name: string
  description: string
  descriptionAuthor: PlotCharacter
  characterLimit?: number
  // TODO: reward?
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

const allChallenges: (ChallengeTimeAttack | ChallengeScoreAttack | ChallengeCompo)[] = [
  {
    challengeType: 'timeAttack',
    name: '371t3 R04d - Tier I',
    description: 'To progress in True Skill™, all must ascent the road. Yes. This is the way.',
    descriptionAuthor: PlotCharacter.Koko,
    maximumMilliseconds: 1337
  }
]