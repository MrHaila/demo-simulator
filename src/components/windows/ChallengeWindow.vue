<template lang="pug">
OsWindow(
  title="NEO_H4X_EDIT"
  no-padding
  ref="h4xWindow"
)
  template(#title-right)
    span(v-if="challenge?.challengeType === 'scoreAttack'") {{ codePoints }} points
    //span(v-else-if="challenge?.challengeType === 'timeAttack'") {{ timeLeft }} seconds left
    span(v-else-if="challenge?.challengeType === 'tutorial'") {{ sourceCode.length - amountCoded }} characters left

  div(
    ref="tableContainer"
    class="scrollbar-hide h-full overflow-y-auto"
    @wheel.prevent
    @touchmove.prevent
  )
    table(class="table-fixed font-mono")
      tbody
        tr
          td(
            style="min-width: 3rem; padding-top: 0.32rem"
            class="border-r-2 border-r-gray-700 bg-gray-800 px-2 text-right align-top text-xs text-gray-400"
          )
          td(class="p-2 whitespace-pre-wrap text-xs text-gray-400")
            div File: {{ toSnakeCase(challenge?.name || '') }}.h4x
            div Date: {{ currentDate }}
            div Author: {{ gameStateStore.profile.name }}
        tr(
          v-for="(line, index) in displayedCodeRows"
          :key="index"
        )
          td(
            style="min-width: 3rem; padding-top: 0.32rem"
            class="border-r-2 border-r-gray-700 bg-gray-800 px-2 text-right align-top text-xs text-gray-400"
          ) {{ line.lineNumber }}
          td(class="h-6 px-2 whitespace-pre-wrap")
            template(v-if="shouldRenderAsCharacterComponents(index)")
              CodeCharacter(
                v-for="(char, charIndex) in line.characters"
                :key="`${index}-${charIndex}`"
                :char="char.char"
                :is-new="char.isNew"
                :quality="char.quality"
                :floating-point="char.floatingPoint"
              )
              span(
                v-show="index === displayedCodeRows.length - 1 && windowIsInfocus"
                class="blink"
              ) █
            template(v-else)
              span {{ lineToPlainText(line) }}

  ChallengeResultsDialog(
    v-model="showResultsDialog"
    :current-state="currentState"
    :analyzing-progress="analyzingProgress"
    :compiling-progress="compilingProgress"
    :displayed-code-rows="displayedCodeRows"
    :amount-coded="amountCoded"
    :humanized-programming-time="humanizedProgrammingTime"
    @start-compiling="startCompiling"
    @show-success="showSuccess"
    @run="showOutro"
  )

  template(#footer-right)
    os-button(
      @click="exitChallenge"
      hotkey="Escape"
    ) Abort Challenge
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, type Ref } from 'vue'
import { useWindowFocus } from '@vueuse/core'
import { DateTime, Duration } from 'luxon'
import CodeCharacter from '@/components/CodeCharacter.vue'
import OsButton from '@/components/OsButton.vue'
import ChallengeResultsDialog from '@/components/windows/ChallengeResultsDialog.vue'
import OsWindow from '@/components/windows/OsWindow.vue'
import { useCodeInput } from '@/composables/useCodeInput'
import SourceCode from '@/source_code/code'
import SourceCodeHelloWorld from '@/source_code/helloWorld'
import { EliteOsApps, useGameStateStore } from '@/stores/gameStateStore'
import { humanizeDuration } from '@/utils/time'
import { toSnakeCase } from '@/utils/string'
import { useNarrativeScene } from '../composables/OsNarrativeScene'

onMounted(() => {
  currentDate.value = DateTime.now().toFormat('yyyy-MM-dd')
})

/*
  TODO:
  - Current challenge has a memory limit (number of characters).
  - Add lifecycle: limit reached? Code analysis animation scene after that?
  - After a code section(?) completes, it may randomly become more powerful.
*/

const gameStateStore = useGameStateStore()
const windowIsInfocus = useWindowFocus()
const currentDate = ref('')

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

const h4xWindow = ref<InstanceType<typeof OsWindow> | null>(null)
const tableContainer = ref<HTMLDivElement | null>(null)

function onChallengeComplete(): void {
  codingEnded.value = DateTime.now()
  if (!challenge) return
  gameStateStore.progression.completedChallenges[challenge.id] = {
    score: codePoints.value,
    durationISO: getChallengeDuration().toISO() ?? 'should never happen',
  }
  startAnalyzing()
  showResultsDialog.value = true
}

const { codePoints, amountCoded, displayedCodeRows, setupKeyboardHandling } = useCodeInput({
  sourceCode,
  initialCursorPosition: sourceCodeCursorPosition,
  challenge,
  onChallengeComplete,
  currentState,
  codingStateValue: ChallengeStates.Coding,
})

setupKeyboardHandling(tableContainer as Ref<{ scrollTop: number; scrollHeight: number } | null>)

const RENDER_AS_COMPONENTS_LINE_COUNT = 50

function shouldRenderAsCharacterComponents(lineIndex: number): boolean {
  return lineIndex >= displayedCodeRows.value.length - RENDER_AS_COMPONENTS_LINE_COUNT
}

function lineToPlainText(line: { characters: Array<{ char: string }> }): string {
  return line.characters.map((c) => c.char).join('')
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
