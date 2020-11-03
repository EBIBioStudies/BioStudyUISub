import { Directive, HostBinding, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[stBootstrapValidation]'
})
export class BootstrapValidationDirective {
  constructor(@Self() private cd: NgControl) {}

  @HostBinding('class.is-invalid')
  get isInvalid(): boolean {
    const control = this.cd.control;
    return control ? control.invalid && control.touched : false;
  }
}
