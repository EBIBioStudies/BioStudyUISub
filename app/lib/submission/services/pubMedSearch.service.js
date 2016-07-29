export default class PubMedSearchService {
    constructor($http, $q, $log) {
        "ngInject";

        Object.assign(this, {
            search(pmid) {
                if (!pmid) {
                    $log.warn("PubMedSearchService: Empty pubMedId");
                    return $q.reject({ status: "FAILED" });
                }
                return $http.get("/api/pubMedSearch/" + pmid).then(
                        function (response) {
                            $log.debug("PubMedSearchService response:", response);
                            return response.data;
                        }, function (error) {
                            $log.error("pubMed search request error", error);
                            return error;
                        });
            }
        });
    }
}
