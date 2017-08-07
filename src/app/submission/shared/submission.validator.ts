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

        rules.concat(
            section.features.list()
                .map(feature => ValidationRules.forFeature(feature))
                .reduce((rv, v) => rv.concat(v), [])
        );

        rules.concat(
            section.sections.list()
                .map(sec => ValidationRules.forSection(sec))
                .reduce((rv, v) => rv.concat(v), [])
        );
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
        return [];
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

export class SubmissionValidator {

    constructor(private subm: Submission) {
    }

    validate(): string[] {
        return ValidationRules.forSection(this.subm.root)
            .map(vr => vr.validate())
            .filter(err => err !== undefined);
    }

    cancel(): void {
        // do we need this at all?
    }

    createObservable(): Observable<string[]> {
        return Observable.create((observer) => {
            observer.next(this.validate());
            observer.complete();

            return () => {
                this.cancel();
            };
        });
    }
}
