import { Component, OnInit, ViewChild } from '@angular/core';
import { RecaptchaComponent } from 'ng-recaptcha';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from 'app/auth/shared';
import { PasswordResetData } from '../shared/model';
import { ServerError } from 'app/shared/server-error.handler';

@Component({
  selector: 'st-auth-passwd-reset',
  templateUrl: './password-reset.component.html'
})
export class PasswordResetComponent implements OnInit {
  hasError: boolean = false;
  isLoading: boolean = false;
  isPassSetup: boolean = false;
  message: string = '';
  model: PasswordResetData = new PasswordResetData();
  showSuccess: boolean = false;

  @ViewChild('recaptchaEl')
  private recaptcha!: RecaptchaComponent;

  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute, private route: ActivatedRoute) {
    this.route.data.subscribe((data) => {
      if (data.hasOwnProperty('isPassSetup')) {
        this.isPassSetup = data.isPassSetup;
      }
    });
  }

  ngOnInit(): void {
    const key = this.activatedRoute.snapshot.paramMap.get('key');
    if (key === null) {
      this.hasError = true;
      this.message = 'Invalid path';
    } else {
      this.model.key = key;
    }
  }

  onRecaptchaResolved(captchaToken: string): void {
    if (captchaToken) {
      this.model.captcha = captchaToken;
      this.authService.changePassword(this.model).subscribe(
        () => {
          this.isLoading = false;
          this.showSuccess = true;
        },
        (error: ServerError) => {
          this.isLoading = false;
          this.hasError = true;
          this.resetRecaptcha();
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
      this.recaptcha.execute();
    } else {
      Object.keys(form.controls).forEach((key) => {
        form.controls[key].markAsTouched({ onlySelf: true });
      });
    }
  }

  resetRecaptcha(): void {
    this.recaptcha.reset();
    this.model.resetCaptcha();
  }
}
