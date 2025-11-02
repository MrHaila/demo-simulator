<template lang="pug">
span.font-mono.text-sm {{ progressText }}
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  run?: boolean
  progress: number // 0-100
  width?: number
  speed?: number
}>()

const emit = defineEmits(['done'])

const currentProgress = ref(0)
const width = props.width ?? 20

const progressText = computed(() => {
  const filled = Math.round((currentProgress.value / 100) * width)
  const empty = width - filled
  return `[${'█'.repeat(filled)}${'░'.repeat(empty)}] ${Math.round(currentProgress.value)}%`
})

let interval: number | null = null

watch(() => props.run, (newRun) => {
  if (newRun) {
    currentProgress.value = 0
    interval = setInterval(() => {
      if (currentProgress.value < props.progress) {
        currentProgress.value = Math.min(currentProgress.value + (props.speed ?? 2), props.progress)
      } else if (interval) {
        clearInterval(interval)
        interval = null
        emit('done')
      }
    }, 50)
  } else if (interval) {
    clearInterval(interval)
    interval = null
  }
})
</script>
