import { filter, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ControlRef } from '../control-reference';
import { CustomFormControl } from './custom-form-control.model';
import { Field, FieldType } from 'app/submission/submission-shared/model';
import { FormValueValidator } from '../field-value-validators';
import { SubmFormValidators, ErrorMessages } from '../form-validators';
import { SubmissionService } from 'app/submission/submission-shared/submission.service';

export class FieldControl {
  readonly control: CustomFormControl;
  asyncValidatorSubscription: Subscription;
  controlValueSubscription: Subscription;

  constructor(
    private field: Field,
    private ref: ControlRef,
    private submService: SubmissionService,
    private studyAccno: string
  ) {
    this.control = new CustomFormControl(field.value, SubmFormValidators.forField(field)).withRef(this.ref);

    this.asyncValidatorSubscription = this.control.valueChanges
      .pipe(
        filter(() => this.control.dirty && this.control.valid),
        switchMap(() =>
          FormValueValidator.forAsyncFieldValue(this.field, this.control, this.submService, this.studyAccno)
        )
      )
      .subscribe();

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
    if (this.asyncValidatorSubscription) {
      this.asyncValidatorSubscription.unsubscribe();
    }

    if (this.controlValueSubscription) {
      this.controlValueSubscription.unsubscribe();
    }
  }
}
