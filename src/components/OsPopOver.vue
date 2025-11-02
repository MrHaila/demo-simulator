<template lang="pug">
OsWindow(
  v-if="isVisible",
  :title="title",
  class="absolute top-1/2 left-1/2 min-h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform"
)
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useOverlay } from '@/components/composables/OsOverlay'
import OsWindow from '@/components/windows/OsWindow.vue'

const { showOverlay, hideOverlay } = useOverlay()
showOverlay()

const props = defineProps<{
  title: string
}>()

const isVisible = ref(false)
</script>
