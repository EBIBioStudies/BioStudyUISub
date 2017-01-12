import {Injectable} from '@angular/core';
import {BehaviorSubject}    from 'rxjs/BehaviorSubject';

@Injectable()
export class UserSessionEvents {

    private sessionCreated = new BehaviorSubject<string>();

    private sessionDestroyed = new BehaviorSubject<string>();

    userSessionCreated$ = this.sessionCreated.asObservable();
    userSessionDestroyed$ = this.sessionDestroyed.asObservable();

    userSessionCreated(name: string) {
        this.sessionCreated.next(name);
    }

    userSessionDestroyed(name: string) {
        this.sessionDestroyed.next(name);
    }
}