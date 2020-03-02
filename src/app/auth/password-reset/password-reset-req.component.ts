import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RecaptchaComponent } from 'ng-recaptcha';
import { AuthService } from 'app/auth/shared';
import { PasswordResetRequestData } from '../shared/model';

@Component({
  selector: 'st-auth-passwd-reset-req',
  templateUrl: './password-reset-req.component.html'
})
export class PasswordResetReqComponent implements AfterViewInit {
  hasError: boolean = false;
  isLoading: boolean = false; // Flag indicating if login request in progress
  message: string = '';
  model: PasswordResetRequestData = new PasswordResetRequestData();
  showSuccess: boolean = false;

  @ViewChild('emailEl', { static: false })
  private focusRef?: ElementRef;

  @ViewChild('recaptchaEl', { static: false })
  private recaptcha?: RecaptchaComponent;

  constructor(private authService: AuthService) {}

  // TODO: Turn autofocus on render into a directive
  ngAfterViewInit(): void {
    this.focusRef!.nativeElement.focus();
  }

  onRecaptchaResolved(resp: string): void {
    const component = this; // SelfSubscriber object sometimes overwrites context for "subscribe" method

    this.model.captcha = resp;
    this.isLoading = true;
    this.authService.sendPasswordResetRequest(this.model)
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

  onSubmit(form: NgForm): void {
    this.resetGlobalError();

    // Makes request if all form fields completed satisfactorily
    if (form.valid) {
      // If reCAPTCHA resolves, the signup request is sent.
      this.recaptcha!.execute();
    } else {
      Object.keys(form.controls).forEach((key) => {
        form.controls[key].markAsTouched({onlySelf: true});
      });
    }
  }

  resetGlobalError(): void {
    this.message = '';
    this.hasError = false;
  }

  /**
   * Resets all aspects of the captcha widget.
   * @see {@link RecaptchaComponent}
   */
  resetRecaptcha(): void {
    this.model.resetCaptcha();
  }
}
