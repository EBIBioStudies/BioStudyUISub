import { isOrcidValid } from './orcid.utils';

describe('orcid.utils', () => {
  const validOrcidWithXChecksum = '0000-0003-0850-250X';
  const validOrcidWithIntChecksum = '0000-0002-6663-9734';
  const invalidOrcid = '0000-0003-0850-250-320';

  describe('isOrcidValid method', () => {
    test('should return true if ORCID carrying a X checksum is valid', () => {
      expect(isOrcidValid(validOrcidWithXChecksum)).toBeTruthy();
    });

    test('should return true if ORCID carrying a integer checksum is valid', () => {
      expect(isOrcidValid(validOrcidWithIntChecksum)).toBeTruthy();
    });

    test('should return false if ORCID is invalid', () => {
      expect(isOrcidValid(invalidOrcid)).toBeFalsy();
    });

    test('should return false if ORCID is empty', () => {
      expect(isOrcidValid('')).toBeFalsy();
    });
  });
});
