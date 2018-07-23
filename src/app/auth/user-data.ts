import {Injectable} from '@angular/core';

import * as _ from 'lodash';

import {UserRole} from './user-role';
import {AuthService} from './auth.service';
import {UserSession} from './user-session';
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";
import {forkJoin} from "rxjs/observable/forkJoin";
import {SubmissionService} from "../submission/shared/submission.service";

const SECRET_ID_PROP_NAME = 'secret';

@Injectable()
export class UserData {
    static contactMap = {       //maps response property to submission attribute name for as shown in contact widget
        'email': 'E-mail',
        'username': 'Name',
        'aux.orcid': 'ORCID'    //dot notation allows flattening of nesting levels
    }
    private _whenFetched: Subject<any> = new Subject<any>();
    private isFetched: boolean = false;                         //flags when data has been fetched already

    /**
     * Waits until the session for the current user has been created to fetch the latter's data.
     * @param {UserSession} userSession - Async session manager.
     * @param {AuthService} authService - API interface for authentication-related server transactions
     */
    constructor(userSession: UserSession, authService: AuthService, submService: SubmissionService) {

        //NOTE: Given the dependency between session and authentication, the two are marshalled in the right order here.
        userSession.created$.subscribe(created => {
            let whenChecked;
            let whenACLFetched;
            let eventStream;

            //Retrieves the actual user's data, including allowed projects to submit to.
            //NOTE: Projects will be fetched only once instead of every time a view is rendered.
            if (created) {
                eventStream = forkJoin([
                    whenChecked = authService.checkUser(),
                    whenACLFetched = submService.getProjects()
                ]);
                eventStream.subscribe(results => {
                    const userData = results[0];
                    const projectData = results[1];

                    //Grabs the project names and appends the list to the other user data
                    userData['projects'] = projectData;
                    _.merge(this, userData);

                    //Signals that user data is available.
                    this._whenFetched.next(userData);
                    this.isFetched = true;
                    this._whenFetched.complete();
                });
            }
        });
    }

    /**
     * Creates an observable normalised to resolve instantly if the user data has already been retrieved.
     * @returns {Observable<any>} Observable from subject.
     */
    get whenFetched(): Observable<any> {
        if (this.isFetched) {
            return Observable.of(this);
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
     * Retrieves the ID for sharing submissions or using FTP/Aspera
     * @returns {string} - Secret ID.
     */
    get secretId(): string {
        if (this.hasOwnProperty(SECRET_ID_PROP_NAME)) {
            return this[SECRET_ID_PROP_NAME];
        }
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
    get isPrivileged(): boolean {
        return this.role != UserRole.Public;
    }

    /**
     * Extracts as an array the names of the projects this user is allowed to attach to. Notice that it can
     * differ substantially from the projects that are available.
     * @returns {string[]} Project names.
     */
    projectNames(): string[] {
        let projNames = [];

        if (this.hasOwnProperty('projects')) {
            projNames = this['projects'].map((project) => project.accno);
        }

        return projNames;
    }

    /**
     * Returns only the names of the available projects the user is allowed to attach to. Effectively,
     * the list of user projects coming from the server acts as an ACL for available projects. It uses a
     * normalised comparison of strings to intersect the two project lists.
     * @param {string[]} availableProjects - Names of the projects that are available.
     * @returns {string[]} Names of the allowed projects as the provided in availableProjects list.
     */
    allowedProjects(availableProjects: string[]): string[] {
        const lowerCaseAllowedPrj = this.projectNames().map(name => name.toLowerCase());

        return availableProjects.filter(name => {
            const lowerCasePrj = name.toLowerCase();

            //The default template must be available at all times and appear first on any list.
            return (lowerCasePrj == 'default') || lowerCaseAllowedPrj.indexOf(lowerCasePrj) != -1;
        });
    }
}