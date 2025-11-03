<template lang="pug">
span(:class="characterClass") {{ char }}
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { CodeQuality } from '@/composables/useCodeInput'

interface Props {
  char: string
  isNew: boolean
  quality: CodeQuality
}

const props = defineProps<Props>()

const characterClass = computed(() => ({
  'char-new': props.isNew,
  'char-space': props.char === ' ',
  'char-efficient': props.quality === 'efficient',
  'char-creative': props.quality === 'creative',
  'char-perfect': props.quality === 'perfect',
}))
</script>

<style scoped>
.char-new {
  animation: char-flash 0.3s ease-out;
}

@keyframes char-flash {
  0% {
    color: rgb(255, 127, 39);
    text-shadow: 0 0 8px rgba(255, 127, 39, 0.8);
  }
  100% {
    color: inherit;
    text-shadow: none;
  }
}

.char-efficient {
  color: rgb(59, 130, 246);
  animation: efficient-glow 1s ease-out;
}

@keyframes efficient-glow {
  0% {
    color: rgb(255, 255, 255);
    background-color: rgba(59, 130, 246, 0.4);
    box-shadow: 0 0 24px 4px rgba(59, 130, 246, 0.8);
  }
  100% {
    color: rgb(59, 130, 246);
    background-color: transparent;
    box-shadow: none;
  }
}
</style>
