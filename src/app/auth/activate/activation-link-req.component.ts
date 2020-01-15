import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, NgForm } from '@angular/forms';
import { RecaptchaComponent } from 'ng-recaptcha';
import { AuthService } from 'app/auth/shared';
import { ActivationLinkRequestData } from '../shared/model';

@Component({
  selector: 'st-auth-activation-resend',
  templateUrl: './activation-link-req.component.html'
})
export class ActivationLinkReqComponent implements AfterViewInit {
  hasError: boolean = false;
  isLoading: boolean = false;
  message: string = '';
  model: ActivationLinkRequestData = new ActivationLinkRequestData();
  showSuccess: boolean = false;

  @ViewChild('emailEl')
  private focusRef?: ElementRef;

  @ViewChild('recaptchaEl')
  private recaptchaRef?: RecaptchaComponent;

  constructor(private authService: AuthService) {}

  // TODO: Turn autofocus on render into a directive
  ngAfterViewInit(): void {
    this.focusRef!.nativeElement.focus();
  }

  onRecaptchaResolved(resp: string): void {
    this.model.captcha = resp;
  }

  onSubmit(form: NgForm) {
    const component = this; // SelfSubscriber object overwrites context for "subscribe" method

    this.resetGlobalError();

    // Makes request for login if all form fields completed satisfactorily
    if (form.valid) {
      this.isLoading = true;
      this.authService
        .sendActivationLinkRequest(this.model)
        .subscribe(
          () => {
            this.isLoading = false;
            component.showSuccess = true;
          },
          (error: HttpErrorResponse) => {
            this.isLoading = false;
            component.hasError = true;
            component.message = error.message;
            component.resetRecaptcha(form.controls['captcha']);
          }
        );

      // Validates in bulk if form incomplete
    } else {
      Object.keys(form.controls).forEach((key) => {
        form.controls[key].markAsTouched({onlySelf: true});
      });
    }
  }

  resetGlobalError() {
    this.hasError = false;
    this.message = '';
  }

  /**
   * Resets all aspects of the captcha widget.
   * @see {@link RecaptchaComponent}
   * @param {AbstractControl} control - Form control for the captcha.
   */
  resetRecaptcha(control: AbstractControl): void {
    this.recaptchaRef!.reset();
    this.model.resetCaptcha();

    // Resets the state of captcha's control
    control.markAsUntouched({onlySelf: true});
    control.markAsPristine({onlySelf: true});
  }
}
