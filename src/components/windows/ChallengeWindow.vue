<template lang="pug">
OsWindow(
  :title='`H4X_EDIT - ${challenge?.name}`'
  no-padding
  ref='h4xWindow'
)
  template(#title-right)
    span(v-if='challenge?.challengeType === "scoreAttack"') {{ codePoints }} points
    //span(v-else-if="challenge?.challengeType === 'timeAttack'") {{ timeLeft }} seconds left
    span(v-else-if='challenge?.challengeType === "tutorial"') {{ sourceCode.length - amountCoded }} characters left

  table(class='table-fixed font-mono')
    tbody
      tr(
        v-for='(line, index) in displayedCodeRows'
        :key='index'
      )
        td(
          style='min-width: 3rem; padding-top: 0.32rem'
          class='border-r-2 border-r-gray-700 bg-gray-800 px-2 text-right align-top text-xs text-gray-400'
        ) {{ line.lineNumber }}
        td(class='h-6 px-2 whitespace-pre-wrap') {{ line.text }}#[span(v-show='index === displayedCodeRows.length - 1 && windowIsInfocus' class='blink') █]

  OsWindow(
    v-if='currentState === ChallengeStates.Results'
    title='Compiler Results'
    class='absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2'
    style='width: 30rem'
  )
    h1(class='text-lg') Input
    ul
      li {{ displayedCodeRows.length }} lines of code.
      li {{ amountCoded }} characters.
      li TBD seconds of programming time.

    h2(class='mt-4 text-lg') Compilation status: #[span(class='text-olive') SUCCESS!]

    template(#footer-right)
      os-button(
        @click='showOutro'
        hotkey='Enter'
      ) Run

  template(#footer-right)
    os-button(
      @click='exitChallenge'
      hotkey='Esc'
    ) Abort Challenge
</template>

<script lang="ts" setup>
import { nextTick, ref } from 'vue'
import { onKeyStroke, useWindowFocus } from '@vueuse/core'
import { DateTime, Duration } from 'luxon'
import OsButton from '@/components/OsButton.vue'
import OsWindow from '@/components/windows/OsWindow.vue'
import SourceCode from '@/source_code/code'
import SourceCodeHelloWorld from '@/source_code/helloWorld'
import { EliteOsApps, useGameStateStore } from '@/stores/gameStateStore'
import { useNarrativeScene } from '../composables/OsNarrativeScene'

/*
  TODO:
  - Current challenge has a memory limit (number of characters).
  - Add lifecycle: limit reached? Code analysis animation scene after that?
  - After a code section(?) completes, it may randomly become more powerful.
*/

const gameStateStore = useGameStateStore()

const challenge = gameStateStore.currentChallenge

const ChallengeStates = {
  Intro: 'intro',
  Coding: 'coding',
  Results: 'results',
  Outro: 'outro',
} as const
const currentState = ref<(typeof ChallengeStates)[keyof typeof ChallengeStates]>(ChallengeStates.Intro)
const codingStarted = ref<DateTime>(DateTime.now())
const codingEnded = ref<DateTime>(DateTime.now())

// NARRATIVE ----------------------------

const { showNarrativeScene } = useNarrativeScene()
if (
  challenge?.narrativeScenes.introFirstTime &&
  !gameStateStore.progression.completedNarrativeScenes.includes(challenge.narrativeScenes.introFirstTime.id)
)
  showNarrativeScene(challenge.narrativeScenes.introFirstTime, startCoding)
else if (challenge?.narrativeScenes.introRetry) showNarrativeScene(challenge.narrativeScenes.introRetry, startCoding)
else startCoding()

function startCoding(): void {
  currentState.value = ChallengeStates.Coding
  codingStarted.value = DateTime.now()
}

function showOutro(): void {
  if (challenge) {
    currentState.value = ChallengeStates.Outro
    const sceneToShow = challenge.narrativeScenes.win
    showNarrativeScene(sceneToShow, () => {
      exitChallenge()
    })
  }
}

// CODE ----------------------------

const codePoints = ref(0)
let amountCoded = 0

// Load some code.
let sourceCode: string = SourceCode
if (challenge?.sourceCode === 'helloWorld') sourceCode = SourceCodeHelloWorld

// Pick a random start position for non-tutorial challenges.
let sourceCodeCursorPosition = 0
let lines: string[] = []
if (challenge?.challengeType !== 'tutorial') {
  lines = sourceCode.split('\n')
  while (!sourceCodeCursorPosition) {
    const line = Math.floor(Math.random() * (lines.length - 1))
    const selectedLine = lines[line]
    if (selectedLine && selectedLine.length !== 0 && !/^\s+|}/.exec(selectedLine)) {
      sourceCodeCursorPosition = SourceCode.indexOf(selectedLine)
    }
  }
}
lines = []

// INPUT HANDLING ----------------------------

interface CodeLine {
  lineNumber: number
  text: string
}

const displayedCodeRows = ref<CodeLine[]>([
  {
    lineNumber: 1,
    text: '',
  },
])

const h4xWindow = ref<InstanceType<typeof OsWindow> | null>(null)

// eslint-disable-next-line complexity -- I accept
async function input(): Promise<void> {
  amountCoded += gameStateStore.profile.codingSpeed

  // Grab new characters from the source file and split by line breaks.
  let newCode = sourceCode.substring(
    sourceCodeCursorPosition,
    sourceCodeCursorPosition + gameStateStore.profile.codingSpeed,
  )

  // If the source file ran out in a non-tutorial challenge...
  if (newCode.length !== gameStateStore.profile.codingSpeed && challenge?.challengeType !== 'tutorial') {
    // Loop back and add the rest.
    sourceCodeCursorPosition = 0
    newCode += `\n${sourceCode.substring(sourceCodeCursorPosition, gameStateStore.profile.codingSpeed - newCode.length)}`
  }

  const newCodeRows = newCode.split('\n')
  sourceCodeCursorPosition += gameStateStore.profile.codingSpeed

  // Append first new row to the latest displayed row.
  const lastRow = displayedCodeRows.value[displayedCodeRows.value.length - 1]
  if (lastRow) {
    lastRow.text += newCodeRows[0]
  }

  // For each subsequent row...
  for (let i = 1; i < newCodeRows.length; i++) {
    // Directly add new rows to the display buffer.
    const currentLastRow = displayedCodeRows.value[displayedCodeRows.value.length - 1]
    displayedCodeRows.value.push({
      lineNumber: currentLastRow ? currentLastRow.lineNumber + 1 : 1,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- newCodeRows[i] is guaranteed to be a string.
      text: newCodeRows[i]!,
    })

    // Trim excess lines.
    if (displayedCodeRows.value.length > 300) {
      displayedCodeRows.value.shift()
    }
  }

  codePoints.value += codeToPoints(newCode)

  // Keep new code visible.
  await nextTick() // Wait for a DOM update.
  h4xWindow.value?.scrollToBottom()

  // If the challenge is a tutorial, check if the player has coded enough.
  if (challenge?.challengeType === 'tutorial' && amountCoded >= sourceCode.length) {
    currentState.value = ChallengeStates.Results
    codingEnded.value = DateTime.now()
    gameStateStore.progression.completedChallenges[challenge.id] = {
      score: codePoints.value,
      durationISO: getChallengeDuration().toISO() ?? 'should never happen',
    }
    // const previousResult = gameStateStore.progression.completedChallenges[challenge.id]

    // gameStateStore.progression.completedChallenges[challenge.id] = {
    //   score: codePoints.value > previousResult?.score ? codePoints.value : previousResult?.score,
    //   durationISO: getChallengeDuration().milliseconds > Duration.fromISO(previousResult?.durationISO).milliseconds ? getChallengeDuration().toISO() : previousResult?.durationISO,
    // }
  }
}

function getChallengeDuration(): Duration {
  return codingEnded.value.diff(codingStarted.value)
}

function codeToPoints(code: string): number {
  let points = 0

  // Add points for each non-whitespace, non-line-break character.
  // eslint-disable-next-line @typescript-eslint/prefer-for-of -- this is good as-is.
  for (let i = 0; i < code.length; i++) {
    if (code[i] !== ' ' && code[i] !== '\n') points++
  }

  return points
}

const windowIsInfocus = useWindowFocus()
onKeyStroke((e) => {
  if (currentState.value === ChallengeStates.Coding) {
    if (e.key === 'Escape') {
      exitChallenge()
    } else if (windowIsInfocus.value && e.key.length === 1) {
      // e.preventDefault()
      void input()
    }
  } else if (currentState.value === ChallengeStates.Results) {
    if (e.key === 'Enter') {
      showOutro()
    }
  }
})

function exitChallenge(): void {
  gameStateStore.currentEliteOsApp = EliteOsApps.ChallengesList
  gameStateStore.currentChallenge = null
}
</script>

<style>
.blink {
  animation: blink-animation 1s steps(2, start) infinite;
}
@keyframes blink-animation {
  to {
    visibility: hidden;
  }
}
</style>
