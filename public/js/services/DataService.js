/**
 * Created by mdylag on 04/09/2014.
 */
'use strict';

var routingConfig = require('../routeConfig');
var routing = require('../../../.gen/config.json').routing;

var subroute = routing.submission;
var userdata = routing.userdata;

var filesroute = routing.files;
var proxyRoute = routing.proxy;

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
    $log.debug('Data service created', proxyRoute);
    var annotationKeys = [{
        name : 'Name'},
        {name : 'Description'},
        {name : 'Title'},
        {name : 'Another key'}
    ];
    console.log('data1', proxyRoute.submission);

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
    dataService.getSubmission = function(accno) {
        var deffer = $q.defer();

        if (SharedData.submission.id) {
            $http.get(proxyRoute.submission.get.url + '/' + accno).then(function (response) {
                if (response.status === 200) {
                    console.log('Data',response.data);
                    deffer.resolve(response.data);
                } else {
                    deffer.reject(response);
                }
            }, function (err) {
                deffer.reject(err);
            });
        } else {
            deffer.resolve(SharedData.submission);
        }
        return deffer.promise;
    };

    dataService.getSubmissions = function(options) {
        var deffer = $q.defer();

        $http.get(proxyRoute.submission.list.url, options).then(function(response){
            $log.debug('data2', proxyRoute.submission.list.url, response.data);

            if (response.status===200) {
                var submissions=[];
                submissions=submissions.concat(response.data.submissions);
                deffer.resolve(submissions);
                $log.debug('data1', submissions, submissions);
            } else {
                deffer.reject(response);
            }
        }, function(err) {
            deffer.reject(err);
        });
        return deffer.promise;
    };


    function removeParent(submission) {
        angular.forEach(submission.sections, function(section, index) {
            delete section.parent;
            removeParent(section);
        });
    }

    dataService.saveUserData = function(submission) {
        var deffer = $q.defer();
        function success(response) {
            if (response.status===200) {
                console.log('Data saved', response.data, submission);
                deffer.resolve(response.data);
            } else {
                console.log('Error get user data');
                deffer.reject(response);
            }

        }

        function error(err) {
            console.log('Error to save data', err);
            deffer.reject(err);
        }

        var url=proxyRoute.submission.save.url;
        $http.post(url, submission).then(success, error);


        return deffer.promise;

    };

    dataService.submit = function(submission) {
        var defer = $q.defer();
        $http.post(proxyRoute.submission.create.url, wrapSubmission(submission))
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
        $http.put(proxyRoute.submission.update.url, wrapSubmission(submission))
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
            url = proxyRoute.submission.deleteSubmited.url + '/' + submission.accno;
        } else {
            url = proxyRoute.submission.delete.url + '/' + submission.accno;
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

    dataService.getFiles = function() {
        var defer = $q.defer();

        $http.get(proxyRoute.files.dir.url).success(function(data) {
            defer.resolve(data);
        }).error(function(err, status){
            console.log('Error get files', err);
            defer.reject(err, status);
        });

        return defer.promise;
    };

    dataService.deleteFile = function(file) {
        var defer = $q.defer();

        $http.delete(proxyRoute.files.delete.url+ '?file='+file.name).success(function(data) {
            defer.resolve(data);
        }).error(function(err, status){
            defer.reject(err, status);
        });

        return defer.promise;
    };



    return dataService;
};
