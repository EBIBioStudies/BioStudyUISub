import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UserInfo } from 'app/auth/shared/model';
import { AuthService, UserSession } from 'app/auth/shared';
import { ServerError } from 'app/shared/server-error.handler';

@Component({
  selector: 'st-impersonate-modal',
  templateUrl: './impersonate-modal.component.html'
})
export class ImpersonateModalComponent implements AfterViewInit {
  error?: ServerError; // Server response object in case of error
  isLoading = false; // Flag indicating if login as request in progress
  model = { email: '' };

  @ViewChild('emailElement', { static: false })
  private emailElement!: ElementRef;

  constructor(private authService: AuthService, private userSession: UserSession, private bsModalRef: BsModalRef) {}

  get errorMessage(): string {
    return (
      this.error?.data?.message || `There is an error login in as ${this.model.email}, please report this to the team`
    );
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.emailElement.nativeElement.focus();
    });
  }

  hide(): void {
    this.bsModalRef.hide();
  }

  login(form: NgForm): void {
    if (form.valid) {
      const superUserToken: string = this.userSession.token();

      this.error = undefined;
      this.authService.login({ login: this.model.email, password: superUserToken }).subscribe(
        (user: UserInfo) => {
          this.bsModalRef.hide();

          setTimeout(() => {
            this.userSession.update(user);
            window.location.reload();
          }, 200);
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
}
