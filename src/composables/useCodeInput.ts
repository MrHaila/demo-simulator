import { nextTick, ref, type Ref } from 'vue'
import { onKeyStroke, useWindowFocus } from '@vueuse/core'
import { useGameStateStore } from '@/stores/gameStateStore'

export interface CodeCharacter {
  char: string
  timestamp: number
  isNew: boolean
}

export interface CodeLine {
  lineNumber: number
  characters: CodeCharacter[]
}

interface Challenge {
  id: number
  challengeType: 'tutorial' | 'scoreAttack' | 'timeAttack' | 'compo'
}

interface UseCodeInputParams {
  sourceCode: string
  initialCursorPosition: number
  challenge: Challenge | null
  onChallengeComplete: () => void
  currentState: Ref<string>
  codingStateValue: string
}

interface WindowRef {
  scrollTop: number
  scrollHeight: number
}

interface UseCodeInputReturn {
  codePoints: Ref<number>
  amountCoded: Ref<number>
  displayedCodeRows: Ref<CodeLine[]>
  input: (windowRef: Ref<WindowRef | null>) => Promise<void>
  setupKeyboardHandling: (windowRef: Ref<WindowRef | null>) => void
}

export function useCodeInput(params: UseCodeInputParams): UseCodeInputReturn {
  const { sourceCode, initialCursorPosition, challenge, onChallengeComplete, currentState, codingStateValue } = params
  const gameStateStore = useGameStateStore()

  const codePoints = ref(0)
  const amountCoded = ref(0)
  const displayedCodeRows = ref<CodeLine[]>([
    {
      lineNumber: 1,
      characters: [],
    },
  ])

  let sourceCodeCursorPosition = initialCursorPosition

  function codeToPoints(code: string): number {
    let points = 0

    // Add points for each non-whitespace, non-line-break character.
    // eslint-disable-next-line @typescript-eslint/prefer-for-of -- need index access
    for (let i = 0; i < code.length; i++) {
      if (code[i] !== ' ' && code[i] !== '\n') points++
    }

    return points
  }

  // eslint-disable-next-line complexity -- character animation tracking adds complexity
  async function input(windowRef: Ref<WindowRef | null>): Promise<void> {
    amountCoded.value += gameStateStore.profile.codingSpeed

    // Grab new characters from the source file and split by line breaks.
    let newCode = sourceCode.substring(
      sourceCodeCursorPosition,
      sourceCodeCursorPosition + gameStateStore.profile.codingSpeed,
    )

    // If the source file ran out in a non-tutorial challenge...
    if (newCode.length !== gameStateStore.profile.codingSpeed && challenge?.challengeType !== 'tutorial') {
      // Loop back and add the rest.
      sourceCodeCursorPosition = 0
      newCode += `\n${sourceCode.substring(sourceCodeCursorPosition, gameStateStore.profile.codingSpeed - newCode.length)}`
    }

    const newCodeRows = newCode.split('\n')
    sourceCodeCursorPosition += gameStateStore.profile.codingSpeed

    const timestamp = Date.now()

    // Append first new row to the latest displayed row.
    const lastRow = displayedCodeRows.value[displayedCodeRows.value.length - 1]
    const firstRowChars = (newCodeRows[0] ?? '').split('').map((char) => ({
      char,
      timestamp,
      isNew: true,
    }))
    lastRow.characters.push(...firstRowChars)

    // For each subsequent row...
    for (let i = 1; i < newCodeRows.length; i++) {
      // Directly add new rows to the display buffer.
      const currentLastRow = displayedCodeRows.value[displayedCodeRows.value.length - 1]
      const chars = (newCodeRows[i] ?? '').split('').map((char) => ({
        char,
        timestamp,
        isNew: true,
      }))
      displayedCodeRows.value.push({
        lineNumber: currentLastRow.lineNumber + 1,
        characters: chars,
      })

      // Trim excess lines.
      if (displayedCodeRows.value.length > 300) {
        displayedCodeRows.value.shift()
      }
    }

    // Mark characters as no longer new after animation duration
    setTimeout(() => {
      for (const row of displayedCodeRows.value) {
        for (const char of row.characters) {
          if (char.timestamp === timestamp) {
            char.isNew = false
          }
        }
      }
    }, 300)

    codePoints.value += codeToPoints(newCode)

    // Keep new code visible.
    await nextTick()
    const container = windowRef.value
    if (container) {
      container.scrollTop = container.scrollHeight
    }

    // If the challenge is a tutorial, check if the player has coded enough.
    if (challenge?.challengeType === 'tutorial' && amountCoded.value >= sourceCode.length) {
      onChallengeComplete()
    }
  }

  function setupKeyboardHandling(windowRef: Ref<WindowRef | null>): void {
    const windowIsInfocus = useWindowFocus()
    onKeyStroke((e) => {
      // Handle generic text input (any single character key) during coding state
      if (currentState.value === codingStateValue && windowIsInfocus.value && e.key.length === 1) {
        void input(windowRef)
      }
    })
  }

  return {
    codePoints,
    amountCoded,
    displayedCodeRows,
    input,
    setupKeyboardHandling,
  }
}
