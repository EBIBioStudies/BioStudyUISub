'use strict';
var passport =  require('passport'),
    User = require('../models/User.js'),
    config = require('config');

module.exports = {
    register: function(req, res, next) {

        if (!req.body.login)
        {
            res.json(200, { 'status': 'FAIL', 'message': 'login parameter is not defined'});
        }
    },

    login: function(req, res, next) {
        passport.authenticate('local', function(err, user) {
            if(err)     {
                console.log('error');
                return next(err);
            }
            if(!user)   {
                console.log(req.body, user);

                console.log('Login');
                return res.format({
                    json: function () {
                        var model = { status : 'fail' };
                        res.json(200, model);
                    }
                });
            }


            req.logIn(user, function(err) {

                if(err) {
                    return next(err);
                }

                if(req.body.rememberme) {
                    req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
                }
                console.log('Login ok');

                res.format({
                    json: function () {
                        var model = { 'status': 'OK', 'username': user.username };
                        res.json(200, model);
                    }
                });
            });
        })(req, res, next);
    },

    logout: function(req, res) {
        req.logout();
        res.send(200);
    }
};