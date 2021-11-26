import { Observable, Subscription } from 'rxjs';
import { ControlRef } from '../control-reference';
import { CustomFormControl } from './custom-form-control.model';
import { Field, FieldType } from 'app/submission/submission-shared/model';
import { FormValueValidator } from '../field-value-validators';
import { SubmFormValidators, ErrorMessages } from '../form-validators';
import { SubmissionService } from 'app/submission/submission-shared/submission.service';
import { AsyncValidatorFn, ValidationErrors } from '@angular/forms';

type ValidatorFn = (
  control: CustomFormControl,
  submService: SubmissionService,
  studyAccno: string
) => Observable<ValidationErrors>;

export class FieldControl {
  readonly control: CustomFormControl;
  controlValueSubscription: Subscription;
  validatorNameToFnMap = {
    forStudyTitle: FormValueValidator.forStudyTitle,
    forFileList: FormValueValidator.forFileList
  };

  constructor(
    private field: Field,
    private ref: ControlRef,
    private submService: SubmissionService,
    private studyAccno: string
  ) {
    this.control = new CustomFormControl(
      field.value,
      SubmFormValidators.forField(field),
      this.getFieldAsyncValidators()
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

  getFieldAsyncValidators(): AsyncValidatorFn[] {
    const asyncValueValidatorName = this.field.type.asyncValueValidatorName;

    if (asyncValueValidatorName !== null && asyncValueValidatorName.length > 0) {
      const validator: ValidatorFn = this.validatorNameToFnMap[asyncValueValidatorName];

      if (validator) {
        return [(control: CustomFormControl) => validator(control, this.submService, this.studyAccno)];
      }
    }

    return [];
  }

  unsubscribe(): void {
    if (this.controlValueSubscription) {
      this.controlValueSubscription.unsubscribe();
    }
  }
}
