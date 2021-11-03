import { Section } from './submission.model';
import { TableType, FieldType, invalidateGlobalScope, SectionType } from '../templates';

describe('Submission Model: Section', () => {
  beforeEach(() => {
    invalidateGlobalScope();
  });

  it('can be empty', () => {
    const sec = new Section(SectionType.createDefault('MySectionType'));
    expect(sec.type.name).toBe('MySectionType');
    expect(sec.typeName).toBe('MySectionType');
    expect(sec.accno).toBe('');
    expect(sec.fields.length).toBe(0);
    expect(sec.tables.length).toBe(0);
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

  it('auto creates all tables declared in the type', () => {
    const type = new SectionType('ASectionType', {
      tableTypes: [
        {
          name: 'Table1',
          display: 'required'
        } as TableType,
        {
          name: 'Table2',
          display: 'required'
        } as TableType
      ]
    });
    const sec = new Section(type);
    expect(sec.typeName).toBe('ASectionType');
    expect(sec.tables.length).toBe(2);
  });

  it('auto creates required-only sections declared in the type', () => {
    const type = new SectionType('MySectionType', {
      sectionTypes: [
        {
          name: 'Section1',
          display: 'required'
        } as SectionType,
        {
          name: 'Table2',
          display: 'optional'
        } as SectionType
      ]
    });
    const sec = new Section(type);
    expect(sec.typeName).toBe('MySectionType');
    expect(sec.sections.length).toBe(1);
  });

  it('should not be possible to add two Tables of the same type', () => {
    const sec = new Section(new SectionType('MySectionType'));
    const ftype = sec.type.getTableType('MyTableType');
    sec.tables.add(ftype);
    sec.tables.add(ftype);
    expect(sec.tables.length).toBe(1);
  });

  it('should not be possible to rename tableType on already existed one', () => {
    const sec = new Section(new SectionType('MySectionType'));
    const ftype1 = sec.type.getTableType('MyTableType1');
    const ftype2 = sec.type.getTableType('MyTableType2');
    sec.tables.add(ftype1);
    sec.tables.add(ftype2);
    expect(sec.tables.length).toBe(2);

    const f = sec.tables.list()[0];
    f.typeName = 'MyTableType2';
    expect(f.typeName).toBe('MyTableType1');
  });
});
