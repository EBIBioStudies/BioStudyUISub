export default class PubMedSearchService {
    constructor($http, $q) {
        "ngInject";

        Object.assign(this, {
            search(pmid) {
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
        });
    }
}
