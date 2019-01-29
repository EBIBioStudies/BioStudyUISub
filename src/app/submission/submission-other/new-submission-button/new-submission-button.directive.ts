import {AfterViewInit, Directive, ElementRef, HostBinding, HostListener} from '@angular/core';
import {Router} from '@angular/router';
import {UserData} from 'app/auth/shared';
import {newPageTab, getSubmissionTemplates} from 'app/submission/submission-shared/model';
import {SubmissionService} from 'app/submission/submission-shared/submission.service';
import {BsModalService} from 'ngx-bootstrap';
import {AddSubmModalComponent} from './add-subm-modal.component';

const PLUS_ICON = '<i class="fa fa-plus-circle" aria-hidden="true"></i>';
const SPINNER_ICON = '<i class="fa fa-cog fa-spin"></i>';

@Directive({
    selector: 'button[newSubmissionButton]'
})
export class NewSubmissionButtonDirective implements AfterViewInit {

    constructor(private modalService: BsModalService,
                private submService: SubmissionService,
                private userData: UserData,
                private router: Router,
                private el: ElementRef) {
    }

    ngAfterViewInit(): void {
        const html = this.el.nativeElement.innerHTML;
        this.el.nativeElement.innerHTML = PLUS_ICON + html;
    }

    @HostListener('click', ['$event.target']) onClick(btn) {
        this.onNewSubmissionClick();
    }

    @HostBinding('disabled') disabled?: boolean;

    private onNewSubmissionClick() {
        this.userData.projectAccNumbers$.subscribe(projectNames => {
            const templates = getSubmissionTemplates(projectNames);
            if (templates.length > 0) {
                this.selectTemplate(templates)
            } else {
                this.onOk();
            }
        });
    }

    private selectTemplate(templates: Array<{ name: string, description: string }>) {
        this.modalService.show(AddSubmModalComponent, {
            initialState: {
                templates: templates,
                onOk: (project: string) => this.onOk(project)
            }
        });
    }

    private onOk(template?: string) {
        this.startCreating();
        this.submService.createSubmission(newPageTab(template)).subscribe((subm) => {
            this.stopCreating();
            this.router.navigate(['/submissions/new/', subm.accno]);
        });
    }

    private startCreating() {
        this.disabled = true;
        const html = this.el.nativeElement.innerHTML;
        this.el.nativeElement.innerHTML = html.replace(PLUS_ICON, SPINNER_ICON);
    }


    private stopCreating() {
        this.disabled = false;
        const html = this.el.nativeElement.innerHTML;
        this.el.nativeElement.innerHTML = html.replace(SPINNER_ICON, PLUS_ICON);
    }
}
