'use strict';
module.exports = {
        ErrorMessages : {
            PASSWORD2_EMPTY : 'Password is required.',
            PASSWORD1_EMPTY : 'Password is required.',
            FIRSTNAME_EMPTY : 'First name is required.',
            LASTNAME_EMPTY : 'Lastname name is required.',
            EMAIL_EMPTY : 'Email is required.',
            PASSWORD_NOTEQAL : 'Passwords don\'t match.',
            NOT_AUTHORIZED : 'You are not singed in',
            EMAIL_INVALID : 'Type a valid email.',
            USERNAME_EMPTY: 'Username is required.'
        },
        Status : {
            OK : 'OK',
            FAIL : 'FAIL'
        },
        ServerPath : {
            upload : {path: '/upload', method: 'POST'},
            gettree: {path: 'gettree', method: ''},
            getsubmissions: {},
            submit: {},
            save: {},
            signin: {},
            signup: {}

        },
        FormMode: {
            EDIT : 'EDIT',
            ADD : 'ADD'
        }
};


