import {Injectable} from '@angular/core';
import {Subject}    from 'rxjs/Subject';

@Injectable()
export class UserSessionEvents {

    private sessionCreated = new Subject<string>();

    private sessionDestroyed = new Subject<string>();

    userSessionCreated$ = this.sessionCreated.asObservable();
    userSessionDestroyed$ = this.sessionDestroyed.asObservable();

    userSessionCreated(name: string) {
        this.sessionCreated.next(name);
    }

    userSessionDestroyed(name: string) {
        this.sessionDestroyed.next(name);
    }
}