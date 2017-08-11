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

import {BsModalService} from 'ngx-bootstrap/modal';

import {
    Submission,
    Section
} from '../shared/submission.model';

import {SubmissionService} from '../shared/submission.service';
import {
    SubmissionType
} from '../shared/submission-type.model';

import {PageTab} from '../shared/pagetab.model';
import {
    SubmissionValidator,
    SubmValidationErrors
} from '../shared/submission.validator';
import {ServerError} from '../../http/server-error.handler';
import {SubmResultsModalComponent} from '../results/subm-results-modal.component';

@Component({
    selector: 'subm-edit',
    templateUrl: './subm-edit.component.html'
})
export class SubmEditComponent implements OnInit, OnDestroy {
    sideBarCollapsed = false;
    readonly = false;

    subm: Submission;
    section: Section;

    errors: SubmValidationErrors = SubmValidationErrors.EMPTY;
    accno = '';

    private subscr: Subscription;
    private submitting = false;
    private wrappedSubm: any;

    constructor(private route: ActivatedRoute,
                private submService: SubmissionService,
                private router: Router,
                private modalService: BsModalService) {
    }

    ngOnInit() {
        this.route.params
            .map((params: Params) => params['accno'])
            .switchMap(accno => this.submService.getSubmission(accno))
            .subscribe(wrappedSubm => {
                this.wrappedSubm = wrappedSubm;
                this.accno = wrappedSubm.accno;
                this.subm = (new PageTab(wrappedSubm.data)).toSubmission(SubmissionType.createDefault());

                this.errors = SubmissionValidator.validate(this.subm);

                this.subm
                    .updates()
                    .switchMap(ue => SubmissionValidator.createObservable(this.subm))
                    .subscribe(errors => {
                        this.errors = errors;
                    });

                this.subm
                    .updates()
                    .switchMap(ue => {
                        return this.submService.saveSubmission(this.wrap());
                    })
                    .subscribe(result => console.log('saved: ' + result));

                this.changeSection(this.subm.root.id);
            });
    }

    ngOnDestroy() {
        if (this.subscr) {
            this.subscr.unsubscribe();
        }
    }

    get sectionPath(): Section[] {
        if (this.subm === undefined || this.section === undefined) {
            return [];
        }
        return this.subm.sectionPath(this.section.id);
    }

    get submValid(): boolean {
        return this.errors.empty();
    }

    onSectionClick(section: Section): void {
        this.changeSection(section.id);
    }

    onSubmit(event) {
        if (event) {
            event.preventDefault();
        }

        if (!this.canSubmit() || !this.submValid) {
            return;
        }

        this.submService.submitSubmission(this.wrap())
            .subscribe(
                resp => {
                    console.log('submitted', resp);
                    this.showSubmitResults(resp);
                },
                (error: ServerError) => {
                    this.showSubmitResults({
                        status: 'FAIL',
                        log: {
                            level: 'ERROR',
                            message: error.message
                        }
                    });

                    if (!error.isDataError) {
                        throw error;
                    }
                });
    }

    canSubmit() {
        return this.submitting ? false : (this.submitting = true);
    }

    showSubmitResults(resp: any) {
        this.submitting = false;

        const subscriptions = (function () {
            let list = [];
            return {
                push: function (i) {
                    list.push(i);
                },
                unsubscribe: function () {
                    list.forEach(i => i.unsubscribe());
                    list = [];
                }
            }
        })();

        subscriptions.push(this.modalService.onHide.subscribe((reason: string) => {
            if (resp.status === 'OK') {
                this.router.navigate(['/submissions']);
            }
        }));
        subscriptions.push(this.modalService.onHidden.subscribe((reason: string) => {
            subscriptions.unsubscribe();
        }));

        const bsModalRef = this.modalService.show(SubmResultsModalComponent);
        bsModalRef.content.log = resp.log || {};
        bsModalRef.content.status = resp.status;
    }

    private wrap(): any {
        const w = Object.assign({}, this.wrappedSubm);
        w.data = PageTab.fromSubmission(this.subm);
        return w;
    }

    private changeSection(sectionId: string) {
        const path: Section[] = this.subm.sectionPath(sectionId);
        if (path.length === 0) {
            console.log(`Section with id ${sectionId} was not found`);
        }
        this.section = path[path.length - 1];
    }
}
