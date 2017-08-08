import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/modal-options.class';
import {
    Section
} from '../../shared/submission.model';
import {SubmValidationErrorsComponent} from './subm-validation-errors.component';

@Component({
    selector: 'subm-navbar',
    templateUrl: './subm-navbar.component.html',
    host: {'class': 'navbar-subm-fixed navbar-default'}
})
export class SubmNavBarComponent {
    @Input() accno: string;
    @Input() errors: string[];
    @Input() sectionPath: Section[];

    @Output() sectionClick: EventEmitter<Section> = new EventEmitter<Section>();

    private bsModalRef: BsModalRef;

    constructor(private modalService: BsModalService) {
    }

    onSectionClick(ev: Section): void {
        this.sectionClick.next(ev);
    }

    onErrorsLabelClick(ev): void {
        this.bsModalRef = this.modalService.show(SubmValidationErrorsComponent);
        this.bsModalRef.content.errors = this.errors;
    }
}
