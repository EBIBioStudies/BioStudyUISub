import { async, TestBed } from '@angular/core/testing';
import { AuthService, UserData, UserSession } from 'app/auth/shared';
import { of, Observable, Subject, ReplaySubject } from 'rxjs';
import { UserInfo } from './model';
import { CollectionsService } from 'app/collections/collections.service';

class UserSessionMock {
  created$: Subject<boolean> = new ReplaySubject<boolean>(1);

  constructor() {
    this.created$.next(true);
  }

  update() {}
}

class AuthServiceMock {
  static user: UserInfo = {
    sessid: '123',
    username: 'vasya',
    email: 'vasya@pupkin.com',
    superuser: false,
    secret: 'secret',
    fullname: 'Vasya',
    aux: {
      orcid: '1234-5678-9999'
    },
    allow: [],
    deny: []
  };

  getUserProfile(): Observable<UserInfo> {
    return of(AuthServiceMock.user);
  }
}

class CollectionsServiceMock {
  getCollections(): Observable<[]> {
    return of([]);
  }
}

describe('UserData', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserData,
        { provide: UserSession, useValue: new UserSessionMock() },
        { provide: AuthService, useValue: new AuthServiceMock() },
        { provide: CollectionsService, useValue: new CollectionsServiceMock() }
      ]
    }).compileComponents();
  });

  it('should return valid user info', async(() => {
    const fixture: UserData = TestBed.inject(UserData);

    fixture.info$.subscribe((info) => {
      expect(info).toEqual(AuthServiceMock.user);
    });
  }));
});
