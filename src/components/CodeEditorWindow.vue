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
  SPEC:
  - Most buttons generate code.
  - Amount generated starts from 1 character and improves with skill.
  - Current challenge has a memory limit (number of characters).
  - Code generation should start from a random line break that's followed by a character.
  - After a code section(?) completes, it may randomly become more powerful.
  - Blinking box cursor when active.
*/

const codePoints = ref(0)
const characterLimit = ref(10)

// onMounted(() => {
//   console.log(h4xBody.value?.)
// })

const displayedCode = ref("")
const displayedCodeRows = computed(() => displayedCode.value.split('\n'))
let sourceCodeCursorPosition = 0
let amountCoded = 0

const codingSkill = 30

const h4xWindow = ref<InstanceType<typeof OsWindow> | null>(null)
async function input () {
  amountCoded += codingSkill
  displayedCode.value += SourceCode.substring(sourceCodeCursorPosition, amountCoded)
  sourceCodeCursorPosition += codingSkill
  await nextTick()
  h4xWindow.value?.scrollToBottom()
}

const numberOfLines = computed(() => (displayedCode.value.match(/\n/g) || '').length + 1)

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