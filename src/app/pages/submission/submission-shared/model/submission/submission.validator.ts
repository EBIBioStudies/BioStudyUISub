import { Feature, Field, Section, Submission } from './submission.model';
import { parseDate } from 'app/utils';
import { FeatureType, SectionType, TextValueType, ValueType, ValueTypeName } from '../templates';

interface ValidationRule {
  validate(): string | undefined;
}

class ValidationRules {
  static atLeastOneFeatureFromGroup(group: string[], section: Section) {
    return {
      validate() {
        const rowCount = section.features.list()
          .filter(f => group.includes(f.typeName))
          .map(f => f.rowSize())
          .reduce((rv, v) => rv + v, 0);
        if (rowCount === 0) {
          return `At least one ${group.join(' or ')} is required`;
        }
        return undefined;
      }
    };
  }

  static atLeastOneRowFeature(feature: Feature): ValidationRule {
    return {
      validate() {
        if (feature.rowSize() === 0) {
          return `At least one of ${feature.typeName} is required`;
        }
        return undefined;
      }
    };
  }

  static forFeature(feature: Feature): ValidationRule[] {
    const rules: ValidationRule[] = [];

    if (feature.type.displayType.isRequired) {
      rules.push(ValidationRules.atLeastOneRowFeature(feature));
    }

    const valueRules: ValidationRule[] = [];
    feature.columns.forEach((col, colIndex) => {
      rules.push(ValidationRules.requiredValue(col.name, `${feature.type.name}: (col ${colIndex}):`));

      feature.rows.forEach((row, rowIndex) => {
        const rowValue = row.valueFor(col.id)!.value;
        const rowName = `'${col.name}' for '${feature.type.name}' in row ${rowIndex + 1}`;

        if (feature.type.displayType.isRequired && col.displayType.isRequired) {
          valueRules.push(ValidationRules.requiredValue(rowValue, rowName));
        }

        valueRules.push(ValidationRules.formattedValue(rowValue, col.valueType, rowName));
      });
    });

    return rules.concat(valueRules);
  }

  static forField(field: Field): ValidationRule[] {
    const value = field.value;
    return [
      ValidationRules.requiredValue(value, field.name, field.type.displayType.isRequired),
      ValidationRules.formattedValue(value, field.valueType, field.name),
      ...ValidationRules.forValue(field.value, field.name, field.valueType)
    ];
  }

  static formattedValue(value: string, valueType: ValueType, name: string): ValidationRule {
    return {
      validate() {
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
      section.fields.list()
        .map(field => ValidationRules.forField(field))
        .reduce((rv, v) => rv.concat(v), [])
    );

    rules = rules.concat(
      ValidationRules.forFeature(section.annotations)
    );

    rules = rules.concat(
      section.features.list()
        .map(feature => ValidationRules.forFeature(feature))
        .reduce((rv, v) => rv.concat(v), [])
    );

    rules = rules.concat(
      section.type.featureTypes
        .filter(ft => ft.displayType.isRequired)
        .map(ft => ValidationRules.requiredFeature(ft, section))
    );

    rules = rules.concat(
      section.type.sectionTypes
        .filter(st => st.displayType.isRequired)
        .map(st => ValidationRules.requiredSection(st, section))
    );

    rules = rules.concat(
      section.type.featureGroups.map(gr => ValidationRules.atLeastOneFeatureFromGroup(gr, section))
    );
    return rules;
  }

  static forValue(value: string, fieldName: string, valueType: ValueType): ValidationRule[] {
    const rules: ValidationRule[] = [];
    if (valueType.is(ValueTypeName.text, ValueTypeName.largetext)) {
      rules.push(ValidationRules.maxlengthValue(value, (<TextValueType>valueType).maxlength, fieldName));
      rules.push(ValidationRules.minlengthValue(value, (<TextValueType>valueType).minlength, fieldName));
    }
    return rules;
  }

  static maxlengthValue(value: string, maxlength: number, name: string): ValidationRule {
    return {
      validate() {
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
      validate() {
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

  static requiredFeature(ft: FeatureType, section: Section): ValidationRule {
    return {
      validate() {
        const features = section.features.list().filter(f => f.type.name === ft.name);
        if (features.length === 0) {
          return `At least one of ${ft.name} is required in the section`;
        }
        return undefined;
      }
    };
  }

  static requiredSection(st: SectionType, section: Section): ValidationRule {
    return {
      validate() {
        const sections = section.sections.list().filter(f => f.type.name === st.name);
        if (sections.length === 0) {
          return `At least one subsection of ${st.name} is required`;
        }
        return undefined;
      }
    };
  }

  static requiredValue(value: string, name: string, isRequired: boolean = true): ValidationRule {
    return {
      validate() {
        if (isRequired && ValidationRules.isEmpty(value)) {
          return `${name} is required`;
        }
        return undefined;
      }
    };
  }

  private static isEmpty(value: string) {
    return value === undefined || value.trim().length === 0;
  }
}

export class SubmValidationErrors {
  static EMPTY = new SubmValidationErrors('');

  constructor(readonly secId: string,
        readonly errors: string [] = [],
        readonly sections: SubmValidationErrors[] = []) {
  }

  empty(): boolean {
    return this.errors.length === 0 && this.sections.length === 0;
  }

  total(): number {
    return this.errors.length + this.sections.reduce((rv, ve) => (rv + ve.total()), 0);
  }
}

export class SubmissionValidator {
  static validate(subm: Submission): SubmValidationErrors {
    return this.validateSection(subm.section);
  }

  private static validateSection(section: Section): SubmValidationErrors {
    const errors = ValidationRules.forSection(section)
      .map(vr => vr.validate())
      .filter(m => m !== undefined) as string[];
    const sections = section.sections.list()
      .map(s => SubmissionValidator.validateSection(s))
      .filter(ve => !ve.empty());

    return new SubmValidationErrors(section.id, errors, sections);
  }
}
