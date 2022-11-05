<template lang="pug">
os-window
  pre {{ displayedCode }}
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import OsWindow from '../components/OsWindow.vue'
import SourceCode from '../source_code/code'

// TODO: create CodeEditorWindow and use that instead of the root scene.

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

const displayedCode = ref("")
let sourceCodeCursorPosition = 0
let amountCoded = 0

const codingSkill = 1

function input () {
  amountCoded += codingSkill
  displayedCode.value += SourceCode.substring(sourceCodeCursorPosition, amountCoded)
  sourceCodeCursorPosition += codingSkill
}

document.onkeydown = (e) => input()
</script>