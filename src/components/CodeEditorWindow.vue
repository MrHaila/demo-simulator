<template lang="pug">
os-window(
  title="H4X_EDIT"
  no-padding
  ref="h4xWindow"
)
  table(class="table-fixed font-mono")
    tbody
      tr(v-for="(string, index) in displayedCodeRows" :key="index")
        td(class="text-right px-2 bg-gray-800 text-gray-400 border-r-gray-700 border-r-2 text-xs align-top" style="min-width: 3rem; padding-top: 0.32rem;") {{ index }}
        td(class="whitespace-pre-wrap h-6 px-2") {{ string }}#[span(v-show="index === displayedCodeRows.length - 1" class="blink") █]
</template>

<script lang="ts" setup>
import { computed, nextTick, ref } from 'vue';
import OsWindow from '../components/OsWindow.vue'
import SourceCode from '../source_code/code'

/*
  TODO:
  - Move code skill to pinia player profile.
  - Current challenge has a memory limit (number of characters).
  - Add lifecycle: limit reached? Code analysis animation scene after that?
  - After a code section(?) completes, it may randomly become more powerful.
  - Blinking box cursor when active.
*/

const codePoints = ref(0)
const characterLimit = ref(10)

const displayedCodeRows = ref<string[]>([''])
let sourceCodeCursorPosition = 0
const lines = SourceCode.split('\n')
while (!sourceCodeCursorPosition) {
  const line = Math.floor(Math.random() * (lines.length - 1))
  if (lines[line].length !== 0 && !lines[line].match(/^\s+|}/)) sourceCodeCursorPosition = SourceCode.indexOf(lines[line])
}
let amountCoded = 0

const codingSkill = 30

const h4xWindow = ref<InstanceType<typeof OsWindow> | null>(null)
async function input () {
  // Game logic
  amountCoded += codingSkill

  // Add code to screen
  // TODO: check if file has less code than what we need -> add what we can, move cursor to 0 and add the rest
  const newCodeRows = SourceCode.substring(sourceCodeCursorPosition, sourceCodeCursorPosition + codingSkill).split('\n')
  sourceCodeCursorPosition += codingSkill
  displayedCodeRows.value[displayedCodeRows.value.length - 1] += newCodeRows[0]
  for (let i = 1; i < newCodeRows.length; i++) {
    displayedCodeRows.value.push(newCodeRows[i])
  }

  // Keep new code visible
  await nextTick()
  h4xWindow.value?.scrollToBottom()
}

document.onkeydown = (e) => input()
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