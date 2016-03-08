'use strict';
var config = require('../../../.gen/config.json');
//console.log(config.routing);


module.exports = {

    init : function($injector) {
        this.$httpBackend = $injector.get('$httpBackend');
        this.$rootScope = $injector.get('$rootScope');
        this.$controller = $injector.get('$controller');
    },

    getAuthServiceMock : function() {
        return {
            isSignedIn : function(user) {
                return true;
            }


    };
    }
};
