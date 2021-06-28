import { AfterViewInit, Directive, ElementRef, HostBinding, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { UserData } from 'app/auth/shared';
import { getSubmissionTemplates, PageTab } from 'app/submission/submission-shared/model';
import { SubmissionToPageTabService } from 'app/submission/submission-shared/submission-to-pagetab.service';
import { SubmissionService } from 'app/submission/submission-shared/submission.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AddSubmModalComponent } from './add-subm-modal.component';

const PLUS_ICON = '<i class="fa fa-plus-circle" aria-hidden="true"></i>';
const SPINNER_ICON = '<i class="fa fa-cog fa-spin"></i>';

@Directive({
  selector: 'button[stNewSubmissionButton]'
})
export class NewSubmissionButtonDirective implements AfterViewInit {
  @HostBinding('disabled') disabled?: boolean;

  constructor(
    private modalService: BsModalService,
    private submService: SubmissionService,
    private userData: UserData,
    private router: Router,
    private el: ElementRef,
    private submissionToPageTab: SubmissionToPageTabService
  ) {}

  ngAfterViewInit(): void {
    const html = this.el.nativeElement.innerHTML;
    this.el.nativeElement.innerHTML = PLUS_ICON + html;
  }

  @HostListener('click', ['$event.target']) onClick(): void {
    this.onNewSubmissionClick();
  }

  private onNewSubmissionClick(): void {
    this.userData.projectAccNumbers$.subscribe((projectNames) => {
      const templates = getSubmissionTemplates(projectNames);
      if (templates.length > 0) {
        this.selectTemplate(templates);
      } else {
        this.onOk();
      }
    });
  }

  private onOk(collection?: string, template?: string): void {
    const emptySubmission: PageTab = this.submissionToPageTab.newPageTab(collection, template);

    this.startCreating();
    this.submService.createDraftSubmission(emptySubmission).subscribe((accno) => {
      this.stopCreating();
      this.router.navigate(['/new/', accno]);
    });
  }

  private selectTemplate(templates: Array<{ description: string; name: string }>): void {
    this.modalService.show(AddSubmModalComponent, {
      initialState: {
        templates,
        onOk: (collection: string, template: string) => this.onOk(collection, template)
      }
    });
  }

  private startCreating(): void {
    this.disabled = true;
    const html = this.el.nativeElement.innerHTML;
    this.el.nativeElement.innerHTML = html.replace(PLUS_ICON, SPINNER_ICON);
  }

  private stopCreating(): void {
    this.disabled = false;
    const html = this.el.nativeElement.innerHTML;
    this.el.nativeElement.innerHTML = html.replace(SPINNER_ICON, PLUS_ICON);
  }
}
