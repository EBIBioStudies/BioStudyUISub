import {Injectable} from '@angular/core';
import {Subject}    from 'rxjs/Subject';

@Injectable()
export class AuthEvents {

    private userSignedInSource = new Subject<string>();

    private userSignedOutSource = new Subject<string>();

    userSignedIn$ = this.userSignedInSource.asObservable();
    userSignedOut$ = this.userSignedOutSource.asObservable();


    userSignedIn(name: string) {
        this.userSignedInSource.next(name);
    }

    userSignedOut(name: string) {
        this.userSignedOutSource.next(name);
    }
}