import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { RecaptchaComponent } from 'ng-recaptcha';
import { AuthService } from 'app/auth/shared';
import { ActivationLinkRequestData } from '../shared/model';
import { NgForm } from '@angular/forms';
import { ServerError } from 'app/shared/server-error.handler';

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

  onRecaptchaResolved(captchaToken: string): void {
    const component = this; // SelfSubscriber object overwrites context for "subscribe" method

    if (captchaToken) {
      this.model.captcha = captchaToken;
      this.authService
        .sendActivationLinkRequest(this.model)
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

  onSubmit(form: NgForm) {
    if (this.hasError) {
      this.resetRecaptcha();
      this.hasError = false;
      this.message = '';
    }

    if (form.valid) {
      this.isLoading = true;
      this.recaptchaRef!.execute();
    } else {
      Object.keys(form.controls).forEach((key) => {
        form.controls[key].markAsTouched({onlySelf: true});
      });
    }
  }

  resetRecaptcha(): void {
    this.recaptchaRef!.reset();
    this.model.resetCaptcha();
  }
}
