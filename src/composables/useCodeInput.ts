import { nextTick, ref, type Ref } from 'vue'
import { onKeyStroke, useWindowFocus } from '@vueuse/core'
import { useGameStateStore } from '@/stores/gameStateStore'

interface CodeLine {
  lineNumber: number
  text: string
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
  scrollToBottom: () => void
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
      text: '',
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

    // Append first new row to the latest displayed row.
    const lastRow = displayedCodeRows.value[displayedCodeRows.value.length - 1]
    lastRow.text += newCodeRows[0]

    // For each subsequent row...
    for (let i = 1; i < newCodeRows.length; i++) {
      // Directly add new rows to the display buffer.
      const currentLastRow = displayedCodeRows.value[displayedCodeRows.value.length - 1]
      displayedCodeRows.value.push({
        lineNumber: currentLastRow.lineNumber + 1,
        text: newCodeRows[i],
      })

      // Trim excess lines.
      if (displayedCodeRows.value.length > 300) {
        displayedCodeRows.value.shift()
      }
    }

    codePoints.value += codeToPoints(newCode)

    // Keep new code visible.
    await nextTick()
    windowRef.value?.scrollToBottom()

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
