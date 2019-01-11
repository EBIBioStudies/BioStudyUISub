import {Injectable} from '@angular/core';
import {ExtendedUserInfo} from 'app/auth/model';

import {SubmissionService} from 'app/submission/shared/submission.service';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {map} from 'rxjs/operators';
import {AuthService} from './auth.service';

import {UserRole} from './user-role';
import {UserSession} from './user-session';

@Injectable()
export class UserData {

    private whenFetched$: Subject<ExtendedUserInfo> = new ReplaySubject<ExtendedUserInfo>(1);

    constructor(userSession: UserSession, authService: AuthService, submService: SubmissionService) {

        userSession.created$.subscribe(created => {
            if (created) {
                forkJoin(
                    authService.checkUser(),
                    submService.getProjects()
                ).subscribe(results => {
                    const userInfo = <ExtendedUserInfo>results[0];
                    userInfo.projects = results[1].map(project => project.accno);

                    this.whenFetched$.next(userInfo);
                    this.whenFetched$.complete();
                });
            }
        });
    }

    get info$(): Observable<ExtendedUserInfo> {
        return this.whenFetched$;
    }

    get secretId$(): Observable<string> {
        return this.info$.pipe(
            map(ui => ui.secret)
        );
    }

    get projectAccNumbers$(): Observable<string[]> {
        return this.info$.pipe(
            map(ui => ui.projects)
        );
    }

    filteredProjectAccNumbers$(availableProjects: string[]): Observable<string[]> {
        return this.projectAccNumbers$.pipe(
            map(projects => projects.map(p => p.toLowerCase())),
            map(projects => projects.filter(p => availableProjects.includes(p))),
            map(filtered => [...['default'], ...filtered]));
    }

    get role(): UserRole {
        return UserRole.User;
    }

    get isPrivileged(): boolean {
        return this.role !== UserRole.Public;
    }
}
