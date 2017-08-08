import {
    Component
} from '@angular/core';

import {BsModalRef} from 'ngx-bootstrap/modal/modal-options.class';

@Component({
    selector: 'subm-validation-errors',
    templateUrl: './subm-validation-errors.component.html'
})
export class SubmValidationErrorsComponent {
    errors: string[] = [];
    constructor(public bsModalRef: BsModalRef) {}
}
