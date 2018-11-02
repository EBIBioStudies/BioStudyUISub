import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {Router} from '@angular/router';

import {newPageTab, Section, SUBMISSION_TEMPLATE_NAMES} from '../../shared/model';
import {SubmissionService} from '../../shared/submission.service';
import {SubmAddDialogComponent} from '../../list/subm-add.component';
import {UserData} from '../../../auth/user-data';
import {SectionForm} from '../section-form';

@Component({
    selector: 'subm-navbar',
    templateUrl: './subm-navbar.component.html',
    styleUrls: ['./subm-navbar.component.css']
})
export class SubmNavBarComponent implements OnChanges {
    isBusy: boolean = false;            //flag indicating if a request is in progress
    allowedPrj?: string[];               //names of projects with templates the user is allowed to attach submissions to

    @Input() sectionForm?: SectionForm;
    @Input() accno?: string;             //accession number for the current submission
    @Input() readonly: boolean = false;         //read-only status of the submission form
    @Output() sectionClick: EventEmitter<Section> = new EventEmitter<Section>();
    @Output() revertClick: EventEmitter<Event> = new EventEmitter<Event>();
    @Output() submitClick: EventEmitter<Event> = new EventEmitter<Event>();
    @Output() editClick: EventEmitter<Event> = new EventEmitter<Event>();

    @ViewChild('addDialog')
    addDialog?: SubmAddDialogComponent;

    sectionPath: SectionForm[] = [];

    constructor(private submService: SubmissionService,
                private userData: UserData,
                private locService: Location,
                private router: Router) {

        //Works out the list of allowed projects by comparison with template names
        this.isBusy = true;
        this.userData.filteredProjectAccNumbers$(SUBMISSION_TEMPLATE_NAMES).subscribe(projects => {
            this.isBusy = false;
            this.allowedPrj = projects;
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.sectionForm !== null) {
            this.sectionPath = this.findSectionPath(this.sectionForm);
        }
    }

    onSectionClick(section: Section): void {
        this.sectionClick.next(section);
    }

    onRevert(event: Event): void {
        this.revertClick.next(event);
    }

    onSubmit(event: Event): void {
        this.submitClick.next(event);
    }

    onEdit(event: Event): void {
        this.editClick.next(event)
    }

    /**
     * Renders the new submission dialogue that allows the user to choose what type definitions template is used.
     * If only one template is available, the modal is bypassed altogether and a default submission is created.
     * NOTE: The default template will always be available.
     * @see {@link UserData.filteredProjectAccNumbers$}
     * @param {Event} event - Click event object, the bubbling of which will be prevented
     */
    onNewSubmClick(event: Event): void {
        event.preventDefault();

        if (this.allowedPrj!.length > 1) {
            this.addDialog!.show();
        } else {
            this.createSubmission('');
        }
    }

    /**
     * Creates a new submission using PageTab's data structure and brings up a form to edit it.
     * @param {string} tmplId - ID for the type definitions template to be used for the submission.
     * TODO: at present, the app relies on the backend to generate a ready instance of a submission. This leads to two requests for every new submission, one to create it and another to retrieve it for the edit view.
     */
    createSubmission(tmplId: string) {
        this.submService.createSubmission(newPageTab(tmplId)).subscribe((subm) => {
            this.router.navigate(['/submissions/new/', subm.accno]);
        });
    };

    //TODO: a temporary workaround
    get isTemp(): boolean {
        return this.accno!.startsWith('TMP_');
    }

    //TODO: a temporary workaround
    get isRevised(): boolean {
        return true;
    }

    private findSectionPath(sectionForm?: SectionForm): SectionForm[] {
        if (sectionForm === undefined) {
            return [];
        }
        return [...this.findSectionPath(sectionForm.parent), ...[sectionForm]];
    }
}
