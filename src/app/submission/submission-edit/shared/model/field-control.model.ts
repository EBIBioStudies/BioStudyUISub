import { ControlRef } from '../control-reference';
import { CustomFormControl } from './custom-form-control.model';
import { Field, FieldType } from 'app/submission/submission-shared/model';
import { SubmFormValidators, ErrorMessages } from '../form-validators';
import { SubmissionService } from 'app/submission/submission-shared/submission.service';

export class FieldControl {
  readonly control: CustomFormControl;

  constructor(
    private field: Field,
    private ref: ControlRef,
    private submService: SubmissionService,
    private studyAccno: string
  ) {
    this.control = new CustomFormControl(
      field.value,
      SubmFormValidators.forField(field),
      SubmFormValidators.forAsyncField(field, this.submService, this.studyAccno)
    ).withRef(this.ref);
    this.control.valueChanges.subscribe((value) => {
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
}
