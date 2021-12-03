import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CollectionsService } from 'app/collections/collections.service';
import { AuthService } from './auth.service';
import { ExtendedUserInfo, UserInfo } from './model';
import { UserRole } from './user-role';
import { UserSession } from './user-session';

@Injectable()
export class UserData {
  private whenFetched$: Subject<ExtendedUserInfo> = new ReplaySubject<ExtendedUserInfo>(1);

  constructor(
    private userSession: UserSession,
    private authService: AuthService,
    private collectionsService: CollectionsService
  ) {
    this.userSession.created$.subscribe((created) => {
      if (created) {
        this.authService.getUserProfile().subscribe(
          (user: UserInfo) => {
            this.userSession.update(user);

            this.collectionsService.getCollections().subscribe((result) => {
              const extendedUserInfo = user as ExtendedUserInfo;
              extendedUserInfo.collections = result.map((collection) => collection.accno);
              this.whenFetched$.next(extendedUserInfo);
              this.whenFetched$.complete();
            });
          },
          (error) => {
            console.log(error);
          }
        );
      }
    });
  }

  get info$(): Observable<ExtendedUserInfo> {
    return this.whenFetched$;
  }

  get secretId$(): Observable<string> {
    return this.info$.pipe(map((userInfo) => userInfo.secret));
  }

  get collections$(): Observable<string[]> {
    return this.info$.pipe(map((userInfo) => userInfo.collections));
  }

  get role(): UserRole {
    return UserRole.User;
  }

  get isPrivileged(): boolean {
    return this.role !== UserRole.Public;
  }
}
