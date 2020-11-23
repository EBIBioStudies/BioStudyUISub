import { Directive, forwardRef, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[stEquals2][formControlName],[stEquals2][formControl],[stEquals2][ngModel]',
  providers: [{ provide: NG_VALIDATORS, useExisting: forwardRef(() => Equals2Directive), multi: true }]
})
export class Equals2Directive implements Validator {
  // tslint:disable-next-line: no-input-rename
  @Input('stEquals2') target?: AbstractControl;

  validate(c: AbstractControl): ValidationErrors | null {
    const v = c.value;

    if (this.target && v !== this.target.value) {
      return {
        equals2: true
      };
    }

    return null;
  }
}
