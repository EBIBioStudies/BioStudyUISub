import {Injectable} from '@angular/core';

import * as _ from 'lodash';

import {UserRole} from './user-role';
import {AuthService} from './auth.service';
import {UserSession} from './user-session';
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";

@Injectable()
export class UserData {
    static contactMap = {       //maps response property to submission attribute name for contact data
        'email': 'e-mail',
        'username': 'name',
        'aux.orcid': 'orcid'    //allows flattening of nesting levels
    }
    private _whenFetched: Subject<any> = new Subject<any>();
    private isFetched: boolean = false;                         //flags when data has been fetched already

    /**
     * Waits until the session for the current user has been created to fetch the latter's data.
     * @param {UserSession} userSession - Async session manager.
     * @param {AuthService} authService - API interface for athentication-related server transactions
     */
    constructor(userSession: UserSession, authService: AuthService) {
        userSession.created$.subscribe(created => {
            created && authService.checkUser().subscribe(data => {
                _.merge(this, data);
                this._whenFetched.next(data);
                this.isFetched = true;
                this._whenFetched.complete();
            });
        });
    }

    /**
     * Creates an observable normalised to resolve instantly if the user data has already been retrieved.
     * @returns {Observable<any>} Observable from subject
     */
    get whenFetched(): Observable<any> {
        if (this.isFetched) {
            return Observable.of(true);     //dummy observable in case user data has already been fetched
        } else {
            return this._whenFetched.asObservable();
        }
    }

    /**
     * Creates a new object from the one fetched from the server, changing the names and/or hierarchy of
     * properties and normalising any undefined property as an empty string.
     * @returns {Object} Object containing contact data.
     */
    get contact(): object {
        const userData = this;      //gives context to eval op later on
        const contactObj = {};

        //Flattens contact object according to pre-defined map
        Object.keys(UserData.contactMap).forEach((keyToChange) => {
            let userDatum;

            try {
                userDatum = eval('userData.' + keyToChange) || '';
            } catch (exception) {
                userDatum = '';
            }
            contactObj[UserData.contactMap[keyToChange]] = userDatum;
        });

        return contactObj;
    }

    /**
     * Convenience method to determine if the user's role.
     * @returns {UserRole} Public (hard-coded for the moment).
     */
    get role(): UserRole {
        return UserRole.User;
    }

    /**
     * Convenience method to determine if the user has any priviledges.
     * @returns {boolean} True if the user enjoys any privileges.
     */
    get isPrivileged() : boolean {
        return this.role != UserRole.Public;
    }
}