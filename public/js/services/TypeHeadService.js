/**
 * Created by mdylag on 04/09/2014.
 */
'use strict';


module.exports = function ($http, $window, $location,
                           $rootScope) {
    var typeHeadService = {


        annotationKeys : [
            {name : 'Name'},
            {name : 'Description'},
            {name : 'Title'},
            {name : 'Anotherdasdsad key'}
        ],
        sourceKeys : [{name: 'ArrayExpress'},{name: 'GEOD'}],
        author: [
            {name : 'Name'},
            {name : 'affiliation'}
        ],
        organization: [{name: 'Name'}]
    };

    return typeHeadService;
};
