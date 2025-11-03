<template lang="pug">
OsDialog(
  v-if="modelValue"
  :title="getDialogTitle()"
  v-model="localModelValue"
)
  // Analyzing phase
  div(v-if="currentState === ChallengeStates.Analyzing")
    div(class="mb-4")
      AnimatedText(
        :run="true"
        text="Analyzing code structure..."
        :speed="15"
      )
    div(class="my-2")
      AsciiProgressBar(
        :run="analyzingProgress"
        :progress="100"
        :speed="4"
        @done="$emit('startCompiling')"
      )

  // Compilation phase with analysis results and compilation bar below
  div(v-else-if="currentState === ChallengeStates.Compiling")
    // Analysis results table (stays visible)
    OsTable(
      :lines-of-code="displayedCodeRows.length"
      :characters-typed="amountCoded"
      :programming-time="humanizedProgrammingTime"
      :animate="true"
      class="mt-4 mb-6"
    )

    div(class="mt-4")
      AnimatedText(
        :run="true"
        text="Compiling optimized bytecode..."
        :speed="15"
      )

    // Compilation progress bar (below analysis)
    div(class="mb-4")
      div(class="mb-2 text-sm text-gray-400") Compilation Progress
      AsciiProgressBar(
        :run="compilingProgress"
        :progress="100"
        :speed="3"
        @done="$emit('showSuccess')"
      )

  // Success phase with compilation status and analysis results
  div(v-else-if="currentState === ChallengeStates.Success")
    // Analysis results remain visible
    OsTable(
      :lines-of-code="displayedCodeRows.length"
      :characters-typed="amountCoded"
      :programming-time="humanizedProgrammingTime"
    )

    h2(class="mt-4 text-lg") Compilation status: #[span(class="text-olive") SUCCESS!]

  template(#footer)
    os-button(
      @click="$emit('run')"
      hotkey="Enter"
      :disabled="currentState !== ChallengeStates.Success"
    ) Run
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import AnimatedText from '@/components/AnimatedText.vue'
import AsciiProgressBar from '@/components/AsciiProgressBar.vue'
import OsButton from '@/components/OsButton.vue'
import OsDialog from '@/components/OsDialog.vue'
import OsTable from '@/components/OsTable.vue'

const ChallengeStates = {
  Intro: 'intro',
  Coding: 'coding',
  Results: 'results',
  Compiling: 'compiling',
  Analyzing: 'analyzing',
  Success: 'success',
  Outro: 'outro',
} as const

interface CodeLine {
  lineNumber: number
  text: string
}

interface Props {
  modelValue: boolean
  currentState: (typeof ChallengeStates)[keyof typeof ChallengeStates]
  analyzingProgress: boolean
  compilingProgress: boolean
  displayedCodeRows: CodeLine[]
  amountCoded: number
  humanizedProgrammingTime: string
}

const props = defineProps<Props>()

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'startCompiling'): void
  (e: 'showSuccess'): void
  (e: 'run'): void
}

const emit = defineEmits<Emits>()

const localModelValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  },
})

function getDialogTitle(): string {
  switch (props.currentState) {
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
</script>
