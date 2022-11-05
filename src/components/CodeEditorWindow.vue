<template lang="pug">
os-window(
  title="H4X_EDIT"
  no-padding
  class="overflow-y-scroll"
)
  div(class="flex" ref="h4xBody")
    div(class="h-full text-right px-2 bg-gray-800 text-gray-400 font-mono border-r-gray-700 border-r-2" style="min-width: 3rem;")
      div(v-for="i in numberOfLines" class="") {{ i }}

    pre(class="font-mono px-2") {{ displayedCode }}
      span(class="blink") █
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
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
const characterLimit = ref(100)

const h4xBody = ref<Element | null>(null)
// onMounted(() => {
//   console.log(h4xBody.value?.)
// })

const displayedCode = ref("")
let sourceCodeCursorPosition = 0
let amountCoded = 0

const codingSkill = 30

function input () {
  amountCoded += codingSkill
  displayedCode.value += SourceCode.substring(sourceCodeCursorPosition, amountCoded)
  sourceCodeCursorPosition += codingSkill
  if (h4xBody.value) h4xBody.value.scrollTop = h4xBody.value.scrollHeight // Keep scrolled to the bottom. Needs testing.
  console.log(h4xBody.value?.scrollHeight)
}

const numberOfLines = computed(() => (displayedCode.value.match(/\n/g) || '').length + 1)

document.onkeydown = (e) => input()
</script>

<style>
.blink {
  animation: blink-animation 2s steps(2, start) infinite;
}
@keyframes blink-animation {
  to {
    visibility: hidden;
  }
}
</style>