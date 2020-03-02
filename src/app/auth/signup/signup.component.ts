import { AfterViewInit, Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecaptchaComponent } from 'ng-recaptcha';
import { ServerError } from 'app/shared/server-error.handler';
import { NgForm } from '@angular/forms';
import { AuthService, UserSession } from '../shared';
import { RegistrationData } from '../shared/model';

@Component({
  selector: 'st-auth-signup',
  templateUrl: './signup.component.html'
})
export class SignUpComponent implements AfterViewInit, OnInit {
  error?: ServerError; // global object for showing error feedback
  isLoading: boolean = false;
  model: RegistrationData = new RegistrationData();
  success: boolean = false;

  @ViewChild('focusEl', { static: false })
  private focusRef?: ElementRef;

  @ViewChild('recaptchaEl', { static: false })
  private recaptcha?: RecaptchaComponent;

  constructor(
    private authService: AuthService,
    private session: UserSession,
    private router: Router
  ) {}

  // TODO: Turn autofocus on render into a directive
  ngAfterViewInit(): void {
    this.focusRef!.nativeElement.focus();
  }

  ngOnInit() {
    if (!this.session.isAnonymous()) {
      this.router.navigate(['']);
    }
  }

  onRecaptchaResolved(resp: string): void {
    this.model.captcha = resp;
    this.isLoading = true;
    this.authService
      .register(this.model)
      .subscribe(
        () => {
          this.isLoading = false;
          this.success = true;
        },
        (error: ServerError) => {
          this.isLoading = false;
          this.error = error;
          this.resetReCaptcha();
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

  /**
   * Resets the value of the error object to effectively hide feedback.
   */
  resetGlobalError(): void {
    this.error = undefined;
  }

  /**
   * Resets all aspects of the captcha widget.
   * @see {@link RecaptchaComponent}
   */
  resetReCaptcha(): void {
    this.model.resetCaptcha();
  }
}
