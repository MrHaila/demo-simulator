/**
 * Converts duration in milliseconds to a humanized format
 * Examples: "3 min, 45 sec", "1 hr, 2 min, 3 sec", "5 sec"
 */
export function humanizeDuration(milliseconds: number): string {
  if (milliseconds <= 0) return '0 sec'
  
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  
  const remainingMinutes = minutes % 60
  const remainingSeconds = seconds % 60
  
  const parts: string[] = []
  
  if (hours > 0) {
    parts.push(`${hours} hr`)
  }
  
  if (remainingMinutes > 0) {
    parts.push(`${remainingMinutes} min`)
  }
  
  if (remainingSeconds > 0 || parts.length === 0) {
    parts.push(`${remainingSeconds} sec`)
  }
  
  return parts.join(', ')
}
