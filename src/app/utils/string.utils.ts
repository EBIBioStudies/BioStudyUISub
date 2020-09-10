export function isEmpty(value: string | undefined | null): boolean {
  return value !== undefined && value !== null && value.trim().length === 0;
}

export function isDefined(value: string | undefined | null): boolean {
  return typeof value !== 'undefined' && value !== null;
}

export function isDefinedAndNotEmpty(value: string | undefined | null): boolean {
  return isDefined(value) && !isEmpty(value);
}

export function isNotDefinedOrEmpty(value: string | undefined | null): boolean {
  return !isDefinedAndNotEmpty(value);
}
