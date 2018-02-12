import {
    Component,
    Input,
    Output,
    EventEmitter, ViewChild
} from '@angular/core';
import {Router} from "@angular/router";

import {Section} from '../../shared/submission.model';
import {SubmissionService} from "../../shared/submission.service";
import {PageTab} from "app/submission/shared/pagetab.model";
import {ConfirmDialogComponent} from "../../../shared/confirm-dialog.component";
import {Observable} from "rxjs/Observable";
import {SubmAddDialogComponent} from "../../list/subm-add.component";

@Component({
    selector: 'subm-navbar',
    templateUrl: './subm-navbar.component.html',
    styleUrls: ['./subm-navbar.component.css']
})
export class SubmNavBarComponent {
    @Input() accno: string;
    @Input() readonly: boolean;
    @Input() isTemp: boolean;
    @Input() sectionPath: Section[];
    @Input() isRevised: boolean;
    @Output() sectionClick: EventEmitter<Section> = new EventEmitter<Section>();
    @Output() revertClick: EventEmitter<Event> = new EventEmitter<Event>();
    @Output() submitClick: EventEmitter<Event> = new EventEmitter<Event>();

    @ViewChild('addDialog')
    addDialog: SubmAddDialogComponent;

    constructor(private submService: SubmissionService,
                private router: Router) {}

    onSectionClick(section: Section): void {
        this.sectionClick.next(section);
    }

    onRevert(event: Event): void {
        this.revertClick.next(event);
    }

    onSubmit(event: Event): void {
        this.submitClick.next(event);
    }

    /**
     * Renders the new submission dialogue that allows the user to choose what type definitions template is used.
     * @param {Event} event - Click event object, the bubbling of which will be prevented
     */
    onNewSubmClick(event: Event): void {
        event.preventDefault();
        this.addDialog.show();
    }

    /**
     * Creates a new submission using PageTab's data structure and brings up a form to edit it.
     * @param {string} tmplId - ID for the type definitions template to be used for the submission.
     * TODO: at present, the app relies on the backend to generate a ready instance of a submission. This leads to two requests for every new submission, one to create it and another to retrieve it for the edit view.
     */
    createSubmission(tmplId: string) {
        this.submService.createSubmission(PageTab.createNew(tmplId)).subscribe((subm) => {
            this.router.navigate(['/submissions/new/', subm.accno]);
        });
    };
}
