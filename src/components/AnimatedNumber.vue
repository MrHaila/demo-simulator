<template lang="pug">
span {{ displayedText }}
</template>

<script setup lang="ts">
import { ref } from 'vue'

const {
  run,
  number,
  speed = 66,
} = defineProps<{
  run?: boolean
  number: number
  speed?: number
}>()

const emits = defineEmits(['done'])

const displayedText = ref('')
let counter = 0
const interval = setInterval(() => {
  if (run) {
    counter += speed
    if (counter >= number) {
      counter = number
      clearInterval(interval)
      emits('done')
    }
    displayedText.value = counter.toString()
  }
}, 10)
</script>
