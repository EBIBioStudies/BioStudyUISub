/**
 * Created by mdylag on 04/09/2014.
 */
'use strict';
var routing = require('../../../.gen/config.json').routing;



module.exports = function ($http, $window, $q,$location, $rootScope, $cookieStore, $log, Xml2Json) {

    var X2JS = new Xml2Json();

    this.get = function(pmid) {
        var defer = $q.defer();

        if (!pmid) {
            $q.reject({statusText: 'PMID can not be null'});
        } else {
            //http://www.ebi.ac.uk/europepmc/webservices/rest/search?query=ext_id:78184
            $http.get('http://www.ebi.ac.uk/europepmc/webservices/rest/search', {params : {query : 'ext_id:' + pmid}}).then(
                function(resp) {
                    var json = X2JS.xml_str2json(resp.data);
                    var data = json.responseWrapper.resultList.result || {};
                    defer.resolve(data);
                    $log.debug('success pcm', resp, json.responseWrapper.resultList.result, json.responseWrapper.hitCount);
                },
                function(err) {
                    $log.debug('error pcm', err);
                    defer.reject(err);

                }
            );
        }
        return defer.promise;

    };

};
