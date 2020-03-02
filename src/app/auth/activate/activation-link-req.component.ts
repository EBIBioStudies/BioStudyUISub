import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
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

  @ViewChild('emailEl', { static: false })
  private focusRef?: ElementRef;

  @ViewChild('recaptchaEl', { static: false })
  private recaptchaRef?: RecaptchaComponent;

  constructor(private authService: AuthService) {}

  // TODO: Turn autofocus on render into a directive
  ngAfterViewInit(): void {
    this.focusRef!.nativeElement.focus();
  }

  onRecaptchaResolved(resp: string): void {
    const component = this; // SelfSubscriber object overwrites context for "subscribe" method

    this.model.captcha = resp;
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
          component.resetRecaptcha();
        }
      );
  }

  onSubmit(form: NgForm) {
    this.resetGlobalError();

    if (form.valid) {
      // If reCAPTCHA resolves, the signup request is sent.
      this.recaptchaRef!.execute();
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
   */
  resetRecaptcha(): void {
    this.model.resetCaptcha();
  }
}
