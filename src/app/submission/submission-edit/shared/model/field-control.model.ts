import { Subscription } from 'rxjs';
import { ControlRef } from '../control-reference';
import { CustomFormControl } from './custom-form-control.model';
import { Field, FieldType } from 'app/submission/submission-shared/model';
import { FormValueValidator } from '../field-value-validators';
import { SubmFormValidators, ErrorMessages } from '../form-validators';
import { SubmissionService } from 'app/submission/submission-shared/submission.service';

export class FieldControl {
  readonly control: CustomFormControl;
  controlValueSubscription: Subscription;

  constructor(
    private field: Field,
    private ref: ControlRef,
    private submService: SubmissionService,
    private studyAccno: string
  ) {
    this.control = new CustomFormControl(
      field.value,
      SubmFormValidators.forField(field),
      new FormValueValidator().forAsyncFieldValue(this.field, this.submService, this.studyAccno)
    ).withRef(this.ref);

    this.controlValueSubscription = this.control.valueChanges.subscribe((value) => {
      field.value = value;
    });
  }

  get errors(): string[] {
    return ErrorMessages.map(this.control);
  }

  get type(): FieldType {
    return this.field.type;
  }

  get name(): string {
    return this.field.name;
  }

  unsubscribe(): void {
    if (this.controlValueSubscription) {
      this.controlValueSubscription.unsubscribe();
    }
  }
}
