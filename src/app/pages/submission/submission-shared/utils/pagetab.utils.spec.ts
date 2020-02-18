import { PageTab, PtAttribute } from '../model/pagetab';
import { findAttribute } from './pagetab.utils';

const attributes = [{
  name: 'AttachTo',
  value: 'EU-ToxRisk'
}];

describe('findAttribute method', () => {
  test('should return a list of PtAttributes exact matching the requested attribute name', () => {
    const pageTab: PageTab = { attributes };
    const attributeToFind: string = 'AttachTo';

    expect(findAttribute(pageTab, attributeToFind)).toEqual(attributes);
  });

  test('should return an empty list if no attribute matches the requested attribute name', () => {
    const pageTab: PageTab = { attributes };
    const attributeToFind: string = 'Compound';

    expect(findAttribute(pageTab, attributeToFind)).toHaveLength(0);
  });

  test('should return an empty list if pagetab does not have attributes', () => {
    const pageTab: PageTab = { attributes: [] };
    const attributeToFind: string = 'AnAttribute';

    expect(findAttribute(pageTab, attributeToFind)).toHaveLength(0);
  });

  test('should return an empty list if pagetab does not come with attributes', () => {
    const pageTab: PageTab = {};
    const attributeToFind: string = 'AnAttribute';

    expect(findAttribute(pageTab, attributeToFind)).toHaveLength(0);
  });
});
