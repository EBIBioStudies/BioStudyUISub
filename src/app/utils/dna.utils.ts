export function isDnaSequenceValid(dnaSequence: string): boolean {
  const dnaAlphabetRegex: RegExp = /^[CAGTcagt ]+$/;

  return dnaAlphabetRegex.test(dnaSequence);
}
