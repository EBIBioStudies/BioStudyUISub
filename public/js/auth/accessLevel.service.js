'use strict';

module.exports =
    (function () {
        return ['USER_ROLES', function (USER_ROLES) {
            var accessLevels = {
                'anon': [USER_ROLES.public],
                'user': [USER_ROLES.user, USER_ROLES.admin],
                'admin': [USER_ROLES.admin]
            };

            return {
                roles: function (level) {
                    if (!accessLevels.hasOwnProperty(level)) {
                        level = 'admin';
                    }
                    return accessLevels[level];
                }
            }
        }];
    })();
