import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import {Router} from "@angular/router";
import {BsModalService} from "ngx-bootstrap/modal";

import {Section} from '../../shared/submission.model';
import {SubmValidationErrorsComponent} from './subm-validation-errors.component';
import {SubmValidationErrors} from '../../shared/submission.validator';
import {SubmissionService} from "../../shared/submission.service";
import {PageTab} from "app/submission/shared/pagetab.model";

@Component({
    selector: 'subm-navbar',
    templateUrl: './subm-navbar.component.html',
    styleUrls: ['./subm-navbar.component.css']
})
export class SubmNavBarComponent {
    @Input() accno: string;
    @Input() readonly: boolean;
    @Input() errors: SubmValidationErrors = SubmValidationErrors.EMPTY;
    @Input() sectionPath: Section[];

    @Output() sectionClick: EventEmitter<Section> = new EventEmitter<Section>();
    @Output() submitClick: EventEmitter<Section> = new EventEmitter<Section>();

    constructor(private modalService: BsModalService,
                private submService: SubmissionService,
                private router: Router) {}

    onSectionClick(ev: Section): void {
        this.sectionClick.next(ev);
    }

    onErrorsLabelClick(ev): void {
        const bsModalRef = this.modalService.show(SubmValidationErrorsComponent);
        bsModalRef.content.errors = this.errors;
    }

    onSubmit(event): void {
        this.submitClick.next(event);
    }

    /**
     * Creates a blank submission using PageTab's data structure and brings up a form to edit it.
     */
    createSubmission() {
        this.submService.createSubmission(PageTab.createNew())
            .subscribe((s) => {
                console.log('created submission:', s); console.log(PageTab.createNew());
                this.router.navigate(['/submissions/new', s.accno]);
            });
    };
}
