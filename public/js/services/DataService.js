/**
 * Created by mdylag on 04/09/2014.
 */
'use strict';

module.exports = function () {

    var dataService = {};

    dataService.getAnnotationKeys = function () {
        return [
            {name: 'Name'},
            {name: 'Description'},
            {name: 'Title'},
            {name: 'Another key'}
        ];
    };

    dataService.getSources = function () {
        return [
            {name: 'ArrayExpress'},
            {name: 'GEOD'}
        ];
    };

    return dataService;
};
