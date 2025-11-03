import { nextTick, ref, type Ref } from 'vue'
import { onKeyStroke, useWindowFocus } from '@vueuse/core'
import { useGameStateStore } from '@/stores/gameStateStore'

export type CodeQuality = 'mundane' | 'efficient' | 'creative' | 'perfect'

export interface CodeCharacter {
  char: string
  timestamp: number
  isNew: boolean
  quality: CodeQuality
}

export interface CodeLine {
  lineNumber: number
  characters: CodeCharacter[]
}

export interface FloatingPoint {
  id: number
  points: number
  quality: CodeQuality
  lineIndex: number
  charIndex: number
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
  floatingPoints: Ref<FloatingPoint[]>
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
  const floatingPoints = ref<FloatingPoint[]>([])

  let sourceCodeCursorPosition = initialCursorPosition
  let floatingPointId = 0

  // eslint-disable-next-line complexity -- word detection and quality logic adds complexity
  function checkWordCompletion(newCode: string, timestamp: number): void {
    // Check if the new code contains a space (word completion)
    if (!newCode.includes(' ')) return

    // Find the completed word by working backwards from the space
    const lastRow = displayedCodeRows.value[displayedCodeRows.value.length - 1]
    let wordEndIndex = -1

    // Find the space character we just added
    for (let i = lastRow.characters.length - 1; i >= 0; i--) {
      if (lastRow.characters[i]?.timestamp === timestamp && lastRow.characters[i]?.char === ' ') {
        wordEndIndex = i
        break
      }
    }

    if (wordEndIndex === -1) return

    // Work backwards to find word start (previous space or line start)
    let wordStartIndex = 0
    for (let i = wordEndIndex - 1; i >= 0; i--) {
      if (lastRow.characters[i]?.char === ' ' || lastRow.characters[i]?.char === '\n') {
        wordStartIndex = i + 1
        break
      }
    }

    // Skip leading whitespace/tabs at word start
    while (wordStartIndex < wordEndIndex && /\s/.test(lastRow.characters[wordStartIndex]?.char ?? '')) {
      wordStartIndex++
    }

    // Roll for creativity and efficiency to determine quality upgrade
    const creativityChance = 0.1 * gameStateStore.profile.codingCreativity
    const efficiencyChance = 0.1 * gameStateStore.profile.codingSkill
    const isCreative = Math.random() < creativityChance
    const isEfficient = Math.random() < efficiencyChance

    // Determine quality based on unlock status
    const hasPerfectCodeUnlock = gameStateStore.profile.unlocks.includes('perfectCode')
    let quality: CodeQuality = 'mundane'

    if (hasPerfectCodeUnlock) {
      // If perfectCode unlocked, check both rolls
      if (isCreative && isEfficient) {
        quality = 'perfect'
      } else if (isCreative) {
        quality = 'creative'
      } else if (isEfficient) {
        quality = 'efficient'
      }
    } else if (isCreative) {
      // If perfectCode not unlocked, creativity takes precedence
      quality = 'creative'
    } else if (isEfficient) {
      quality = 'efficient'
    }

    // Mark all characters in the word with the determined quality
    for (let i = wordStartIndex; i < wordEndIndex; i++) {
      lastRow.characters[i].quality = quality
    }

    // Calculate points for this word
    const wordCharacters = lastRow.characters.slice(wordStartIndex, wordEndIndex)
    const wordPoints = codeToPoints(wordCharacters)

    // Add floating point above the word
    const lineIndex = displayedCodeRows.value.length - 1
    const charIndex = Math.floor((wordStartIndex + wordEndIndex) / 2)
    const id = floatingPointId++

    floatingPoints.value.push({
      id,
      points: wordPoints,
      quality,
      lineIndex,
      charIndex,
    })

    // Remove after animation completes
    setTimeout(() => {
      const index = floatingPoints.value.findIndex((fp) => fp.id === id)
      if (index !== -1) floatingPoints.value.splice(index, 1)
    }, 1000)
  }

  function codeToPoints(characters: CodeCharacter[]): number {
    let points = 0

    // Add points for each non-whitespace, non-line-break character.
    for (const char of characters) {
      if (char.char !== ' ' && char.char !== '\n') {
        switch (char.quality) {
          case 'efficient':
            points += 5
            break
          case 'creative':
            points += 2
            break
          case 'perfect':
            points += 10
            break
          default:
            points += 1
        }
      }
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
      quality: 'mundane' as CodeQuality,
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
        quality: 'mundane' as CodeQuality,
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

    // Check for word completion and efficiency rolls
    checkWordCompletion(newCode, timestamp)

    // Collect all newly added characters for point calculation
    const newChars: CodeCharacter[] = []
    for (const row of displayedCodeRows.value) {
      for (const char of row.characters) {
        if (char.timestamp === timestamp) {
          newChars.push(char)
        }
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

    codePoints.value += codeToPoints(newChars)

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
    floatingPoints,
    input,
    setupKeyboardHandling,
  }
}
