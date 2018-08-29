import {
    Component,
    Input
} from '@angular/core';

import {SubmValidationErrors} from '../../shared/submission.validator';
import {BsModalRef} from 'ngx-bootstrap';

@Component({
    selector: 'subm-validation-errors',
    templateUrl: './subm-validation-errors.component.html',
    styleUrls:['./subm-validation-errors.component.css']
})
export class SubmValidationErrorsComponent {
    @Input() errors: SubmValidationErrors = SubmValidationErrors.EMPTY;
    @Input() modalRef?: BsModalRef;

    get errorList(): { level: number[], message: string }[] {
        const collect = (level: number, errors: SubmValidationErrors): { level: number[], message: string }[] => {
            const list =
                errors.errors.map(er => ({
                    level: Array(level).fill(0),
                    message: `(${errors.secId}) ${er}`
                }));

            return list.concat(
                errors.sections.map(sve => collect(level + 1, sve))
                    .reduce((rv, lst) => rv.concat(lst), [])
            );
        };
        return collect(0, this.errors);
    }

    /**
     * Formats the error log as a URI string.
     * @returns {string} Serialised contents of the log.
     */
    toLogURI(): string {
        return encodeURIComponent(JSON.stringify(this.errors));
    }
}
