import {Injectable} from '@angular/core';
import {BehaviorSubject}    from 'rxjs/BehaviorSubject';

@Injectable()
export class UserSessionEvents {

    private sessionCreated = new BehaviorSubject<boolean>();

    userSessionCreated$ = this.sessionCreated.asObservable();

    userSessionCreated() {
        this.sessionCreated.next(true);
    }

    userSessionDestroyed() {
        this.sessionCreated.next(false);
    }
}