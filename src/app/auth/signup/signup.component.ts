import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecaptchaComponent } from 'ng-recaptcha';
import { ServerError } from 'app/shared/server-error.handler';
import { AuthService, UserSession } from '../shared';
import { RegistrationData } from '../shared/model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'st-auth-signup',
  templateUrl: './signup.component.html'
})
export class SignUpComponent implements OnInit {
  hasError: boolean = false;
  isLoading: boolean = false;
  message: string = '';
  model: RegistrationData = new RegistrationData();
  success: boolean = false;

  @ViewChild('recaptchaEl')
  private recaptcha!: RecaptchaComponent;

  constructor(
    private authService: AuthService,
    private session: UserSession,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.session.isAnonymous()) {
      this.router.navigate(['']);
    }
  }

  onRecaptchaResolved(captchaToken: string): void {
    if (captchaToken) {
      this.model.captcha = captchaToken;
      this.authService
        .register(this.model)
        .subscribe(
          () => {
            this.hasError = false;
            this.isLoading = false;
            this.success = true;
          },
          (error: ServerError) => {
            this.hasError = true;
            this.isLoading = false;
            this.message = error.data.message;
            this.success = false;
          }
        );
    }
  }

  onSubmit(form: NgForm): void {
    if (this.hasError) {
      this.resetReCaptcha();
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

  resetReCaptcha(): void {
    this.recaptcha.reset();
    this.model.resetCaptcha();
  }
}
