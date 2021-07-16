import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { SubmissionService } from 'app/submission/submission-shared/submission.service';
import { AuthService } from './auth.service';
import { ExtendedUserInfo, UserInfo } from './model';
import { UserRole } from './user-role';
import { UserSession } from './user-session';

@Injectable()
export class UserData {
  private whenFetched$: Subject<ExtendedUserInfo> = new ReplaySubject<ExtendedUserInfo>(1);

  constructor(userSession: UserSession, authService: AuthService, submService: SubmissionService) {
    userSession.created$.subscribe((created) => {
      if (created) {
        authService.getUserProfile().subscribe((user: UserInfo) => {
          userSession.update(user);

          submService.getProjects().subscribe((result) => {
            const extendedUserInfo = user as ExtendedUserInfo;
            extendedUserInfo.projects = result.map((project) => project.accno);
            this.whenFetched$.next(extendedUserInfo);
            this.whenFetched$.complete();
          });
        });
      }
    });
  }

  get info$(): Observable<ExtendedUserInfo> {
    return this.whenFetched$;
  }

  get secretId$(): Observable<string> {
    return this.info$.pipe(map((ui) => ui.secret));
  }

  get projectAccNumbers$(): Observable<string[]> {
    return this.info$.pipe(map((ui) => ui.projects));
  }

  get role(): UserRole {
    return UserRole.User;
  }

  get isPrivileged(): boolean {
    return this.role !== UserRole.Public;
  }
}
