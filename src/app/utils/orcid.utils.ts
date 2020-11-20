export function isOrcidValid(orcid): boolean {
  const orcidFormatRegex: RegExp = /\d{4}-\d{4}-\d{4}-\d{3}[\dX]/gi;
  const matches: string[] = orcid.match(orcidFormatRegex);

  if (matches === null) {
    return false;
  }

  const digits: string = orcid.replace(/-/g, '');
  const baseDigits: string[] = digits.slice(0, 15).split('');
  const checkDigit: string = digits.charAt(15);

  const total: number = baseDigits.reduce((parcialTotal, digit) => (parcialTotal + parseInt(digit, 10)) * 2, 0);
  const remainder: number = total % 11;
  const result: number = (12 - remainder) % 11;
  const expectedCheckDigit: string = result === 10 ? 'X' : result.toString();

  return checkDigit === expectedCheckDigit;
}
