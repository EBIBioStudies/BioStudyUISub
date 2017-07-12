import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild
} from '@angular/core';

import {
    ActivatedRoute,
    Router,
    Params
} from '@angular/router';

import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/switchMap';

import {ModalDirective} from 'ngx-bootstrap/modal/modal.component';

import {
    Submission,
    Section
} from '../shared/submission.model';

import {SubmissionService} from '../shared/submission.service';
import {SubmissionType, SectionType} from '../shared/submission-template.model';
import * as stu from '../shared/submission-template.utils';

@Component({
    selector: 'subm-edit',
    templateUrl: './subm-edit.component.html'
})
export class SubmEditComponent implements OnInit, OnDestroy {
    sideBarCollapsed: boolean = false;
    readonly: boolean = false;

    subm: Submission;
    submType: SubmissionType;

    sectionWithType: [Section, SectionType];

    errors: string[] = [];
    accno: string = '';

    private subscr: Subscription;
    private submitting: boolean = false;

    @ViewChild('submitResults') public submitResults: ModalDirective;

    constructor(private route: ActivatedRoute,
                private submService: SubmissionService,
                private router: Router) {
    }

    ngOnInit() {
        this.route.params
            .map((params: Params) => params['accno'])
            .switchMap(accno => this.submService.getSubmission(accno))
            .subscribe(data => {
                //TODO: convert PageTab into Submission
                this.accno = data.accno;
                this.submType = SubmissionType.createDefault();
                this.subm = stu.createSubmission(this.submType);

                this.changeSection(this.subm.root.id);
            });
    }

    ngOnDestroy() {
        if (this.subscr) {
            this.subscr.unsubscribe();
        }
    }

    get section(): Section {
        return this.sectionWithType === undefined ? undefined : this.sectionWithType[0];
    }

    get sectionPath(): Section[] {
        if (this.subm === undefined || this.section) {
            return [];
        }
        return this.subm.sectionPath(this.section.id);
    }

    loadSubmission(accno: string, section: string): void {
        /*this.route.params.forEach((params: Params) => {
         this.accno = params['accno'];
         this.submService
         .getSubmission(this.accno)
         .subscribe(resp => {
         let wrap = resp;
         let pt = new PageTab(wrap.data);
         this.__wrap = ((w, p) => {
         return function () {
         w.data = p.data;
         return wrap;
         }
         })(wrap, pt);

         this.submission = pt.asSubmission(this.dictService.dict());
         console.debug('SubmEdit: submission loaded ', this.submission);

         this.__subscr = pt.changes().subscribe((changes) => {
         console.debug('SubmEdit: sending changes to the server...');
         this.submService.saveSubmission(this.__wrap())
         .subscribe(resp => {
         console.debug('SubmEdit: all sent');
         });
         });
         });

         });*/
    }


    onSectionClick(section: Section): void {
        this.changeSection(section.id);
    }

    onSubmit(event) {
        if (event) {
            event.preventDefault();
        }

        /* if (!this.canSubmit()) {
         return;
         }

         this.errors = this.submModel.validate(this.submission);
         if (this.errors.length > 0) {
         this.showSubmitResults();
         return;
         }
         this.submService.submitSubmission(this.__wrap())
         .subscribe(
         resp => {
         console.debug("submitted", resp);
         this.showSubmitResults()
         },
         error => {
         this.errors = ['Failed to submit'];
         this.showSubmitResults();

         if (!error.isDataError) {
         throw error;
         }
         });
         */
    }

    canSubmit() {
        return this.submitting ? false : (this.submitting = true);
    }

    showSubmitResults() {
        this.submitting = false;
        this.submitResults.show();
    }

    onSubmitResultsHide() {
        if (this.errors.length === 0) {
            this.router.navigate(['/submissions']);
        }
    }

    private changeSection(sectionId: string) {
        const path: Section[] = this.subm.sectionPath(sectionId);
        if (path.length === 0) {
            console.log(`Section with id ${sectionId} was not found`);
        }
        const section = path[path.length - 1];
        this.sectionWithType = [section,
            this.submType.sectionType(path.map(s => s.type))
            || SectionType.createDefault(section.type)];
    }
}