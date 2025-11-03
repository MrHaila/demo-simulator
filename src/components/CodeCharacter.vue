<template lang="pug">
span(:class="characterClass") {{ char }}
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  char: string
  isNew: boolean
}

const props = defineProps<Props>()

const characterClass = computed(() => ({
  'char-new': props.isNew,
  'char-space': props.char === ' ',
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
</style>
