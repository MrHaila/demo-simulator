<template lang="pug">
OsWindow(
  :title="`H4X_EDIT - ${challenge?.name}`"
  no-padding
  ref="h4xWindow"
)
  template(#title-right)
    span(v-if="challenge?.challengeType === 'scoreAttack'") {{ codePoints }} points
    //span(v-else-if="challenge?.challengeType === 'timeAttack'") {{ timeLeft }} seconds left
    span(v-else-if="challenge?.challengeType === 'tutorial'") {{ sourceCode.length - amountCoded }} characters left

  table(class="table-fixed font-mono")
    tbody
      tr(v-for="(line, index) in displayedCodeRows" :key="index")
        td(class="text-right px-2 bg-gray-800 text-gray-400 border-r-gray-700 border-r-2 text-xs align-top" style="min-width: 3rem; padding-top: 0.32rem;") {{ line.lineNumber }}
        td(class="whitespace-pre-wrap h-6 px-2") {{ line.text }}#[span(v-show="index === displayedCodeRows.length - 1 && windowIsInfocus" class="blink") █]

  OsWindow(
    v-if="currentState === ChallengeStates.Results"
    title="Compiler Results"
    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
    style="width: 30rem;"
  )
    h1(class="text-lg") Input
    ul
      li {{ displayedCodeRows.length }} lines of code.
      li {{ amountCoded }} characters.
      li TBD seconds of programming time.

    h2(class="text-lg mt-4") Compilation status: #[span(class="text-olive") SUCCESS!]

    template(#footer-right)
      os-button(
        @click="showOutro"
        hotkey="Enter"
        ) Run

  template(#footer-right)
    os-button(
      @click="exitChallenge"
      hotkey="Esc"
      ) Abort Challenge
</template>

<script lang="ts" setup>
import { EliteOsApps, useGameStateStore } from '@/stores/gameStateStore'
import { onKeyStroke, useWindowFocus } from '@vueuse/core'
import { nextTick, ref } from 'vue'
import OsWindow from '@/components/windows/OsWindow.vue'
import OsButton from '@/components/OsButton.vue'
import SourceCode from '@/source_code/code'
import SourceCodeHelloWorld from '@/source_code/helloWorld'
import { useNarrativeScene } from '../composables/OsNarrativeScene'

/*
  TODO:
  - Current challenge has a memory limit (number of characters).
  - Add lifecycle: limit reached? Code analysis animation scene after that?
  - After a code section(?) completes, it may randomly become more powerful.
*/

const gameStateStore = useGameStateStore()

const challenge = gameStateStore.currentChallenge

enum ChallengeStates {
  Intro = 'intro',
  Coding = 'coding',
  Results = 'results',
  Outro = 'outro',
}
const currentState = ref(ChallengeStates.Intro)

// NARRATIVE ----------------------------

const { showNarrativeScene } = useNarrativeScene()
if (challenge?.narrativeScenes.introFirstTime) showNarrativeScene(challenge.narrativeScenes.introFirstTime, () => currentState.value = ChallengeStates.Coding)
else if (challenge?.narrativeScenes.introRetry) showNarrativeScene(challenge.narrativeScenes.introRetry, () => currentState.value = ChallengeStates.Coding)

// CODE ----------------------------

const codePoints = ref(0)
let amountCoded = 0

// Load some code.
let sourceCode: string
if (challenge?.sourceCode === 'helloWorld') sourceCode = SourceCodeHelloWorld
else sourceCode = SourceCode

// Pick a random start position for non-tutorial challenges.
let sourceCodeCursorPosition = 0
let lines: string[]
if (challenge?.challengeType !== 'tutorial') {
  lines = sourceCode.split('\n')
  while (!sourceCodeCursorPosition) {
    const line = Math.floor(Math.random() * (lines.length - 1))
    if (lines[line].length !== 0 && !lines[line].match(/^\s+|}/)) sourceCodeCursorPosition = SourceCode.indexOf(lines[line])
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
    text: ''
  }
])

const h4xWindow = ref<InstanceType<typeof OsWindow> | null>(null)

async function input () {
  amountCoded += gameStateStore.profile.codingSpeed

  // Grab new characters from the source file and split by line breaks.
  let newCode = sourceCode.substring(sourceCodeCursorPosition, sourceCodeCursorPosition + gameStateStore.profile.codingSpeed)

  // If the source file ran out in a non-tutorial challenge...
  if (newCode.length !== gameStateStore.profile.codingSpeed && challenge?.challengeType !== 'tutorial') {
    // Loop back and add the rest.
    sourceCodeCursorPosition = 0
    newCode += `\n${sourceCode.substring(sourceCodeCursorPosition, gameStateStore.profile.codingSpeed - newCode.length)}`
  }

  const newCodeRows = newCode.split('\n')
  sourceCodeCursorPosition += gameStateStore.profile.codingSpeed

  // Append first new row to the latest displayed row.
  displayedCodeRows.value[displayedCodeRows.value.length - 1].text += newCodeRows[0]

  // For each subsequent row...
  for (let i = 1; i < newCodeRows.length; i++) {
    // Directly add new rows to the display buffer.
    displayedCodeRows.value.push({
      lineNumber: displayedCodeRows.value[displayedCodeRows.value.length - 1].lineNumber + 1,
      text: newCodeRows[i]
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
  }
}

function codeToPoints (code: string) {
  let points = 0

  // Add points for each non-whitespace, non-line-break character.
  for (let i = 0; i < code.length; i++) {
    if (code[i] !== ' ' && code[i] !== '\n') points++
  }

  return points
}

function showOutro() {
  if (challenge) {
    currentState.value = ChallengeStates.Outro
    const sceneToShow = challenge.narrativeScenes.win
    showNarrativeScene(sceneToShow, () => exitChallenge())
  }
}

const windowIsInfocus = useWindowFocus()
onKeyStroke((e) => {
  if (currentState.value === ChallengeStates.Coding) {
    if (e.key === "Escape") {
      exitChallenge()
    } else if (windowIsInfocus.value && e.key.length === 1) {
      // e.preventDefault()
      input()
    }
  }
  else if (currentState.value === ChallengeStates.Results) {
    if (e.key === "Enter") {
      showOutro()
    }
  }
})

function exitChallenge () {
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