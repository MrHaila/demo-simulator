import { computed, onBeforeUnmount, ref } from "vue"

/**
 * List of subscribers to the overlay.
 */
const subscribers = ref<number[]>([])

/**
 * Computed property to determine if the overlay is visible.
 * @returns {boolean} True if the overlay is visible.
 */
const isOverlayVisible = computed(() => subscribers.value.length > 0)

/**
 * Computed property to determine the total number of subscribers to the overlay.
 */
const totalSubscribers = computed(() => subscribers.value.length)

/**
 * Composable to show and hide the overlay.
 * @returns {object} Object with the following properties:
 * - isOverlayVisible: Computed property to determine if the overlay is visible.
 * - showOverlay: Function to show the overlay.
 * - hideOverlay: Function to hide the overlay.
 */
export function useOverlay() {
  const id = uniqueId()
  
  /**
   * Function to show the overlay.
   */
  function showOverlay() {
    // If the overlay is already visible, don't add the subscriber again.
    if (subscribers.value.indexOf(id) > -1) {
      return
    }

    subscribers.value.push(id)
  }

  /**
   * Function to hide the overlay.
   */
  function hideOverlay() {
    const index = subscribers.value.indexOf(id)
    if (index > -1) {
      subscribers.value.splice(index, 1)
    }
  }
  
  // Hide the overlay when the component is unmounted.
  onBeforeUnmount(() => {
    hideOverlay()
  })

  return { isOverlayVisible, showOverlay, hideOverlay, totalSubscribers }
}

// Function to get a sequential unique ID.
let id = 0
export function uniqueId() {
  return id++
}
