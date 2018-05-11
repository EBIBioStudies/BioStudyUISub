import {AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors} from '@angular/forms';
import {Directive} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {IdLinkService} from './id-link.service';
import {idLinkValidator} from './id-link.validator';

@Directive({
  selector: '[idLinkValue][formControlName],[idLinkValue][formControl], [idLinkValue][ngModel]',
  providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: IdLinkValueValidatorDirective, multi: true}]
})
export class IdLinkValueValidatorDirective implements AsyncValidator {
  constructor(private service: IdLinkService) {}

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return idLinkValidator(this.service)(control);
  }
}
