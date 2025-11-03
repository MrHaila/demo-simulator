/**
 * Converts a string to snake_case format
 * @param str - The input string to convert
 * @returns The snake_case version of the string
 */
export function toSnakeCase(str: string): string {
  return str
    .replace(/[\s\W-]+/g, '_') // Replace spaces, non-word chars, and hyphens with underscores
    .replace(/([a-z])([A-Z])/g, '$1_$2') // Insert underscore between camelCase
    .replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '') // Remove leading/trailing non-alphanumeric chars
    .toLowerCase()
}
