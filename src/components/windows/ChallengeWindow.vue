<template lang="pug">
OsWindow(
  :title="`H4X_EDIT - ${challenge?.name}`",
  no-padding,
  ref="h4xWindow"
)
  template(#title-right)
    span(v-if="challenge?.challengeType === 'scoreAttack'") {{ codePoints }} points
    //span(v-else-if="challenge?.challengeType === 'timeAttack'") {{ timeLeft }} seconds left
    span(v-else-if="challenge?.challengeType === 'tutorial'") {{ sourceCode.length - amountCoded }} characters left

  table(class="table-fixed font-mono")
    tbody
      tr(
        v-for="(line, index) in displayedCodeRows",
        :key="index"
      )
        td(
          style="min-width: 3rem; padding-top: 0.32rem",
          class="border-r-2 border-r-gray-700 bg-gray-800 px-2 text-right align-top text-xs text-gray-400"
        ) {{ line.lineNumber }}
        td(class="h-6 px-2 whitespace-pre-wrap") {{ line.text }}#[span(v-show="index === displayedCodeRows.length - 1 && windowIsInfocus", class="blink") █]

  OsDialog(
    v-if="showResultsDialog",
    :title="getDialogTitle()",
    v-model="showResultsDialog"
  )
    // Analyzing phase
    div(v-if="currentState === ChallengeStates.Analyzing")
      div(class="mb-4")
        AnimatedText(
          :run="true",
          text="Analyzing code structure...",
          :speed="30"
        )
      div(class="my-2")
        AsciiProgressBar(
          :run="analyzingProgress",
          :progress="100",
          :speed="3",
          @done="startCompiling"
        )
    
    // Compilation phase with analysis results and compilation bar below
    div(v-else-if="currentState === ChallengeStates.Compiling")
      // Analysis results table (stays visible)
      div(class="mt-4 mb-6 border border-liver rounded")
        table(class="w-full font-mono text-sm")
          tbody
            tr(class="border-b border-liver")
              td(class="px-3 py-2 bg-gray-800 font-semibold") Code Analysis
              td(class="px-3 py-2 bg-gray-800 font-semibold text-right") Result
            tr
              td(class="px-3 py-2") Lines of code
              td(class="px-3 py-2 text-right")
                AnimatedNumber(
                  :run="true",
                  :number="displayedCodeRows.length",
                  :speed="50"
                )
            tr
              td(class="px-3 py-2") Characters typed
              td(class="px-3 py-2 text-right")
                AnimatedNumber(
                  :run="true",
                  :number="amountCoded",
                  :speed="100"
                )
            tr
              td(class="px-3 py-2") Programming time
              td(class="px-3 py-2 text-right") {{ humanizedProgrammingTime }}
      
      div(class="mt-4")
        AnimatedText(
          :run="true",
          text="Compiling optimized bytecode...",
          :speed="30"
        )

      // Compilation progress bar (below analysis)
      div(class="mb-4")
        div(class="text-sm text-gray-400 mb-2") Compilation Progress
        AsciiProgressBar(
          :run="compilingProgress",
          :progress="100",
          :speed="2",
          @done="showSuccess"
        )
    
    // Success phase with compilation status and analysis results
    div(v-else-if="currentState === ChallengeStates.Success")
      
      // Analysis results remain visible
      div(class="border border-liver rounded")
        table(class="w-full font-mono text-sm")
          tbody
            tr(class="border-b border-liver")
              td(class="px-3 py-2 bg-gray-800 font-semibold") Code Analysis
              td(class="px-3 py-2 bg-gray-800 font-semibold text-right") Result
            tr
              td(class="px-3 py-2") Lines of code
              td(class="px-3 py-2 text-right") {{ displayedCodeRows.length }}
            tr
              td(class="px-3 py-2") Characters typed
              td(class="px-3 py-2 text-right") {{ amountCoded }}
            tr
              td(class="px-3 py-2") Programming time
              td(class="px-3 py-2 text-right") {{ humanizedProgrammingTime }}

      h2(class="text-lg mt-4") Compilation status: #[span(class="text-olive") SUCCESS!]

    template(#footer)
      os-button(
        @click="showOutro",
        hotkey="Enter",
        :disabled="currentState !== ChallengeStates.Success"
      ) Run

  template(#footer-right)
    os-button(
      @click="exitChallenge",
      hotkey="Escape"
    ) Abort Challenge
</template>

<script lang="ts" setup>
import { nextTick, ref, computed } from 'vue'
import { onKeyStroke, useWindowFocus } from '@vueuse/core'
import { DateTime, Duration } from 'luxon'
import OsButton from '@/components/OsButton.vue'
import OsDialog from '@/components/OsDialog.vue'
import AnimatedNumber from '@/components/AnimatedNumber.vue'
import AnimatedText from '@/components/AnimatedText.vue'
import AsciiProgressBar from '@/components/AsciiProgressBar.vue'
import OsWindow from '@/components/windows/OsWindow.vue'
import SourceCode from '@/source_code/code'
import SourceCodeHelloWorld from '@/source_code/helloWorld'
import { EliteOsApps, useGameStateStore } from '@/stores/gameStateStore'
import { useNarrativeScene } from '../composables/OsNarrativeScene'
import { humanizeDuration } from '@/utils/time'

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
  Compiling: 'compiling',
  Analyzing: 'analyzing',
  Success: 'success',
  Outro: 'outro',
} as const
const currentState = ref<(typeof ChallengeStates)[keyof typeof ChallengeStates]>(ChallengeStates.Intro)
const showResultsDialog = ref(false)
const compilationStep = ref(0)
const analyzingProgress = ref(false)
const compilingProgress = ref(false)
const codingStarted = ref<DateTime>(DateTime.now())
const codingEnded = ref<DateTime>(DateTime.now())

// NARRATIVE ----------------------------

const { showNarrativeScene } = useNarrativeScene()
if (
  challenge?.narrativeScenes.introFirstTime &&
  !gameStateStore.progression.completedNarrativeScenes.includes(challenge.narrativeScenes.introFirstTime.id)
) {
  showNarrativeScene(challenge.narrativeScenes.introFirstTime, startCoding)
} else if (challenge?.narrativeScenes.introRetry) {
  showNarrativeScene(challenge.narrativeScenes.introRetry, startCoding)
} else {
  startCoding()
}

function startCoding(): void {
  currentState.value = ChallengeStates.Coding
  codingStarted.value = DateTime.now()
}

function startAnalyzing(): void {
  currentState.value = ChallengeStates.Analyzing
  // Reset and start analyzing progress
  analyzingProgress.value = false
  void nextTick(() => {
    analyzingProgress.value = true
  })
}

function startCompiling(): void {
  currentState.value = ChallengeStates.Compiling
  // Reset and start compiling progress
  compilingProgress.value = false
  void nextTick(() => {
    compilingProgress.value = true
  })
}

function showSuccess(): void {
  currentState.value = ChallengeStates.Success
}

function getDialogTitle(): string {
  switch (currentState.value) {
    case ChallengeStates.Analyzing:
      return 'Analyzing Code...'
    case ChallengeStates.Compiling:
      return 'Compiling...'
    case ChallengeStates.Success:
      return 'Compiler Results'
    default:
      return 'Compiler Results'
  }
}

function showOutro(): void {
  showResultsDialog.value = false
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
    codingEnded.value = DateTime.now()
    gameStateStore.progression.completedChallenges[challenge.id] = {
      score: codePoints.value,
      durationISO: getChallengeDuration().toISO() ?? 'should never happen',
    }
    startAnalyzing()
    showResultsDialog.value = true
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

const humanizedProgrammingTime = computed(() => {
  if (currentState.value === ChallengeStates.Results) {
    return humanizeDuration(getChallengeDuration().toMillis())
  }
  return '0 sec'
})

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
  // Handle generic text input (any single character key) during coding state
  // Note: Escape and Enter keys are now handled by the OsButton components
  if (currentState.value === ChallengeStates.Coding && windowIsInfocus.value && e.key.length === 1) {
    void input()
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
