export function isStringEmpty(value: string | undefined | null): boolean {
  return value !== undefined && value !== null && value.trim().length === 0;
}

export function isStringDefined(value: string | undefined | null): boolean {
  return typeof value !== 'undefined' && value !== undefined && value !== 'undefined' && value !== null;
}

export function isDefinedAndNotEmpty(value: string | undefined | null): boolean {
  return isStringDefined(value) && !isStringEmpty(value);
}

export function isNotDefinedOrEmpty(value: string | undefined | null): boolean {
  return !isDefinedAndNotEmpty(value);
}

export function isEqualIgnoringCase(firstValue: string, secondValue: string): boolean {
  return firstValue.toLowerCase() === secondValue.toLowerCase();
}

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
