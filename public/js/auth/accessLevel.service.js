'use strict';

module.exports =
    (function () {

        return ['USER_ROLES', function (USER_ROLES) {
            var accessLevels = {
                    'anon': ['public'],
                    'user' : ['user', 'admin'],
                    'admin': ['admin']
            }

            return {
                roles: function(level) {

                },
                get: function(str) {

                }
            }
        }];
    })();
