<template lang="pug">
os-window(
  title="Monkey Works X Pro - Orderbook.mwx",
  no-padding,
  ref="mwxWindow"
)
  div(
    ref="tableContainer",
    class="scrollbar-hide h-full overflow-y-auto",
    @wheel.prevent,
    @touchmove.prevent
  )
    table(class="w-full table-fixed border-collapse font-mono")
      thead(class="sticky -top-0.5 z-10 bg-gray-700 text-left shadow-md")
        tr
          th(class="border border-liver px-2 py-1") Order Id
          th(class="border border-liver px-2 py-1") Type
          th(class="border border-liver px-2 py-1") Quantity
          th(class="border border-liver px-2 py-1") Name
          th(class="border border-liver px-2 py-1") Country
      tbody
        template(
          :key="index",
          v-for="(row, index) in displayedRows"
        )
          tr(style="height: 33px")
            td(class="border border-liver px-2 py-1") {{ row.id }}#[span(v-show="getNextIncompleteRowField(row) === 'id' && windowIsInfocus", class="blink") \u2588]
            td(class="border border-liver px-2 py-1") {{ row.type }}#[span(v-show="getNextIncompleteRowField(row) === 'type' && windowIsInfocus", class="blink") \u2588]
            td(class="border border-liver px-2 py-1") {{ row.quantity }}#[span(v-show="getNextIncompleteRowField(row) === 'quantity' && windowIsInfocus", class="blink") \u2588]
            td(class="border border-liver px-2 py-1") {{ row.name }}#[span(v-show="getNextIncompleteRowField(row) === 'name' && windowIsInfocus", class="blink") \u2588]
            td(class="border border-liver px-2 py-1") {{ row.country }}#[span(v-show="getNextIncompleteRowField(row) === 'country' && windowIsInfocus", class="blink") \u2588]
          tr(
            v-if="Number(row.id) % 10 === 9 && row.id !== displayedRows[0].id && row.id !== displayedRows[displayedRows.length - 1].id"
          )
            td(
              colspan="5",
              class="border border-liver bg-gray-700 px-2 py-3 text-center font-sans"
            )
              p You have earned a scratch from {{ PlotCharacters.Koko }}.
              aside(class="text-xl text-liver") +1 Scratch
        tr
          td(
            colspan="5",
            class="p w-full pt-2 text-center font-sans text-sm text-gray-500"
          ) {{ gameStateStore.profile.latestWorkId % 10 }}/10 to next reward.
        tr(v-if="displayedRows.length === 1")
          td(
            colspan="5",
            class="p w-full animate-pulse text-center font-sans text-sm text-gray-500 italic"
          ) Press any key to do work.

  template(#footer-right)
    os-button(
      hotkey="Escape",
      @click="gameStateStore.currentEliteOsApp = EliteOsApps.Desktop"
    ) Save and close
</template>

<script lang="ts" setup>
import { nextTick, ref } from 'vue'
import { onKeyStroke, useWindowFocus } from '@vueuse/core'
import OsButton from '@/components/OsButton.vue'
import { PlotCharacters } from '@/content/narrative'
import { countries, names } from '@/source_code/work'
import { EliteOsApps, useGameStateStore } from '@/stores/gameStateStore'
import OsWindow from './OsWindow.vue'

const gameStateStore = useGameStateStore()

const mwxWindow = ref<InstanceType<typeof OsWindow> | null>(null)
const tableContainer = ref<HTMLDivElement | null>(null)

interface MwxEntry {
  id: string // always increment by one
  type: string // 'bananas'
  quantity: string // between 1 and 1000
  name: string
  country: string
}
const displayedRows = ref<MwxEntry[]>([])
function addEmptyOrder(): void {
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

// eslint-disable-next-line complexity -- I accept
async function input(remainingAmountLeftToType?: number): Promise<void> {
  let amountLeftToType = remainingAmountLeftToType ?? gameStateStore.profile.codingSpeed

  const currentOrder = displayedRows.value[displayedRows.value.length - 1]

  if (!currentOrder) throw new Error('No current order.')

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
    currentOrder.quantity += nextOrder.quantity.slice(
      currentOrder.quantity.length,
      currentOrder.quantity.length + amountToType,
    )
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
    currentOrder.country += nextOrder.country.slice(
      currentOrder.country.length,
      currentOrder.country.length + amountToType,
    )
    amountLeftToType -= amountToType
  }

  // If the current order is complete, then add a new empty order and count points
  if (
    currentOrder.id.length === nextOrder.id.length &&
    currentOrder.type.length === nextOrder.type.length &&
    currentOrder.quantity.length === nextOrder.quantity.length &&
    currentOrder.name.length === nextOrder.name.length &&
    currentOrder.country.length === nextOrder.country.length
  ) {
    // If the current id modulo 10 is 9, add a reward
    if (gameStateStore.profile.latestWorkId !== 0 && gameStateStore.profile.latestWorkId % 10 === 9) {
      gameStateStore.profile.scratches++
    }

    gameStateStore.profile.latestWorkId++
    addEmptyOrder()
    nextOrder = getRandomOrder()
  }

  // If there are still characters left to type, then continue typing
  if (amountLeftToType > 0) void input(amountLeftToType)

  // If there are more than 10 rows, then remove the first row
  if (displayedRows.value.length > 100) displayedRows.value.shift()

  // Keep new code visible - scroll to bottom
  await nextTick() // Wait for a DOM update.
  if (tableContainer.value) {
    tableContainer.value.scrollTop = tableContainer.value.scrollHeight
  }
}

const windowIsInfocus = useWindowFocus()
onKeyStroke((e) => {
  // Handle generic text input (any single character key)
  // Note: Escape key is now handled by the OsButton component
  if (windowIsInfocus.value && e.key.length === 1) {
    void input()
  }
})

function getNextIncompleteRowField(row: MwxEntry): string | null {
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
