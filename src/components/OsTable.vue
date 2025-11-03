<template lang="pug">
div(class="rounded border border-liver")
  table(class="w-full font-mono text-sm")
    tbody
      tr(class="border-b border-liver")
        td(class="rounded-tl-sm bg-gray-800 px-3 py-2 font-semibold") Code Analysis
        td(class="rounded-tr-sm bg-gray-800 px-3 py-2 text-right font-semibold") Result
      tr
        td(class="px-3 py-2") Lines of code
        td(class="px-3 py-2 text-right")
          AnimatedNumber(
            v-if="animate"
            :run="true"
            :number="linesOfCode"
            :speed="25"
          )
          span(v-else) {{ linesOfCode }}
      tr
        td(class="px-3 py-2") Characters typed
        td(class="px-3 py-2 text-right")
          AnimatedNumber(
            v-if="animate"
            :run="true"
            :number="charactersTyped"
            :speed="50"
          )
          span(v-else) {{ charactersTyped }}
      tr
        td(class="px-3 py-2") Programming time
        td(class="px-3 py-2 text-right") {{ programmingTime }}
</template>

<script lang="ts" setup>
import AnimatedNumber from '@/components/AnimatedNumber.vue'

interface Props {
  linesOfCode: number
  charactersTyped: number
  programmingTime: string
  animate?: boolean
}

withDefaults(defineProps<Props>(), {
  animate: false,
})
</script>
