import {AfterViewInit, Directive, ElementRef, HostBinding, HostListener} from '@angular/core';
import {BsModalService} from 'ngx-bootstrap';
import {AddSubmModalComponent} from './modals/add-subm-modal.component';
import {newPageTab, SUBMISSION_TEMPLATE_NAMES} from './model';
import {SubmissionService} from './submission.service';
import {UserData} from 'app/auth/shared';
import {Router} from '@angular/router';

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
        this.userData.filteredProjectAccNumbers$(SUBMISSION_TEMPLATE_NAMES).subscribe(projects => {
            const projectNames = ['BioImages', 'HeCaToS', 'EU-ToxRisk']; //TODO projects;
            if (projectNames.length > 0) {
                this.selectProject([...projectNames, ...['Default']])
            } else {
                this.onOk();
            }
        });
    }

    private selectProject(projectNames: Array<string>) {
        this.modalService.show(AddSubmModalComponent, {
            initialState: {
                projectNames: projectNames,
                onOk: (project:string) => this.onOk(project)
            }
        });
    }

    private onOk(project?: string) {
        this.startCreating();
        this.submService.createSubmission(newPageTab(project)).subscribe((subm) => {
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
