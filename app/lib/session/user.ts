import {UserRole} from './user-role';

export class User {
    static uid:string = '1.0';

    constructor(public key: string = '',
                public name: string = '',
                public email: string = '',
                public orcid: string = '',
                public role: UserRole = UserRole.Public) {
    }

    toArray() {
        return [
            User.uid,
            this.key,
            this.name,
            this.email,
            this.orcid,
            this.role];
    }

    isAnonymous() {
        return this.key === '';
    }

    static fromArray(arr) {
        if (!arr || arr[0] !== User.uid) {
            return null;
        }
        let len = arr.length;
        return new User(
            len > 1 ? arr[1] : undefined,
            len > 2 ? arr[2] : undefined,
            len > 3 ? arr[3] : undefined,
            len > 4 ? arr[4] : undefined,
            len > 5 ? arr[5] : undefined
        )
    }

    static anonymous() {
        return new User();
    }
}