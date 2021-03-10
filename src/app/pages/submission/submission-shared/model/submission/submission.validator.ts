import { Table, Field, Section, Submission } from './submission.model';
import { parseDate } from 'app/utils';
import { TableType, SectionType, TextValueType, ValueType, ValueTypeName } from '../templates';

interface ValidationRule {
  validate(): string | undefined;
}

class ValidationRules {
  static atLeastOneTableFromGroup(group: string[], section: Section): ValidationRule {
    return {
      validate(): string | undefined {
        const rowCount = section.tables
          .list()
          .filter((f) => group.includes(f.typeName))
          .map((f) => f.rowSize())
          .reduce((rv, v) => rv + v, 0);
        if (rowCount === 0) {
          return `At least one ${group.join(' or ')} is required`;
        }
        return undefined;
      }
    };
  }

  static atLeastOneRowTable(table: Table): ValidationRule {
    return {
      validate(): string | undefined {
        if (table.rowSize() === 0) {
          return `At least one of ${table.typeName} is required`;
        }
        return undefined;
      }
    };
  }

  static forTable(table: Table): ValidationRule[] {
    const rules: ValidationRule[] = [];

    if (table.type.displayType.isRequired) {
      rules.push(ValidationRules.atLeastOneRowTable(table));
    }

    const valueRules: ValidationRule[] = [];
    table.columns.forEach((col, colIndex) => {
      rules.push(ValidationRules.requiredValue(col.name, `${table.type.name}: (col ${colIndex}):`));

      table.rows.forEach((row, rowIndex) => {
        const rowColumnRef = row.valueFor(col.id);
        const rowValue = rowColumnRef ? rowColumnRef.value : '';
        const rowName = `'${col.name}' for '${table.type.name}' in row ${rowIndex + 1}`;

        if (table.type.displayType.isRequired && col.displayType.isRequired) {
          valueRules.push(ValidationRules.requiredValue(rowValue, rowName));
        }

        valueRules.push(ValidationRules.formattedValue(rowValue, col.valueType, rowName));
      });
    });

    return rules.concat(valueRules);
  }

  static forField(field: Field): ValidationRule[] {
    const value: string = field.value as string;

    return [
      ValidationRules.requiredValue(value, field.name, field.type.displayType.isRequired),
      ValidationRules.formattedValue(value, field.valueType, field.name),
      ...ValidationRules.forValue(value, field.name, field.valueType)
    ];
  }

  static formattedValue(value: string, valueType: ValueType, name: string): ValidationRule {
    return {
      validate(): string | undefined {
        if (ValidationRules.isEmpty(value)) {
          return undefined;
        }
        if (valueType.is(ValueTypeName.date) && parseDate(value) === undefined) {
          return `'${name}' has an invalid format`;
        }
        return undefined;
      }
    };
  }

  static forSection(section: Section): ValidationRule[] {
    let rules: ValidationRule[] = [];

    rules = rules.concat(
      section.fields
        .list()
        .map((field) => ValidationRules.forField(field))
        .reduce((rv, v) => rv.concat(v), [])
    );

    rules = rules.concat(ValidationRules.forTable(section.annotations));

    rules = rules.concat(
      section.tables
        .list()
        .map((table) => ValidationRules.forTable(table))
        .reduce((rv, v) => rv.concat(v), [])
    );

    rules = rules.concat(
      section.type.tableTypes
        .filter((ft) => ft.displayType.isRequired)
        .map((ft) => ValidationRules.requiredTable(ft, section))
    );

    rules = rules.concat(
      section.type.sectionTypes
        .filter((st) => st.displayType.isRequired)
        .map((st) => ValidationRules.requiredSection(st, section))
    );

    rules = rules.concat(section.type.tableGroups.map((gr) => ValidationRules.atLeastOneTableFromGroup(gr, section)));
    return rules;
  }

  static forValue(value: string, fieldName: string, valueType: ValueType): ValidationRule[] {
    const rules: ValidationRule[] = [];
    if (valueType.is(ValueTypeName.text, ValueTypeName.largetext)) {
      rules.push(ValidationRules.maxlengthValue(value, (valueType as TextValueType).maxlength, fieldName));
      rules.push(ValidationRules.minlengthValue(value, (valueType as TextValueType).minlength, fieldName));
    }
    return rules;
  }

  static maxlengthValue(value: string, maxlength: number, name: string): ValidationRule {
    return {
      validate(): string | undefined {
        if (ValidationRules.isEmpty(value)) {
          return undefined;
        }
        if (maxlength > 0 && value.trim().length > maxlength) {
          return `'${name}' should be less than ${maxlength} characters`;
        }
        return undefined;
      }
    };
  }

  static minlengthValue(value: string, minlength: number, name: string): ValidationRule {
    return {
      validate(): string | undefined {
        if (ValidationRules.isEmpty(value)) {
          return undefined;
        }
        if (minlength > 0 && value.trim().length < minlength) {
          return `'${name}' should be at least ${minlength} characters`;
        }
        return undefined;
      }
    };
  }

  static requiredTable(ft: TableType, section: Section): ValidationRule {
    return {
      validate(): string | undefined {
        const tables = section.tables.list().filter((f) => f.type.name === ft.name);
        if (tables.length === 0) {
          return `At least one of ${ft.name} is required in the section`;
        }
        return undefined;
      }
    };
  }

  static requiredSection(st: SectionType, section: Section): ValidationRule {
    return {
      validate(): string | undefined {
        const sections = section.sections.list().filter((f) => f.type.name === st.name);
        if (sections.length === 0) {
          return `At least one subsection of ${st.name} is required`;
        }
        return undefined;
      }
    };
  }

  static requiredValue(value: string, name: string, isRequired: boolean = true): ValidationRule {
    return {
      validate(): string | undefined {
        if (isRequired && ValidationRules.isEmpty(value)) {
          return `${name} is required`;
        }
        return undefined;
      }
    };
  }

  private static isEmpty(value: string | string[]): boolean {
    if (Array.isArray(value)) {
      return value.length === 0;
    }

    return value === undefined || value.trim().length === 0;
  }
}

export class SubmValidationErrors {
  static EMPTY = new SubmValidationErrors('');

  constructor(readonly secId: string, readonly errors: string[] = [], readonly sections: SubmValidationErrors[] = []) {}

  empty(): boolean {
    return this.errors.length === 0 && this.sections.length === 0;
  }

  total(): number {
    return this.errors.length + this.sections.reduce((rv, ve) => rv + ve.total(), 0);
  }
}

export class SubmissionValidator {
  static validate(subm: Submission): SubmValidationErrors {
    return this.validateSection(subm.section);
  }

  private static validateSection(section: Section): SubmValidationErrors {
    const errors = ValidationRules.forSection(section)
      .map((vr) => vr.validate())
      .filter((m) => m !== undefined) as string[];
    const sections = section.sections
      .list()
      .map((s) => SubmissionValidator.validateSection(s))
      .filter((ve) => !ve.empty());

    return new SubmValidationErrors(section.id, errors, sections);
  }
}
