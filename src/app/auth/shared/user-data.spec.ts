import { async } from '@angular/core/testing';
import { AuthService, UserData, UserSession } from 'app/auth/shared';
import { of, Observable } from 'rxjs';
import { UserInfo, ExtendedUserInfo } from './model';

describe('UserData', () => {
  let submService;
  let userCookies;
  let appConfig;

  beforeEach(() => {
    submService = {
      getProjects(): Observable<[]> {
        return of([]);
      }
    };

    userCookies = {
      setLoginToken(): void {},
      setUser(): void {}
    };

    appConfig = {
      environment: 'LOCAL'
    };
  });

  it('should return valid user info', async(() => {
    const user: UserInfo = {
      sessid: '123',
      username: 'vasya',
      email: 'vasya@pupkin.com',
      superuser: false,
      secret: 'secret',
      fullname: 'Vasya',
      aux: {
        orcid: '1234-5678-9999'
      }
    };

    const authService = {
      getUserProfile(): Observable<UserInfo> {
        return of(user);
      }
    };

    const session = new UserSession(userCookies, appConfig);

    new UserData(session, authService as AuthService, submService).info$.subscribe((info) => {
      expect(info).toEqual(user as ExtendedUserInfo);
    });

    session.create(user);
  }));
});
