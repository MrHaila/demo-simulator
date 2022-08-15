<template lang="pug">
span {{ displayedText }}
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  run?: boolean,
  number: number,
  speed?: number,
}>()

const emits = defineEmits(['done'])

const displayedText = ref('')
let counter = 0
const interval = setInterval(() => {
  if (props.run === undefined || props.run) {
    counter += props.speed || 66
    if (counter >= props.number) {
      counter = props.number
      clearInterval(interval)
      emits('done')
    }
    displayedText.value = counter.toString()
  }
}, 10)



</script>