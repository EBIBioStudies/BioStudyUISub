import { mergeAttributes } from './pagetab-attributes.utils';

describe('Submission Attributes:', () => {
  it('replaces Title attribute and adds AttachTo attribute', () => {
    const attrs1 = [
      { name: 'Title', value: 'a title 1' },
      { name: 'AttachTo', value: 'prj1' }
    ];
    const attrs2 = [
      { name: 'Title', value: 'a title 2' },
      { name: 'AttachTo', value: 'prj2' }
    ];

    const res = mergeAttributes(attrs1, attrs2);

    expect(res).toBeDefined();
    expect(res.length).toEqual(3);
    expect(res).toContainEqual({ name: 'Title', value: 'a title 2' });
    expect(res).toContainEqual({ name: 'AttachTo', value: 'prj1' });
    expect(res).toContainEqual({ name: 'AttachTo', value: 'prj2' });
  });
});
