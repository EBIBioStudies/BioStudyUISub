import { Observable, of } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';
import { Field } from 'app/submission/submission-shared/model/submission/submission.model';
import { ValueTypeName, TextValueType } from 'app/submission/submission-shared/model/templates/submission-type.model';
import { CustomFormControl } from './model/custom-form-control.model';
import { SubmissionService } from 'app/submission/submission-shared/submission.service';

export class FormValueValidator {
  static forStudyTitle = (
    control: CustomFormControl,
    submService: SubmissionService,
    studyAccno: string
  ): Observable<null> => {
    return submService.getSubmissions(true, { keywords: control.value }).pipe(
      map((submissions) => {
        const differentSubmissions = submissions.filter((submission) => submission.accno !== studyAccno);
        control.warnings =
          differentSubmissions.length > 0
            ? { uniqueSubmission: { value: control.value, payload: differentSubmissions } }
            : {};

        return null;
      }),
      catchError(() => of(null)),
      first()
    );
  };

  static forAsyncFieldValue = (
    field: Field,
    control: CustomFormControl,
    submService: SubmissionService,
    studyAccno: string
  ): Observable<null> => {
    const valueType = field.type.valueType;

    if (valueType.is(ValueTypeName.text, ValueTypeName.largetext)) {
      const textValueType = valueType as TextValueType;

      if (textValueType.isStudyTitle) {
        return FormValueValidator.forStudyTitle(control, submService, studyAccno);
      }
    }

    return of(null);
  };
}
