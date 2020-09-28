import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RecaptchaComponent } from 'ng-recaptcha';
import { AuthService } from 'app/auth/shared';
import { PasswordResetRequestData } from '../shared/model';
import { ServerError } from 'app/shared/server-error.handler';

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

  @ViewChild('emailEl')
  private focusRef!: ElementRef;

  @ViewChild('recaptchaEl')
  private recaptcha!: RecaptchaComponent;

  constructor(private authService: AuthService) {}

  // TODO: Turn autofocus on render into a directive
  ngAfterViewInit(): void {
    this.focusRef.nativeElement.focus();
  }

  onRecaptchaResolved(captchaToken: string): void {
    const component = this; // SelfSubscriber object sometimes overwrites context for "subscribe" method

    if (captchaToken) {
      this.model.captcha = captchaToken;
      this.authService.sendPasswordResetRequest(this.model)
        .subscribe(
          () => {
            this.isLoading = false;
            component.showSuccess = true;
          },
          (error: ServerError) => {
            this.isLoading = false;
            component.hasError = true;
            component.message = error.data.message;
          }
        );
    }
  }

  onSubmit(form: NgForm): void {
    if (this.hasError) {
      this.resetRecaptcha();
      this.hasError = false;
      this.message = '';
    }

    if (form.valid) {
      this.isLoading = true;
      this.recaptcha.execute();
    } else {
      Object.keys(form.controls).forEach((key) => {
        form.controls[key].markAsTouched({onlySelf: true});
      });
    }
  }

  resetRecaptcha(): void {
    this.recaptcha.reset();
    this.model.resetCaptcha();
  }
}
