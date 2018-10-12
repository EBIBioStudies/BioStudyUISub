import {Injectable} from '@angular/core';

import {UserRole} from './user-role';
import {AuthService} from './auth.service';
import {UserSession} from './user-session';

import {forkJoin} from 'rxjs/observable/forkJoin';
import {SubmissionService} from '../submission/shared/submission.service';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {UserInfo} from './model/user-info';
import {map} from 'rxjs/operators';

@Injectable()
export class UserData {

    private whenFetched$: Subject<UserInfo> = new ReplaySubject<UserInfo>(1);

    constructor(userSession: UserSession, authService: AuthService, submService: SubmissionService) {

        userSession.created$.subscribe(created => {
            if (created) {
                forkJoin(
                    authService.checkUser(),
                    submService.getProjects()
                ).subscribe(results => {
                    const userInfo = results[0];
                    userInfo.projects = results[1].map(project => project.accno);

                    this.whenFetched$.next(userInfo);
                    this.whenFetched$.complete();
                });
            }
        });
    }

    get info$(): Observable<UserInfo> {
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
        return this.role != UserRole.Public;
    }
}