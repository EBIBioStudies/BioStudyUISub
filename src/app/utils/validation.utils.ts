import { PtNameAndValue } from 'app/submission/submission-shared/model';

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

export function isArrayEmpty(array: any[]): boolean {
  return array.length === 0;
}

export function isValueEmpty(value: string[] | string | undefined): boolean {
  if (Array.isArray(value)) {
    return isArrayEmpty(value);
  }

  return !isDefinedAndNotEmpty(value);
}

export function isPtAttributeValueEmpty(
  value: string | string[] | PtNameAndValue | PtNameAndValue[] | undefined
): boolean {
  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }

  return isValueEmpty(value);
}
