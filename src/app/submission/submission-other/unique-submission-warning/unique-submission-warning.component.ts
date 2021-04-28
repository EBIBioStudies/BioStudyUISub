import { Component, Input } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { WarningMessages } from 'app/submission/submission-edit/shared/form-validators';
import { FieldControl } from 'app/submission/submission-edit/shared/model/field-control.model';
import { SubmissionListItem } from 'app/submission/submission-shared/submission.service';
import { UniqueSubmissionModalComponent } from '../unique-submission-modal/unique-submission-modal.component';

@Component({
  selector: 'st-unique-submission-warning',
  templateUrl: './unique-submission-warning.component.html'
})
export class UniqueSubmissionWarningComponent {
  @Input() fieldControl!: FieldControl;

  constructor(private modalService: BsModalService) {}

  get uniqueSubmWarningMessage(): string | null {
    return WarningMessages.getWarningParamByErrorKey<string>(this.fieldControl.control, 'message', 'uniqueSubmission');
  }

  get uniqueSubmWarningPayload(): SubmissionListItem | null {
    return WarningMessages.getWarningParamByErrorKey<SubmissionListItem>(
      this.fieldControl.control,
      'payload',
      'uniqueSubmission'
    );
  }

  onSeeMoreClick(): void {
    this.modalService.show(UniqueSubmissionModalComponent, {
      class: 'modal-lg',
      initialState: { similarSubmissions: this.uniqueSubmWarningPayload }
    });
  }
}
