<template lang="pug">
os-window(
  title="Monkey Works X Pro - Orderbook.mwx"
  no-padding
  ref="mwxWindow"
)
  //- TODO: move scrolling to the table body instead of all window contents
  table(class="table-fixed font-mono border-collapse w-full")
    thead(class="text-left bg-gray-700")
      tr
        th(class="border border-liver py-1 px-2") Order Id
        th(class="border border-liver py-1 px-2") Type
        th(class="border border-liver py-1 px-2") Quantity
        th(class="border border-liver py-1 px-2") Name
        th(class="border border-liver py-1 px-2") Country
    tbody(v-for="(row, index) in displayedRows" :key="index")
      tr
        td(class="border border-liver py-1 px-2") {{ row.id }}#[span(v-show="getNextIncompleteRowField(row) === 'id' && windowIsInfocus" class="blink") █]
        td(class="border border-liver py-1 px-2") {{ row.type }}#[span(v-show="getNextIncompleteRowField(row) === 'type' && windowIsInfocus" class="blink") █]
        td(class="border border-liver py-1 px-2") {{ row.quantity }}#[span(v-show="getNextIncompleteRowField(row) === 'quantity' && windowIsInfocus" class="blink") █]
        td(class="border border-liver py-1 px-2") {{ row.name }}#[span(v-show="getNextIncompleteRowField(row) === 'name' && windowIsInfocus" class="blink") █]
        td(class="border border-liver py-1 px-2") {{ row.country }}#[span(v-show="getNextIncompleteRowField(row) === 'country' && windowIsInfocus" class="blink") █]
      tr(v-if="Number(row.id) % 10 === 0 && row.id !== displayedRows[0].id && row.id !== displayedRows[displayedRows.length - 1].id")
        td(colspan="5" class="text-center font-sans py-3 bg-gray-700 border border-liver px-2")
          p You have earned a back scratch from {{ PlotCharacters.Koko }}.
          aside(class="text-xl text-liver") +1 Back Scratch
      tr(v-if="displayedRows.length === 1 && row.id === displayedRows[displayedRows.length - 1].id")
        //- TODO: animate?
        td(colspan="5" class="w-full text-center p font-sans italic text-sm pt-2 text-gray-500") Press any key to do work.

  template(#footer-right)
    os-button(@click="gameStateStore.currentEliteOsApp = EliteOsApps.Desktop") Whatever, I'm done
</template>

<script lang="ts" setup>
import { nextTick, ref } from 'vue'
import OsWindow from './OsWindow.vue'
import { countries, names } from '@/source_code/work'
import { useGameStateStore, EliteOsApps } from '@/stores/gameStateStore'
import { onKeyStroke, useWindowFocus } from '@vueuse/core'
import OsButton from '@/components/OsButton.vue'
import { PlotCharacters } from '@/content/narrative'

const gameStateStore = useGameStateStore()

const mwxWindow = ref<InstanceType<typeof OsWindow> | null>(null)

interface MwxEntry {
  id: string // always increment by one
  type: string // 'bananas'
  quantity: string // between 1 and 1000
  name: string
  country: string
}
const displayedRows = ref<MwxEntry[]>([])
function addEmptyOrder() {
  displayedRows.value.push({
    id: '',
    type: '',
    quantity: '',
    name: '',
    country: '',
  })
}
addEmptyOrder()

function getRandomOrder(): MwxEntry {
  const id = gameStateStore.profile.latestWorkId
  const type = 'bananas'
  const quantity = Math.floor(Math.random() * 1000) + 1
  const nameIndex = Math.floor(Math.random() * (names.length - 1))
  const name = names[nameIndex]
  const countryIndex = Math.floor(Math.random() * (countries.length - 1))
  const country = countries[countryIndex]
  return { 
    id: id.toString(),
    type,
    quantity: quantity.toString(),
    name,
    country,
  }
}
let nextOrder = getRandomOrder()

async function input (remainingAmountLeftToType?: number) {
  let amountLeftToType = remainingAmountLeftToType || gameStateStore.profile.codingSpeed

  let currentOrder = displayedRows.value[displayedRows.value.length - 1]

  // If there are characters left in amountLeftToType, then continue adding them to the current order's id
  if (currentOrder.id.length < nextOrder.id.length) {
    const amountToType = Math.min(amountLeftToType, nextOrder.id.length - currentOrder.id.length)
    currentOrder.id += nextOrder.id.slice(currentOrder.id.length, currentOrder.id.length + amountToType)
    amountLeftToType -= amountToType
  }

  // If there are characters left in amountLeftToType, then continue adding them to the current order's type
  if (currentOrder.type.length < nextOrder.type.length) {
    const amountToType = Math.min(amountLeftToType, nextOrder.type.length - currentOrder.type.length)
    currentOrder.type += nextOrder.type.slice(currentOrder.type.length, currentOrder.type.length + amountToType)
    amountLeftToType -= amountToType
  }

  // If there are characters left in amountLeftToType, then continue adding them to the current order's quantity
  if (currentOrder.quantity.length < nextOrder.quantity.length) {
    const amountToType = Math.min(amountLeftToType, nextOrder.quantity.length - currentOrder.quantity.length)
    currentOrder.quantity += nextOrder.quantity.slice(currentOrder.quantity.length, currentOrder.quantity.length + amountToType)
    amountLeftToType -= amountToType
  }

  // If there are characters left in amountLeftToType, then continue adding them to the current order's name
  if (currentOrder.name.length < nextOrder.name.length) {
    const amountToType = Math.min(amountLeftToType, nextOrder.name.length - currentOrder.name.length)
    currentOrder.name += nextOrder.name.slice(currentOrder.name.length, currentOrder.name.length + amountToType)
    amountLeftToType -= amountToType
  }

  // If there are characters left in amountLeftToType, then continue adding them to the current order's country
  if (currentOrder.country.length < nextOrder.country.length) {
    const amountToType = Math.min(amountLeftToType, nextOrder.country.length - currentOrder.country.length)
    currentOrder.country += nextOrder.country.slice(currentOrder.country.length, currentOrder.country.length + amountToType)
    amountLeftToType -= amountToType
  }

  // If the current order is complete, then add a new empty order and count points
  if (currentOrder.id.length === nextOrder.id.length &&
      currentOrder.type.length === nextOrder.type.length &&
      currentOrder.quantity.length === nextOrder.quantity.length &&
      currentOrder.name.length === nextOrder.name.length &&
      currentOrder.country.length === nextOrder.country.length) {
    // If the current id was divisible by 10, add points
    if (gameStateStore.profile.latestWorkId % 10 === 0) {
      gameStateStore.profile.backScratches++
    }

    gameStateStore.profile.latestWorkId++
    addEmptyOrder()
    nextOrder = getRandomOrder()
  }

  // If there are still characters left to type, then continue typing
  if (amountLeftToType > 0) input(amountLeftToType)

  // If there are more than 10 rows, then remove the first row
  if (displayedRows.value.length > 100) displayedRows.value.shift()

  // Keep new code visible.
  await nextTick() // Wait for a DOM update.
  mwxWindow.value?.scrollToBottom()
}

const windowIsInfocus = useWindowFocus()
onKeyStroke((e) => {
  if (e.key === "Escape") {
    gameStateStore.currentEliteOsApp = EliteOsApps.Desktop
  } else if (windowIsInfocus.value && e.key.length === 1) {
    // e.preventDefault()
    input()
  }
})

function getNextIncompleteRowField (row: MwxEntry) {
  // Fix first field not being highlighted
  if (gameStateStore.profile.latestWorkId === Number(row.id)) {
    if (row.id !== nextOrder.id) return 'id'
    if (row.type !== nextOrder.type) return 'type'
    if (row.quantity !== nextOrder.quantity) return 'quantity'
    if (row.name !== nextOrder.name) return 'name'
    if (row.country !== nextOrder.country) return 'country'
  }
  return null
}
</script>

<style>
.blink {
  animation: blink-animation 1s steps(2, start) infinite;
}
@keyframes blink-animation {
  to {
    visibility: hidden;
  }
}
</style>