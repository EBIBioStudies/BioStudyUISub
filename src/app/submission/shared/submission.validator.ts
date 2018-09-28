import {Feature, Field, Section, Submission} from './submission.model';
import {Observable} from 'rxjs/Observable';
import {parseDate} from '../../submission-shared/date.utils';
import {FeatureType, SectionType, TextValueType, ValueType, ValueTypeName} from './submission-type.model';

interface ValidationRule {
    validate(): string | undefined;
}

class ValidationRules {
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
                .filter(ft => ft.required)
                .map(ft => ValidationRules.requiredFeature(ft, section))
        );

        rules = rules.concat(
            section.type.sectionTypes
                .filter(st => st.required)
                .map(st => ValidationRules.requiredSection(st, section))
        );
        return rules;
    }

    static forField(field: Field): ValidationRule[] {
        const value = field.value;
        return [
            ValidationRules.requiredValue(value, field.name, field.type.required),
            ValidationRules.formattedValue(value, field.valueType, field.name),
            ...ValidationRules.forValue(field.value, field.name, field.valueType)
        ];
    }

    static forValue(value: string, fieldName: string, valueType: ValueType): ValidationRule[] {
        const rules:ValidationRule[] = [];
        if (valueType.is(ValueTypeName.text, ValueTypeName.largetext)) {
            rules.push(ValidationRules.maxlengthValue(value, (<TextValueType>valueType).maxlength, fieldName));
            rules.push(ValidationRules.minlengthValue(value, (<TextValueType>valueType).minlength, fieldName));
        }
        return rules;
    }

    static forFeature(feature: Feature): ValidationRule[] {
        const rules: ValidationRule[] = [];
        if (feature.type.required) {
            rules.push(ValidationRules.atLeastOneRowFeature(feature))
        }

        const valueRules: ValidationRule[] = [];
        feature.columns.forEach((col, colIndex) => {
            rules.push(ValidationRules.requiredValue(col.name, `${feature.type.name}: (col ${colIndex}):`));
            feature.rows.forEach((row, rowIndex) => {
                const rowValue = row.valueFor(col.id)!.value;
                const rowName = `${feature.type.name}: (col: ${colIndex}, row: ${rowIndex}):`;

                //If a member field is marked as required but its parent feature is not, the field should be optional
                //NOTE: Features added interactively are optional and fields may be required at the row level (eg: publication rows).
                if (feature.type.required && col.isRequired) {
                    valueRules.push(ValidationRules.requiredValue(rowValue, rowName));
                }
                valueRules.push(ValidationRules.formattedValue(rowValue, col.valueType, rowName));
            });
        });

        return rules.concat(valueRules);
    }

    static atLeastOneRowFeature(feature: Feature): ValidationRule {
        return {
            validate() {
                if (feature.rowSize() === 0) {
                    return `At least one of ${feature.type.name} is required`;
                }
                return undefined;
            }
        }
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
        }
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
        }
    }

    static requiredValue(value: string, name: string, isRequired: boolean = true): ValidationRule {
        return {
            validate() {
                if (isRequired && ValidationRules.isEmpty(value)) {
                    return `'${name}' value is required`;
                }
                return undefined;
            }
        }
    }

    //TODO: this method is a sign that the whole validator should disappear. It has to know dynamic details beyond the field types in advance (eg: date's format, ORCID's format). This should remain implicit in the type. Also a problem when dynamic server-side validation exists.
    static formattedValue(value: string, valueType: ValueType, name: string): ValidationRule {
        return {
            validate() {
                if (ValidationRules.isEmpty(value)) {
                    return undefined;
                }
                if (valueType.is(ValueTypeName.date) && parseDate(value) === undefined) {
                    return `'${name}' has an invalid format`;
                }
                if (valueType.is(ValueTypeName.orcid) && !/^\d{4}-\d{4}-\d{4}-\d{4}$/.test(value)) {
                    return `'${name}' has an invalid format`;
                }
                return undefined;
            }
        }
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
        }
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
        }
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

    private static validateSection(section: Section): SubmValidationErrors {
        const errors = ValidationRules.forSection(section)
            .map(vr => vr.validate())
            .filter(m => m !== undefined) as string[];
        const sections = section.sections.list()
            .map(s => SubmissionValidator.validateSection(s))
            .filter(ve => !ve.empty());
        return new SubmValidationErrors(section.id, errors, sections);
    }

    static validate(subm: Submission): SubmValidationErrors {
        return this.validateSection(subm.section);
    }

    static createObservable(subm: Submission): Observable<SubmValidationErrors> {
        return Observable.create((observer) => {
            observer.next(SubmissionValidator.validate(subm));
            observer.complete();

            return () => {
            };
        });
    }
}
