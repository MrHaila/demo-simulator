<template lang="pug">
os-window(
  title="Monkey Works X Pro - Orderbook.mwx"
  no-padding
  ref="mwxWindow"
)
  table(class="table-fixed font-mono border-collapse w-full")
    thead(class="text-left")
      tr
        th(class="border border-liver py-1 px-2") Order Id
        th(class="border border-liver py-1 px-2") Type
        th(class="border border-liver py-1 px-2") Quantity
        th(class="border border-liver py-1 px-2") Name
        th(class="border border-liver py-1 px-2") Country
    tbody
      tr(v-for="(row, index) in displayedRows" :key="index")
        //- td(class="text-right px-2 bg-gray-800 text-gray-400 border-r-gray-700 border-r-2 text-xs align-top" style="min-width: 3rem; padding-top: 0.32rem;") {{ row.rowNumber }}
        //- td(class="whitespace-pre-wrap h-6 px-2") {{ row.text }}#[span(v-show="index === displayedCodeRows.length - 1" class="blink") █]
        td(class="border border-liver py-1 px-2") {{ row.id }}#[span(v-show="getNextIncompleteRowField(row) === 'id'" class="blink") █]
        td(class="border border-liver py-1 px-2") {{ row.type }}#[span(v-show="getNextIncompleteRowField(row) === 'type'" class="blink") █]
        td(class="border border-liver py-1 px-2") {{ row.quantity }}#[span(v-show="getNextIncompleteRowField(row) === 'quantity'" class="blink") █]
        td(class="border border-liver py-1 px-2") {{ row.name }}#[span(v-show="getNextIncompleteRowField(row) === 'name'" class="blink") █]
        td(class="border border-liver py-1 px-2") {{ row.country }}#[span(v-show="getNextIncompleteRowField(row) === 'country'" class="blink") █]
</template>

<script lang="ts" setup>
import { nextTick, ref } from 'vue'
import OsWindow from './OsWindow.vue'
import { countries, names } from '../source_code/work'

let latestWorkId = 0
const codingSpeed = 1

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
  const id = latestWorkId
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
  let amountLeftToType = remainingAmountLeftToType || codingSpeed

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
    latestWorkId++
    addEmptyOrder()
    nextOrder = getRandomOrder()

    // TODO: Count points
  }

  // If there are still characters left to type, then continue typing
  if (amountLeftToType > 0) input(amountLeftToType)

  // If there are more than 10 rows, then remove the first row
  if (displayedRows.value.length > 100) displayedRows.value.shift()

  // Keep new code visible.
  await nextTick() // Wait for a DOM update.
  mwxWindow.value?.scrollToBottom()
}

document.onkeydown = () => input()

function getNextIncompleteRowField (row: MwxEntry) {
  if (latestWorkId === Number(row.id)) {
    if (row.id.length < nextOrder.id.length) return 'id'
    if (row.type.length < nextOrder.type.length) return 'type'
    if (row.quantity.length < nextOrder.quantity.length) return 'quantity'
    if (row.name.length < nextOrder.name.length) return 'name'
    if (row.country.length < nextOrder.country.length) return 'country'
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