import { flatArray } from './array.utils';

describe('array.utils', () => {
  describe('flatArray method', () => {
    test('should return a flat array', () => {
      const nestedArray: Array<number | Array<number>> = [1, [2, 3], 4];

      expect(flatArray(nestedArray)).toEqual([1, 2, 3, 4]);
    });
  });
});
