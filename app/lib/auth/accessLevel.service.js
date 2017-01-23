export default class AccessLevel {
    constructor(USER_ROLES) {
        'ngInject';

        const accessLevels = {
            'anon': [USER_ROLES.public],
            'user': [USER_ROLES.user, USER_ROLES.admin],
            'admin': [USER_ROLES.admin]
        };

        Object.assign(this, {
            roles(level) {
                if (!accessLevels.hasOwnProperty(level)) {
                    level = 'admin';
                }
                return accessLevels[level];
            }
        })
    }
}
