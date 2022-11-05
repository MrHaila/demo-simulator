<template lang="pug">
os-window
  span {{ text }}
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import OsWindow from '../components/OsWindow.vue'

let text = ref("asdasdas")

function input () {
  text.value += "asd"
}

document.onkeydown = (e) => input()
</script>