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

    //Dynamic link properties determined after validation.
    extra = {
        url: '',                //current valid URL (be it conventional or prefix:ID
        isId: false             //indicates if the current link is a valid prefix:ID
    };

    //Cache for past validation process.
    prev = {
        link: ['', ''],         //previous prefix and ID parts of the link
        url: '',                //previous valid URL
        error: null             //previous error object after validation
    };

    constructor(private service: IdLinkService) {}

    validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
        return idLinkValidator(this.service, this.extra, this.prev)(control);
    }
}
