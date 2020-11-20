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
