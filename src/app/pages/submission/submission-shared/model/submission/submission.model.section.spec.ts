import { Section } from './submission.model';
import { FeatureType, FieldType, invalidateGlobalScope, SectionType } from '../templates';

describe('Submission Model: Section', () => {
  beforeEach(() => {
    invalidateGlobalScope();
  });

  it('can be empty', () => {
    const sec = new Section(SectionType.createDefault('MySectionType'));
    expect(sec.type.name).toBe('MySectionType');
    expect(sec.typeName).toBe('MySectionType');
    expect(sec.accno).toBe('');
    expect(sec.annotations.isEmpty).toBeTruthy();
    expect(sec.fields.length).toBe(0);
    expect(sec.features.length).toBe(0);
    expect(sec.sections.length).toBe(0);
  });

  it('auto creates all fields declared in the type', () => {
    const type = new SectionType('ASectionType', {
      fieldTypes: [
        {
          name: 'Field1'
        } as FieldType,
        {
          name: 'Field2'
        } as FieldType
      ]
    });
    const sec = new Section(type);
    expect(sec.typeName).toBe('ASectionType');
    expect(sec.fields.length).toBe(2);
  });

  it('auto creates all features declared in the type', () => {
    const type = new SectionType('ASectionType', {
      featureTypes: [
        {
          name: 'Feature1',
          display: 'required'
        } as FeatureType,
        {
          name: 'Feature2',
          display: 'required'
        } as FeatureType
      ]
    });
    const sec = new Section(type);
    expect(sec.typeName).toBe('ASectionType');
    expect(sec.features.length).toBe(2);
  });

  it('auto creates required-only sections declared in the type', () => {
    const type = new SectionType('MySectionType', {
      sectionTypes: [
        {
          name: 'Section1',
          display: 'required'
        } as SectionType,
        {
          name: 'Feature2',
          display: 'optional'
        } as SectionType
      ]
    });
    const sec = new Section(type);
    expect(sec.typeName).toBe('MySectionType');
    expect(sec.sections.length).toBe(1);
  });

  it('should not be possible to add two features of the same type', () => {
    const sec = new Section(new SectionType('MySectionType'));
    const ftype = sec.type.getFeatureType('MyFeatureType');
    sec.features.add(ftype);
    sec.features.add(ftype);
    expect(sec.features.length).toBe(1);
  });

  it('should not be possible to rename featureType on already existed one', () => {
    const sec = new Section(new SectionType('MySectionType'));
    const ftype1 = sec.type.getFeatureType('MyFeatureType1');
    const ftype2 = sec.type.getFeatureType('MyFeatureType2');
    sec.features.add(ftype1);
    sec.features.add(ftype2);
    expect(sec.features.length).toBe(2);

    const f = sec.features.list()[0];
    f.typeName = 'MyFeatureType2';
    expect(f.typeName).toBe('MyFeatureType1');
  });
});
