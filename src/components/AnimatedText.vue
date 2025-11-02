<template lang="pug">
span {{ displayedText }}
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  run?: boolean
  text: string
  speed?: number
}>()

const emits = defineEmits(['done'])

const displayedText = ref('')
const interval = setInterval(() => {
  if (props.run) {
    displayedText.value = props.text.substring(0, displayedText.value.length + 1)
  }

  if (displayedText.value.length === props.text.length) {
    clearInterval(interval)
    emits('done')
  }
}, props.speed ?? 25)
</script>
