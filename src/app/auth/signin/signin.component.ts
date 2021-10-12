import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, UserSession } from 'app/auth/shared';
import { ServerError } from 'app/shared/server-error.handler';
import { UserInfo } from '../shared/model';

@Component({
  selector: 'st-auth-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SignInComponent implements OnInit {
  error?: ServerError; // Server response object in case of error
  isLoading = false; // Flag indicating if login request in progress
  model = { login: '', password: '', next: '' }; // Data model for the component's form

  constructor(
    private authService: AuthService,
    private userSession: UserSession,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (!this.userSession.isAnonymous()) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(form: NgForm): void {
    this.resetGlobalError();
    const next = this.route.snapshot.queryParamMap.get('next') || '/';

    if (form.valid) {
      this.isLoading = true;
      this.authService.login(this.model).subscribe(
        (user: UserInfo) => {
          this.userSession.create(user);
          this.router.navigateByUrl(next).then(() => {
            this.userSession.showHelpModal();
          });
        },
        (error: ServerError) => {
          this.isLoading = false;
          this.error = error;
        }
      );
    } else {
      Object.keys(form.controls).forEach((key) => {
        form.controls[key].markAsTouched({ onlySelf: true });
      });
    }
  }

  resetGlobalError(): void {
    this.error = undefined;
  }
}
