import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import {BsModalService} from 'ngx-bootstrap/modal';

import {
    Section
} from '../../shared/submission.model';
import {SubmValidationErrorsModalComponent} from './subm-validation-errors.component';
import {SubmValidationErrors} from '../../shared/submission.validator';

@Component({
    selector: 'subm-navbar',
    templateUrl: './subm-navbar.component.html',
    host: {'class': 'navbar-subm-fixed navbar-default'}
})
export class SubmNavBarComponent {
    @Input() accno: string;
    @Input() errors: SubmValidationErrors = SubmValidationErrors.EMPTY;
    @Input() sectionPath: Section[];

    @Output() sectionClick: EventEmitter<Section> = new EventEmitter<Section>();

    constructor(private modalService: BsModalService) {
    }

    onSectionClick(ev: Section): void {
        this.sectionClick.next(ev);
    }

    onErrorsLabelClick(ev): void {
        const bsModalRef = this.modalService.show(SubmValidationErrorsModalComponent);
        bsModalRef.content.errors = this.errors;
    }
}
