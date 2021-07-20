import { Component, ViewChild } from '@angular/core';
import { RecaptchaComponent } from 'ng-recaptcha';
import { AuthService } from 'app/auth/shared';
import { ActivationLinkRequestData } from '../shared/model';
import { NgForm } from '@angular/forms';
import { ServerError } from 'app/shared/server-error.handler';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'st-auth-activation-resend',
  templateUrl: './activation-link-req.component.html'
})
export class ActivationLinkReqComponent {
  hasError: boolean = false;
  isLoading: boolean = false;
  message: string = '';
  model: ActivationLinkRequestData = new ActivationLinkRequestData();
  showSuccess: boolean = false;

  @ViewChild('recaptchaEl')
  private recaptchaRef!: RecaptchaComponent;

  constructor(private authService: AuthService, private route: ActivatedRoute) {
    this.route.queryParams.subscribe((params) => {
      this.model.email = params.email || '';

      if (this.model.email.length > 0) {
        this.sendActivationEmail();
      }
    });
  }

  sendActivationEmail(): void {
    this.isLoading = true;
    this.authService.sendActivationEmailRequest(this.model).subscribe(
      () => {
        this.isLoading = false;
        this.showSuccess = true;
      },
      (error: ServerError) => {
        this.isLoading = false;
        this.hasError = true;
        this.message = error.data.message;
      }
    );
  }

  onRecaptchaResolved(captchaToken: string): void {
    if (captchaToken) {
      this.model.captcha = captchaToken;
      this.authService.sendActivationLinkRequest(this.model).subscribe(
        () => {
          this.isLoading = false;
          this.showSuccess = true;
        },
        (error: ServerError) => {
          this.isLoading = false;
          this.hasError = true;
          this.message = error.data.message;
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
      this.recaptchaRef.execute();
    } else {
      Object.keys(form.controls).forEach((key) => {
        form.controls[key].markAsTouched({ onlySelf: true });
      });
    }
  }

  resetRecaptcha(): void {
    this.recaptchaRef.reset();
    this.model.resetCaptcha();
  }
}
