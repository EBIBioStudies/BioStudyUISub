export function isProteinSequenceValid(proteinSequence: string): boolean {
  const proteinAlphabetRegex: RegExp = /^[ARNDCQEGHILKMFPSTWYVarndcqeghilkmfpstwyv ]+$/;

  return proteinAlphabetRegex.test(proteinSequence);
}
