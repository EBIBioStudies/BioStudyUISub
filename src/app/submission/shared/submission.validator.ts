import {Feature, Field, Section, Submission} from './submission.model';
import {Observable} from 'rxjs/Observable';
import {parseDate} from '../../submission-shared/date.utils';

export class SubmissionValidator {

    constructor(private subm: Submission) {
    }

    validate(): string[] {
        return this.validateSection(this.subm.root);
    }

    cancel(): void {
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

    private validateSection(section: Section): string[] {
        const fieldErrors = section.fields.list()
            .map(field => this.validateField(field))
            .reduce((rv, v) => rv.concat(v), []);

        const annotationErrors = this.validateFeature(section.annotations);

        const featureErrors = section.features.list()
            .map(feature => this.validateFeature(feature))
            .reduce((rv, v) => rv.concat(v), []);

        const sectionErrors = section.sections.list()
            .map(sec => this.validateSection(sec))
            .reduce((rv, v) => rv.concat(v), []);

        return [].concat(fieldErrors, annotationErrors, featureErrors, sectionErrors);
    }

    private validateField(field: Field): string[] {
        const errors = [];
        const value = field.value;
        if (!this.isValueEmpty(value)) {
            errors.push(`Value for the ${field.name} is required`);
        }
        if (!this.isFormatValid(value, field.valueType)) {
            errors.push(`Value format for the ${field.name} is invalid`);
        }
        return errors;
    }

    private validateFeature(feature: Feature): string[] {
        return [];
    }

    private isValueEmpty(val: string): boolean {
       return (val !== undefined) && (val.trim().length > 0);
    }

    private isFormatValid(val: string, valueType: string) {
        if (val === undefined || val.trim().length === 0) {
            return true;
        }
        if (valueType === 'date') {
            return parseDate(val) !== undefined;
        }
        return true;
    }
}
