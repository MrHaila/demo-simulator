<template lang="pug">
os-window(
  :title="`H4X_EDIT - ${gameStateStore.currentChallenge?.name}`"
  no-padding
  ref="h4xWindow"
)
  table(class="table-fixed font-mono")
    tbody
      tr(v-for="(line, index) in displayedCodeRows" :key="index")
        td(class="text-right px-2 bg-gray-800 text-gray-400 border-r-gray-700 border-r-2 text-xs align-top" style="min-width: 3rem; padding-top: 0.32rem;") {{ line.lineNumber }}
        td(class="whitespace-pre-wrap h-6 px-2") {{ line.text }}#[span(v-show="index === displayedCodeRows.length - 1 && windowIsInfocus" class="blink") █]

  template(#footer-right)
    os-button(@click="exitChallenge") Abort Challenge
</template>

<script lang="ts" setup>
import { EliteOsApps, Scenes, useGameStateStore } from '@/stores/gameStateStore'
import { onKeyStroke, useWindowFocus } from '@vueuse/core'
import { nextTick, ref } from 'vue'
import OsWindow from '@/components/windows/OsWindow.vue'
import OsButton from '@/components/OsButton.vue'
import SourceCode from '@/source_code/code'
import SourceCodeHelloWorld from '@/source_code/helloWorld'

/*
  TODO:
  - Current challenge has a memory limit (number of characters).
  - Add lifecycle: limit reached? Code analysis animation scene after that?
  - After a code section(?) completes, it may randomly become more powerful.
*/

const gameStateStore = useGameStateStore()

const challenge = gameStateStore.currentChallenge

const characterLimit = ref(challenge?.characterLimit)
const codePoints = ref(0)
let amountCoded = 0

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
    lineNumber: 0,
    text: ''
  }
])

const h4xWindow = ref<InstanceType<typeof OsWindow> | null>(null)

async function input () {
  // Game logic
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

  // Keep new code visible.
  await nextTick() // Wait for a DOM update.
  h4xWindow.value?.scrollToBottom()
}

const windowIsInfocus = useWindowFocus()
onKeyStroke((e) => {
  if (e.key === "Escape") {
    exitChallenge()
  } else if (windowIsInfocus.value && e.key.length === 1) {
    // e.preventDefault()
    input()
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