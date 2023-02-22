import { Directive, HostBinding, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { UserData } from 'app/auth/shared';
import { getTemplatesForCollections, TemplateDetail } from 'app/submission/submission-shared/model';
import { SubmissionService } from 'app/submission/submission-shared/submission.service';
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
    private router: Router
  ) {}

  @HostListener('click', ['$event.target']) onClick(): void {
    this.onNewSubmissionClick();
  }

  private onNewSubmissionClick(): void {
    this.userData.collections$.subscribe((collectionNames) => {
      const templates: TemplateDetail[] = getTemplatesForCollections(collectionNames);
      if (templates.length > 1) {
        this.selectTemplate(templates);
      } else {
        this.onOk();
      }
    });
  }

  private onOk(collection?: string, template?: string): void {
    this.startCreating();
    this.submService.createDraftSubmission(collection, template).subscribe((accno) => {
      this.stopCreating();
      this.router.navigate(['/new/', accno]);
    });
  }

  private selectTemplate(templates: TemplateDetail[]): void {
    this.modalService.show(AddSubmModalComponent, {
      class: 'modal-lg',
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
