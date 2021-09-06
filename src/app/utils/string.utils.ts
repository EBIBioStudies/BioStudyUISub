/**
 * Replaces all the {n} characters in the string for the given arguments.
 *
 * Example:
 *  stringToFormat = 'This is a {1} message'
 *  args = ['hello world']
 *
 *  result = 'This is a hello world message'
 */
export function formatString(stringToFormat, ...args): string {
  return stringToFormat.replace(/{(\d+)}/g, (match, index) =>
    typeof args[index] !== 'undefined' ? args[index] : match
  );
}
