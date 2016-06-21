'use strict';

module.exports =
    (function () {

        return ['$http', '$q', function ($http, $q) {

            function searchById(pmid) {
                var defer = $q.defer();
                $http.get("/api/pubMedSearch/" + pmid)
                    .then(
                        function (response) {
                            defer.resolve(response.data);
                        }, function () {
                            $log.error("pubmed search request error", response);
                            defer.reject();
                        });
                return defer.promise;
            }
            return {
                search: searchById
            }
        }];

    })();