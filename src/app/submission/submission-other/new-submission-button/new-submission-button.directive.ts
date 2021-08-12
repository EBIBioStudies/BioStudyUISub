import { Directive, HostBinding, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { UserData } from 'app/auth/shared';
import { getSubmissionTemplates } from 'app/submission/submission-shared/model';
import { ExtSubmissionType } from 'app/submission/submission-shared/model/ext-submission-types';
import { SubmissionService } from 'app/submission/submission-shared/submission.service';
import { SubmissionToExtSubmissionService } from 'app/submission/submission-shared/submittion-to-ext-submission.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AddSubmModalComponent } from '../add-subm-modal/add-subm-modal.component';

@Directive({
  selector: 'button[stNewSubmissionButton]'
})
export class NewSubmissionButtonDirective {
  @HostBinding('disabled') disabled?: boolean;

  constructor(
    private modalService: BsModalService,
    private submService: SubmissionService,
    private userData: UserData,
    private router: Router,
    private submissionToExt: SubmissionToExtSubmissionService
  ) {}

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
    const emptySubmission: ExtSubmissionType = this.submissionToExt.toExtSubmissionFromTemplate(collection, template);

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
  }

  private stopCreating(): void {
    this.disabled = false;
  }
}
