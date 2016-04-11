/**
 * Created by mdylag on 04/09/2014.
 */
'use strict';

var routingConfig = require('../routeConfig');
var routing =
    (function (routs) {
        return {
            urlFor: function (p) {
                return routs.context + routs.routing[p].url;
            }
        }
    }(require('../../../.gen/routing.json')));

/**
 * Function wrap submission by
 * {submissions: [submission]}
 * @param submission
 */
function wrapSubmission(submission) {
   return {
       submissions: [submission]
   };
}

module.exports = function ($http, $window, $location,
                           $rootScope, $log, $q, SubmissionModel, SharedData) {
    var annotationKeys = [{
        name : 'Name'},
        {name : 'Description'},
        {name : 'Title'},
        {name : 'Another key'}
    ];

    var sources=[{name: 'ArrayExpress'},{name: 'GEOD'}];
    var submissions = [];
    var dataService = {};
    dataService.submission = undefined;
    dataService.files = undefined;

    dataService.userDataSubm=[];

    dataService.getAnnotationKeys = function() {
        return annotationKeys;
    };

    dataService.getSources = function() {
        return sources;
    };

    /*function getUserDataSubm() {
        var deffer = $q.defer();
        $http.get(userdata.list.url).then(function(response) {
            if (response.status===200) {
                deffer.resolve(response);
            } else {
                deffer.reject(response);
            }
        }, function(err) {
            deffer.reject(err);
        });
        return deffer.promise;

    }*/





    function removeParent(submission) {
        angular.forEach(submission.sections, function(section, index) {
            delete section.parent;
            removeParent(section);
        });
    }



    dataService.submit = function(submission) {
        var defer = $q.defer();
        $http.post(routing.urlFor("submission_create"), wrapSubmission(submission))
            .success(function(data) {
                console.log('submission created service', typeof data);
                //submissions.push(submission);
                defer.resolve(data);
          }).error(function(err, status){
              defer.reject(err, status);
          });
          return defer.promise;

    };

    dataService.update = function(submission) {
        $log.debug('Update', submission, JSON.stringify(submission));
        var defer = $q.defer();

        //if exists update()
        //else create
        //removeParent(submission);
        $http.put(routing.urlFor("submission_update"), wrapSubmission(submission))
            .success(function(data) {
                console.log('submission updated', data);
                defer.resolve(data);
            }).error(function(err, status){
                defer.reject(err, status);
            });
        return defer.promise;

    };

    dataService.delete = function(submission) {
        var defer = $q.defer();
        var url = '';
        if (submission.id) {
            url = routing.urlFor("submission_delete") + '/' + submission.accno;
        } else {
            url = routing.urlFor("tmp_submission_delete") + '/' + submission.accno;
        }
            console.log('Delete submitted submission', url);
            $http.delete(url)
                .success(function(data) {
                    console.log('delete ok',data);
                    defer.resolve(data);
                }).error(function(err, status){
                    console.log('delete err',err);
                    defer.reject(err, status);
                });

        return defer.promise;
    };



    return dataService;
};
