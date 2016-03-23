/**
 * Created by mdylag on 04/09/2014.
 */
'use strict';

var routingConfig = require('../routeConfig');
//var routing = require('../config/development.json').routing;
var routing = require('../../../.gen/config.json').routing;
var proxyRoute = routing.proxy;





module.exports = function ($http, $window, $q,$location, $rootScope, $cookieStore, $log, MessageService) {

    var accessLevels = routingConfig.accessLevels,
        userRoles = routingConfig.userRoles,
        currentUser = $cookieStore.get('user') || { username: '', role: userRoles.public };

    $http.defaults.useXDomain = true;
    $cookieStore.remove('user');
    $log.debug('Auth service created');

    function changeUser(user) {
        angular.extend(currentUser, user);
    }

    /*$scope.watch('currentUser', function() {
        console.log('watch current user in service');
    });*/

    var authService = {};

    authService.accessLevels = accessLevels;
    authService.userRoles = userRoles;
    authService.currentUser = currentUser;
    authService.currentUrl='/home';

    authService.authorize = function(accessLevel, role) {
        if(role === undefined) {
            role = currentUser.role;
        }

        return accessLevel.bitMask & role.bitMask;
    };

    authService.isSignedIn=function(user) {
        if(user === undefined) {
            user = currentUser;
        }
        return user.role.title === userRoles.user.title || user.role.title === userRoles.admin.title;
    };


    authService.signUp = function(user) {
        var defer = $q.defer();
        console.log('signup', user, JSON.stringify(user));
        $http.post(proxyRoute.auth.signup.url, user)
            .success(function(data, status) {
                $log.debug('Success signup', data, status);

                if (status===200 && data.status===$rootScope.Constants.Status.OK) {
                    defer.resolve(data);
                } else {
                    console.log('Error', data, status);
                    defer.reject({status: data.status, message: data.status});
                }
            })
            .error(function(err, status) {
                $log.debug('Error signup', err, status);
                defer.reject(err, status);

            });
        return defer.promise;

    };

    authService.signIn = function(user) {
        $log.debug('Sign in url - info',routing.signin.url, user);
        var defer = $q.defer();
        $http.post(routing.signin.url,user)
            .success(function(result) {
              $log.debug('Sign in result',result);

              if (result.status===$rootScope.Constants.Status.OK) {
                   $http.post(proxyRoute.auth.register.url, result).then(function success(res) {
                       console.log('registered', proxyRoute.auth.register.url);
                       defer.resolve(user, result, authService.currentUrl);

                   }, function error(err) {
                       console.log('fail register', proxyRoute.auth.register.url, err);
                       defer.reject({status: result.status, message:'Wrong credentials'});

                   });

                    //$cookieStore.put('sessid',result.sessid);
                    user.role=userRoles.user;
                    user.password=null;
                    changeUser(user);
                }
                else {
                    defer.reject({status: result.status, message:'Wrong credentials'});
                }
            })
            .error(function(data, status, headers) {
                //MessageService.parseError(data, status, header);
                console.log('error',data, status, headers);
                defer.reject({status: status || 500, message: data.status || 'Problem with connection to biostudy server' });
            });
        return defer.promise;

    };
    authService.signOut = function() {
        var defer = $q.defer();

        $log.debug('Signout',currentUser.username);
        $http.post(proxyRoute.auth.signout.url, currentUser.username).then(
            function(data) {
                var user = {
                    username: '',
                    role: userRoles.public
                };
                changeUser(user);
                defer.resolve(user);
            },
            function(err) {
                console.log('Err sign out');
                var user = {
                    username: '',
                    role: userRoles.public
                };
                changeUser(user);

                defer.reject(err);
            });
        return defer.promise;

    };

    return authService;
};
