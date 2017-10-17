import {
    Feature,
    Field,
    Section,
    Submission
} from './submission.model';
import {Observable} from 'rxjs/Observable';
import {parseDate} from '../../submission-shared/date.utils';
import {
    FeatureType,
    SectionType
} from './submission-type.model';

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
            ValidationRules.maxlengthValue(value, field.type.maxlength, field.name),
            ValidationRules.minlengthValue(value, field.type.minlength, field.name)
        ];
    }

    static forFeature(feature: Feature): ValidationRule[] {
        const rules: ValidationRule[] = [];
        if (feature.type.required) {
            rules.push(ValidationRules.atLeastOneRowFeature(feature))
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

    private static validateSection(section: Section): SubmValidationErrors {
        const errors = ValidationRules.forSection(section)
            .map(vr => vr.validate())
            .filter(m => m !== undefined);
        const sections = section.sections.list()
            .map(s => SubmissionValidator.validateSection(s))
            .filter(ve => !ve.empty());
        return new SubmValidationErrors(section.id, errors, sections);
    }

    static validate(subm: Submission): SubmValidationErrors {
        return this.validateSection(subm.root);
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
