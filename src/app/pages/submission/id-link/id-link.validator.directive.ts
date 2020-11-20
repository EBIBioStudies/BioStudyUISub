import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';
import { Directive } from '@angular/core';
import { Observable } from 'rxjs';
import { IdLinkService } from './id-link.service';
import { idLinkValidator } from './id-link.validator';

export interface IdLinkValueValidatorState {
  isId: boolean,
  url: string
}

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[idLinkValue][formControlName],[idLinkValue][formControl], [idLinkValue][ngModel]',
  providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: IdLinkValueValidatorDirective, multi: true}]
})
export class IdLinkValueValidatorDirective implements AsyncValidator {
  state: IdLinkValueValidatorState; // Dynamic link properties determined after validation.

  /**
   * Initialises the dynamic and cached properties to those matching an invalid empty link.
   * @param linkService - Singleton API service for Identifier.org.
   */
  constructor(private linkService: IdLinkService) {
    this.state = {
      isId: false, // indicates if the current link is a valid prefix:ID
      url: '' // current valid URL (be it conventional or prefix:ID
    };
  }

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return idLinkValidator(this.linkService, this.state)(control);
  }
}
