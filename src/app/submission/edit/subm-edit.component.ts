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
import {SubmissionTemplate, SectionTemplate} from '../shared/submission-template.model';
import * as stu from '../shared/submission-template.utils';

@Component({
    selector: 'subm-edit',
    templateUrl: './subm-edit.component.html'
})
export class SubmEditComponent implements OnInit, OnDestroy {
    sideBarCollapsed: false;
    readonly: boolean = false;

    submAndTmpl: [Submission, SubmissionTemplate];

    sectionAndTmpl: [Section, SectionTemplate];

    errors: string[] = [];

    private submitting: boolean = false;
    private accno: string = '';

    private __subscr: Subscription;

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
                //TODO
                this.accno = data.accno;
                const tmpl = SubmissionTemplate.createDefault();
                const subm = stu.createSubmission(tmpl);

                this.submAndTmpl = [subm, tmpl];
                this.changeSection(subm.root.id);
            });
    }

    ngOnDestroy() {
        console.debug("SubmEdit: (OnDestroy)");
        if (this.__subscr) {
            this.__subscr.unsubscribe();
        }
    }

    get submission(): Submission {
        return this.submAndTmpl ? this.submAndTmpl[0] : undefined;
    }

    get submissionTmpl(): SubmissionTemplate {
        return this.submAndTmpl ? this.submAndTmpl[1] : undefined;
    }

    get section(): Section {
        return this.sectionAndTmpl ? this.sectionAndTmpl[0] : undefined;
    }

    get sectionPath(): Section[] {
        const subm = this.submission;
        return subm === undefined ? [] : subm.sectionPath(this.section.id);
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

    changeSection(sectionId: string) {
        let sec = this.submission.sectionById(sectionId);
        const types: string[] = this.submission
            .sectionPath(sectionId)
            .map(s => s.type);

        let tmpl = this.submissionTmpl.getSectionTemplate(types.splice(1));
        this.sectionAndTmpl = [sec, tmpl || SectionTemplate.createDefault(sec.type)];
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

    onSectionClick(section: Section): void {
        console.log('onSectionClick', section.id);
        this.changeSection(section.id);
    }
}