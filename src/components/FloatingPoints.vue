<template lang="pug">
div(
  v-if="show"
  class="floating-points"
  :class="qualityClass"
) +{{ points }}
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import type { CodeQuality } from '@/composables/useCodeInput'

interface Props {
  points: number
  quality: CodeQuality
}

const props = defineProps<Props>()

const emit = defineEmits<{
  complete: []
}>()

const show = ref(false)

onMounted(() => {
  show.value = true
  setTimeout(() => {
    show.value = false
    emit('complete')
  }, 1000)
})

const qualityClass = computed(() => {
  switch (props.quality) {
    case 'efficient':
      return 'quality-efficient'
    case 'creative':
      return 'quality-creative'
    case 'perfect':
      return 'quality-perfect'
    default:
      return 'quality-mundane'
  }
})
</script>

<style scoped>
.floating-points {
  position: absolute;
  left: 50%;
  bottom: 100%;
  font-weight: bold;
  font-size: 0.875rem;
  pointer-events: none;
  z-index: 1000;
  animation: float-up 1s linear forwards;
  transform: translateX(-50%);
}

@keyframes float-up {
  0% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  50% {
    opacity: 1;
    transform: translateX(-50%) translateY(-20px);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(-40px);
  }
}

.quality-mundane {
  color: rgb(229, 229, 229);
  text-shadow: 0 0 4px rgba(229, 229, 229, 0.8);
}

.quality-efficient {
  color: rgb(59, 130, 246);
  text-shadow: 0 0 4px rgba(59, 130, 246, 0.8);
}

.quality-creative {
  color: rgb(236, 72, 153);
  text-shadow: 0 0 4px rgba(236, 72, 153, 0.8);
}

.quality-perfect {
  color: rgb(234, 179, 8);
  text-shadow: 0 0 4px rgba(234, 179, 8, 0.8);
}
</style>
