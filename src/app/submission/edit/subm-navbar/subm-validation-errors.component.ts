import {
    Component
} from '@angular/core';

import {BsModalRef} from 'ngx-bootstrap/modal/modal-options.class';
import {SubmValidationErrors} from '../../shared/submission.validator';

@Component({
    selector: 'subm-validation-errors',
    templateUrl: './subm-validation-errors.component.html'
})
export class SubmValidationErrorsModalComponent {
    errors: SubmValidationErrors = SubmValidationErrors.EMPTY;

    constructor(public bsModalRef: BsModalRef) {
    }

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
}
