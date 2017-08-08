import {Feature, Field, Section, Submission} from './submission.model';
import {Observable} from 'rxjs/Observable';
import {parseDate} from '../../submission-shared/date.utils';

interface ValidationRule {
    validate(): string | undefined;
}

class ValidationRules {
    static forSection(section: Section): ValidationRule[] {
        let rules = [];

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

        // todo check section.type.featureTypes for required
        // todo check section.type.sectionTypes for required
        return rules;
    }

    static forField(field: Field): ValidationRule[] {
        const value = field.value;
        return [
            ValidationRules.requiredValue(value, field.name),
            ValidationRules.formattedValue(value, field.valueType, field.name),
            ValidationRules.maxlengthValue(value, field.type.maxlength, field.name),
            ValidationRules.minlengthValue(value, field.type.minlength, field.name)
        ];
    }

    static forFeature(feature: Feature): ValidationRule[] {
        const rules: ValidationRule[] = [];
        if (feature.type.required) {
            // rules.push(ValidationRules.atLeastOneRowFeature(feature))
        }

        const valueRules = [];
        feature.columns.forEach((col, colIndex) => {
            rules.push(ValidationRules.requiredValue(col.name, `${feature.type.name}: (col ${colIndex}):`));
            feature.rows.forEach((row, rowIndex) => {
                const rowValue = row.valueFor(col.id).value;
                const rowName = `${feature.type.name}: (col: ${colIndex}, row: ${rowIndex}):`;
                if (col.required) {
                    valueRules.push(ValidationRules.requiredValue(rowValue, rowName));
                }
                valueRules.push(ValidationRules.formattedValue(rowValue, col.valueType, rowName));
            });
        });

        return rules.concat(valueRules);
    }

    static requiredValue(value: string, name: string): ValidationRule {
        return {
            validate() {
                if (ValidationRules.isEmpty(value)) {
                    return `'${name}' value is required`;
                }
                return undefined;
            }
        }
    }

    static formattedValue(value: string, valueType: string, name: string): ValidationRule {
        return {
            validate() {
                if (ValidationRules.isEmpty(value)) {
                    return undefined;
                }
                if (valueType === 'date' && parseDate(value) === undefined) {
                    return `'${name}' format is invalid`;
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

    static validate(subm: Submission): SubmValidationErrors {
        return this.validateSection(subm.root);
    }

    static validateSection(section: Section): SubmValidationErrors {
        const errors = ValidationRules.forSection(section)
            .map(vr => vr.validate())
            .filter(m => m !== undefined);
        const sections = section.sections.list()
            .map(s => SubmissionValidator.validateSection(s))
            .filter(ve => !ve.empty());
        return new SubmValidationErrors(section.id, errors, sections);
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
