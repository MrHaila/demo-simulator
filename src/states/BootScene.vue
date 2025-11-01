<template lang="pug">
div(class="p-2 flex justify-between h-screen")
  div(class="flex flex-col justify-between")
    div
      div(class="flex")
        div(class="w-8") H 
        div
          p Real Portable BIOS v4.51WEB, Assembly 2023 Build
          p Copyleft (ɔ) 1987-2023, Hailasoft Oy Ab

      div(class="mt-5")
        animated-text(:run="currentState === 2" text="OSFX VER:1.0 23/3/14" @done="nextState(300)")
      div(v-show="currentState === 3" class="mt-10")
        animated-text(:run="currentState === 3" :speed="200" text="WAIT..." @done="nextState(1300)")
      div(class="mt-36")
        animated-text(:run="currentState === 4" :speed="10" text="SKELETOR-1 CPU at 366MHz" @done="nextState()")
      div
        animated-text(:run="currentState === 5" :speed="10" text="Memory Test :  " @done="nextState()")
        animated-number(:run="currentState === 6" :number="65536" :speed="431" @done="nextState()")
        span(v-show="currentState === 7")  OK

    div
      p Press #[span(class="text-earth") π] to enter SETUP, #[span(class="text-earth") ANY KEY] to skip memory test
      p 23/6/1-ö092DX-2ASÅ190Z-00

  div ASSEMBLY LOGO
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import AnimatedText from '../components/AnimatedText.vue'
import AnimatedNumber from '../components/AnimatedNumber.vue';
import { onKeyStroke, useWindowFocus } from '@vueuse/core';

const emits = defineEmits(['done'])

const AnimationState = {
  Header: 'Header',
  Gibberish1: 'Gibberish1',
  Wait: 'Wait',
  CPU: 'CPU',
  MemoryLabel: 'MemoryLabel',
  MemTest: 'MemTest',
  OK: 'OK',
} as const

const currentState = ref<(typeof AnimationState)[keyof typeof AnimationState]>(AnimationState.Header)

setTimeout(() => { nextState(); }, 1000)

function nextState(delay?: number): void {
  if (delay) {
    setTimeout(() => {
      nextState()
    }, delay)
    return
  }

  switch (currentState.value) {
    case AnimationState.Header:
      currentState.value = AnimationState.Gibberish1
      break
    case AnimationState.Gibberish1:
      currentState.value = AnimationState.Wait
      break
    case AnimationState.Wait:
      currentState.value = AnimationState.CPU
      break
    case AnimationState.CPU:
      currentState.value = AnimationState.MemoryLabel
      break
    case AnimationState.MemoryLabel:
      currentState.value = AnimationState.MemTest
      break
    case AnimationState.MemTest:
      currentState.value = AnimationState.OK
      setTimeout(() => {
        emits('done')
      }, 1000)
      break
    case AnimationState.OK:
      // Final state - nothing to do, just wait for user input or timeout
      break
  }
}

const windowIsInfocus = useWindowFocus()
onKeyStroke((e) => {
  if (windowIsInfocus.value && e.key.length === 1) {
    emits('done')
  }
})
</script>

<style>
.type-css {
  position: absolute;
}
.type-css p {
  overflow: hidden;
  line-height: 1;
  white-space: nowrap;
  animation: text .2s steps(20, end);
}

@keyframes text {
  from { width: 0; }
  to { width: 100%; }
}
@keyframes cursor {
  from, to { border-color: transparent; }
  50% { border-color: #fff; }
}
</style>